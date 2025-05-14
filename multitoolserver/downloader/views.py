from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import mimetypes
from django.http import FileResponse, JsonResponse, Http404
from .download import YouTubeDownloader
from .instagram import InstagramDownloader
from django.utils.text import slugify

class YouTubeView(APIView):
    def post(self, request):
        """Получение информации о видео"""
        url = request.data.get('url')
        
        if not url:
            return JsonResponse({
                'error': 'URL не указан'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        downloader = YouTubeDownloader()
        info = downloader.get_video_info(url)
        
        if not info:
            return JsonResponse({
                'error': 'Не удалось получить информацию о видео'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return JsonResponse({
            'success': True,
            'data': info
        }, status=status.HTTP_200_OK)
    
    def get(self, request):
        """Скачивание видео"""
        url = request.GET.get('url')
        format_id = request.GET.get('format_id')
        ext = request.GET.get('ext', 'mp4')
        
        if not url or not format_id:
            return JsonResponse({
                'error': 'URL или формат не указаны'
            }, status=status.HTTP_400_BAD_REQUEST)
        if ext not in ['mp4', 'mp3']:
            ext = 'mp4'  
        downloader = YouTubeDownloader()
        info = downloader.get_video_info(url)
        if not info:
            return JsonResponse({
                'error': 'Не удалось получить информацию о видео'
            }, status=status.HTTP_400_BAD_REQUEST)
        file_path = downloader.download_video(url, format_id, ext)
        
        if not file_path or not os.path.exists(file_path):
            return JsonResponse({
                'error': 'Не удалось скачать видео'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        title = slugify(info.get('title', 'video'))
        if len(title) > 100:
            title = title[:100]  
        
        filename = f"{title}.{ext}"
        
        content_type, _ = mimetypes.guess_type(file_path)
        if not content_type:
            content_type = 'application/octet-stream'
        response = FileResponse(
            open(file_path, 'rb'),
            content_type=content_type
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        
class InstagramView(APIView):
    def post(self, request):
        """Получение информации о публикации Instagram"""
        url = request.data.get('url')
        
        if not url:
            return JsonResponse({
                'error': 'URL не указан'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        downloader = InstagramDownloader()
        result = downloader.extract_media_url(url)
        
        if not result.get('success'):
            return JsonResponse({
                'error': result.get('error', 'Не удалось получить информацию о публикации')
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return JsonResponse({
            'success': True,
            'data': result.get('data')
        }, status=status.HTTP_200_OK)
    
    def get(self, request):
        """Скачивание медиа из Instagram"""
        media_url = request.GET.get('media_url')
        media_type = request.GET.get('media_type', 'image')
        title = request.GET.get('title', 'instagram_media')
        
        if not media_url:
            return JsonResponse({
                'error': 'URL медиа не указан'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        downloader = InstagramDownloader()
        file_path = downloader.download_media(media_url, media_type, title)
        
        if not file_path or not os.path.exists(file_path):
            return JsonResponse({
                'error': 'Не удалось скачать медиа'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        ext = 'mp4' if media_type == 'video' else 'jpg'
        filename = f"{slugify(title)}.{ext}"
        
        content_type, _ = mimetypes.guess_type(file_path)
        if not content_type:
            content_type = 'application/octet-stream'
        
        response = FileResponse(
            open(file_path, 'rb'),
            content_type=content_type
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        