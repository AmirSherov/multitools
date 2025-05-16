from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import mimetypes
from django.http import FileResponse, JsonResponse, Http404
from .instagram import InstagramDownloader
from django.utils.text import slugify
from authentication.stats import track_tool_usage
import traceback  

class InstagramView(APIView):
    def post(self, request):
        """Получение информации о публикации Instagram"""
        track_tool_usage(request, 'Instagram')

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
        track_tool_usage(request, 'download_instagram')
                
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
        