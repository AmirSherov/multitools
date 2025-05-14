import os
import json
import tempfile
import requests
import instaloader
import re
import subprocess
import sys
from pathlib import Path
from django.http import FileResponse, Http404, JsonResponse, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

class InstagramDownloader:
    """Класс для загрузки постов и рилсов с Instagram с использованием библиотеки instaloader"""
    
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()
        os.makedirs(self.temp_dir, exist_ok=True)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }

        self.L = instaloader.Instaloader(
            download_pictures=False,  
            download_videos=False,  
            download_video_thumbnails=False,
            download_geotags=False,
            download_comments=False,
            save_metadata=False,
            compress_json=False,
            post_metadata_txt_pattern=None,
            max_connection_attempts=3
        )
    
    def extract_media_url(self, url):
        """Извлекает URL медиа из поста или рилса Instagram с помощью instaloader"""
        try:
            if not (
                'instagram.com/p/' in url or 
                'instagram.com/reel/' in url or 
                'instagram.com/tv/' in url
            ):
                return {
                    'success': False,
                    'error': 'Неверный URL Instagram. Поддерживаются только посты, рилсы и IGTV.'
                }
            
            post_code = None
            if '/p/' in url:
                post_code = url.split('/p/')[1].split('/')[0]
            elif '/reel/' in url:
                post_code = url.split('/reel/')[1].split('/')[0]
            elif '/tv/' in url:
                post_code = url.split('/tv/')[1].split('/')[0]
            
            if not post_code:
                return {
                    'success': False,
                    'error': 'Не удалось извлечь код поста из URL'
                }
            try:
                post = instaloader.Post.from_shortcode(self.L.context, post_code)
            except instaloader.exceptions.InstaloaderException as e:
                return {
                    'success': False,
                    'error': f'Ошибка при получении информации о публикации: {str(e)}'
                }
            

            is_video = getattr(post, 'is_video', False)
            is_carousel = False
            try:
                is_carousel = hasattr(post, 'get_sidecar_nodes') and len(list(post.get_sidecar_nodes())) > 0
            except:
                pass
                
            title = getattr(post, 'caption', f"Instagram {post_code}")
            if not title or len(str(title)) < 3:
                title = f"Instagram {post_code}"
            
            username = getattr(post, 'owner_username', 'instagram_user')
            

            def get_safe_thumbnail(obj):
                for attr in ['display_url', 'url', 'video_url', 'thumbnail_url']:
                    try:
                        if hasattr(obj, attr):
                            value = getattr(obj, attr)
                            if value:
                                return value
                    except:
                        continue
                return "https://via.placeholder.com/400x400.png?text=Instagram+Media"
            
            media_list = []
            if is_carousel:
                try:
                    for i, node in enumerate(post.get_sidecar_nodes()):
                        node_is_video = getattr(node, 'is_video', False)
                        
                        if node_is_video:
                            video_url = getattr(node, 'video_url', None)
                            if video_url:
                                media_list.append({
                                    'type': 'video', 
                                    'url': video_url,
                                    'thumbnail': get_safe_thumbnail(node),
                                    'index': i + 1
                                })
                        else:
                            image_url = get_safe_thumbnail(node)
                            if image_url:
                                media_list.append({
                                    'type': 'image', 
                                    'url': image_url,
                                    'index': i + 1
                                })
                except Exception as e:
                    print(f"Ошибка при обработке карусели: {str(e)}")
            elif is_video:
                try:
                    video_url = getattr(post, 'video_url', None)
                    if video_url:
                        thumbnail_url = get_safe_thumbnail(post)
                        media_list.append({
                            'type': 'video', 
                            'url': video_url,
                            'thumbnail': thumbnail_url
                        })
                except Exception as e:
                    print(f"Ошибка при обработке видео: {str(e)}")
            else:
                try:
                    image_url = get_safe_thumbnail(post)
                    if image_url:
                        media_list.append({
                            'type': 'image', 
                            'url': image_url
                        })
                except Exception as e:
                    print(f"Ошибка при обработке изображения: {str(e)}")
            
            if not media_list:
                return {
                    'success': False,
                    'error': 'Не удалось найти медиафайлы в публикации'
                }
            
            post_thumbnail = get_safe_thumbnail(post)
            
            return {
                'success': True,
                'data': {
                    'code': post_code,
                    'title': title,
                    'username': username,
                    'type': 'carousel' if is_carousel else ('video' if is_video else 'image'),
                    'media': media_list,
                    'thumbnail': post_thumbnail
                }
            }
            
        except Exception as e:
            print(f"Ошибка при извлечении URL из Instagram: {str(e)}")
            return {
                'success': False,
                'error': f'Произошла ошибка при обработке URL: {str(e)}'
            }
    
    def download_media(self, media_url, media_type, file_name=None):
        """Скачивает медиафайл по указанному URL"""
        try:
            if not file_name:
                file_name = f"instagram_{int(os.times().elapsed)}"
            
            ext = 'mp4' if media_type == 'video' else 'jpg'
            output_file = os.path.join(self.temp_dir, f"{file_name}.{ext}")
            
            response = requests.get(media_url, headers=self.headers, stream=True)
            
            if response.status_code != 200:
                print(f"Ошибка при скачивании: код {response.status_code}")
                return None
            
            with open(output_file, 'wb') as f:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        f.write(chunk)
            
            if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
                return output_file
            else:
                print("Файл не был скачан или имеет нулевой размер")
                return None
            
        except Exception as e:
            print(f"Ошибка при скачивании медиа: {str(e)}")
            return None

@csrf_exempt
def proxy_thumbnail(request):
    url = request.GET.get('url')
    if not url:
        return HttpResponse(status=400)
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            content_type = resp.headers.get('Content-Type', 'image/jpeg')
            response = HttpResponse(resp.content, content_type=content_type)
            response['Access-Control-Allow-Origin'] = '*'
            return response
        else:
            return HttpResponse(status=resp.status_code)
    except Exception as e:
        print(f'Ошибка при проксировании миниатюры: {e}')
        return HttpResponse(status=500)
