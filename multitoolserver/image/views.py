from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from authentication.models import UserToken
from .removebg import remove_background
import traceback
from authentication.stats import track_tool_usage
class RemoveBackgroundView(APIView):
    """
    API endpoint для удаления фона из изображения.
    """
    parser_classes = [MultiPartParser]
    
    def post(self, request):
        track_tool_usage(request, 'Удалить фон')
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Token '):
                return Response({'detail': 'Неверный формат токена авторизации'}, status=401)
            token_key = auth_header.split(' ')[1]
            try:
                token = UserToken.objects.get(token=token_key, is_active=True)
                if not token.is_valid():
                    token.is_active = False
                    token.save()
                    return Response({'detail': 'Токен просрочен'}, status=401)
                request.user = token.user
            except UserToken.DoesNotExist:
                return Response({'detail': 'Недействительный токен'}, status=401)
            if 'image' not in request.FILES:
                return Response(
                    {'success': False, 'error': 'Изображение не предоставлено'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            image_file = request.FILES['image']
            if image_file.size > 5 * 1024 * 1024:
                return Response(
                    {'success': False, 'error': 'Размер файла превышает 5MB'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not image_file.content_type.startswith('image/'):
                return Response(
                    {'success': False, 'error': 'Файл должен быть изображением'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            image_data = image_file.read()
            result = remove_background(image_data)
            
            if result['success']:
                if hasattr(request.user, 'profile'):
                    profile = request.user.profile
                    if hasattr(profile, 'record_tool_usage'):
                        profile.record_tool_usage('image_removebg')
            
            return Response(result, status=status.HTTP_200_OK if result['success'] else status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(traceback.format_exc())
            return Response(
                {'success': False, 'error': f'Ошибка при обработке: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
