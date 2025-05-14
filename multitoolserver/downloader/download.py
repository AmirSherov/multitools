import os
import json
import tempfile
import yt_dlp
import subprocess
import sys
from pathlib import Path
from django.http import FileResponse, Http404, JsonResponse
from django.conf import settings

class YouTubeDownloader:
    """Класс для загрузки видео с YouTube с использованием yt-dlp"""
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()
        os.makedirs(self.temp_dir, exist_ok=True)
        self.ffmpeg_path = self._find_ffmpeg()
        
    def _find_ffmpeg(self):
        """Находит путь к ffmpeg"""
        possible_paths = [
            r"C:\ffmpeg-master-latest-win64-lgpl\bin\ffmpeg.exe",
            r"C:\ffmpeg\bin\ffmpeg.exe",
            "/usr/bin/ffmpeg",
            "/usr/local/bin/ffmpeg"
        ]
        try:
            result = subprocess.run(['where' if sys.platform == 'win32' else 'which', 'ffmpeg'], 
                                   capture_output=True, text=True)
            if result.returncode == 0 and result.stdout.strip():
                path = result.stdout.strip().split('\n')[0]
                print(f"FFmpeg найден в PATH: {path}")
                return path
        except Exception as e:
            print(f"Не удалось найти ffmpeg в PATH: {e}")
        for path in possible_paths:
            if os.path.exists(path):
                print(f"FFmpeg найден по пути: {path}")
                return path
        
        return None
    
    def get_video_info(self, url):
        """Получает информацию о видео по URL"""
        ydl_opts = {
            'format': 'best',
            'quiet': True,
            'no_warnings': True,
            'skip_download': True,
            'noplaylist': True,
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                if 'entries' in info:
                    info = info['entries'][0]
                formats = []
                audio_formats = []
                
                for f in info.get('formats', []):
                    if f.get('vcodec') == 'none':
                        if f.get('ext') == 'webm':
                            audio_formats.append({
                                'format_id': f['format_id'],
                                'ext': 'mp3',
                                'format_note': 'Audio',
                                'filesize': f.get('filesize', 0),
                                'filesize_approx': f.get('filesize_approx', 0),
                                'quality': f.get('quality', 0)
                            })
                    elif f.get('height') and f.get('height') > 0 and f.get('vcodec') != 'none':
                        formats.append({
                            'format_id': f['format_id'],
                            'ext': 'mp4',
                            'resolution': f"{f.get('height', 0)}p",
                            'filesize': f.get('filesize', 0),
                            'filesize_approx': f.get('filesize_approx', 0),
                            'fps': f.get('fps', 0),
                            'quality': f.get('quality', 0)
                        })

                resolution_formats = {}
                for f in formats:
                    resolution = f['resolution']
                    if resolution not in resolution_formats or \
                        f['quality'] > resolution_formats[resolution]['quality']:
                        resolution_formats[resolution] = f
                best_audio = None
                for f in audio_formats:
                    if not best_audio or f['quality'] > best_audio['quality']:
                        best_audio = f
                
                sorted_formats = sorted(
                    resolution_formats.values(), 
                    key=lambda x: int(x['resolution'].replace('p', '')),
                    reverse=True
                )
                if best_audio:
                    sorted_formats.append(best_audio)
                for fmt in sorted_formats:
                    filesize = fmt.get('filesize') or fmt.get('filesize_approx', 0)
                    if filesize > 0:
                        fmt['filesize_str'] = self._format_size(filesize)
                    else:
                        fmt['filesize_str'] = 'Неизвестно'
                
                return {
                    'id': info.get('id', ''),
                    'title': info.get('title', 'Неизвестное видео'),
                    'description': info.get('description', ''),
                    'thumbnail': info.get('thumbnail', ''),
                    'uploader': info.get('uploader', 'Неизвестно'),
                    'duration': info.get('duration', 0),
                    'duration_string': self._format_duration(info.get('duration', 0)),
                    'view_count': info.get('view_count', 0),
                    'formats': sorted_formats
                }
                
        except Exception as e:
            print(f"Ошибка при получении информации о видео: {e}")
            return None
    
    def download_video(self, url, format_id, ext='mp4'):
        """Скачивает видео в указанном формате"""
        output_file = None
        
        try:
            output_file = os.path.join(self.temp_dir, f"{format_id}_{int(os.times().elapsed)}.{ext}")
            
            ydl_opts = {
                'format': format_id,
                'outtmpl': output_file,
                'quiet': True,
                'no_warnings': True,
                'noplaylist': True,
            }
            
            if ext == 'mp3':
                if not self.ffmpeg_path:
                    raise Exception("FFmpeg не найден. Невозможно конвертировать в MP3.")
                
                ydl_opts.update({
                    'format': 'bestaudio/best',
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': '192',
                    }],
                    'ffmpeg_location': self.ffmpeg_path
                })
                output_file = output_file.replace('.mp3', '')
                output_file += '.mp3' 
            elif ext == 'mp4':
                if format_id == 'best':
                    ydl_opts['format'] = 'bestvideo+bestaudio/best'
                else:
                    ydl_opts['format'] = f"{format_id}+bestaudio/best"
                if self.ffmpeg_path:
                    ydl_opts['ffmpeg_location'] = self.ffmpeg_path
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            
            if os.path.exists(output_file):
                return output_file
            else:
                base_name = os.path.basename(output_file).split('.')[0]
                directory = os.path.dirname(output_file)
                
                for file in os.listdir(directory):
                    if file.startswith(base_name):
                        return os.path.join(directory, file)
                
                return None
        
        except Exception as e:
            print(f"Ошибка при скачивании видео: {e}")
            return None
    
    def _format_size(self, size_bytes):
        """Форматирует размер файла в человеко-читаемый вид"""
        if size_bytes < 1024:
            return f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes/1024:.1f} KB"
        elif size_bytes < 1024 * 1024 * 1024:
            return f"{size_bytes/(1024*1024):.1f} MB"
        else:
            return f"{size_bytes/(1024*1024*1024):.1f} GB"
    
    def _format_duration(self, seconds):
        """Форматирует длительность видео в человеко-читаемый вид"""
        if not seconds:
            return "Неизвестно"
        
        minutes, seconds = divmod(seconds, 60)
        hours, minutes = divmod(minutes, 60)
        
        if hours > 0:
            return f"{int(hours)}:{int(minutes):02d}:{int(seconds):02d}"
        else:
            return f"{int(minutes)}:{int(seconds):02d}"
