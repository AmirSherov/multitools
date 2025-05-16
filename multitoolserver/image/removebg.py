from rembg import remove
from PIL import Image
import os
import io
import base64
from django.conf import settings

def remove_background(input_image_data):
    """
    Удаляет фон из изображения, используя библиотеку rembg.
    
    Args:
        input_image_data: Бинарные данные изображения
        
    Returns:
        dict: Словарь с результатом обработки
    """
    try:
        input_img = Image.open(io.BytesIO(input_image_data))
        output_img = remove(input_img)
        output_buffer = io.BytesIO()
        output_img.save(output_buffer, format='PNG')
        output_buffer.seek(0)
        result_base64 = base64.b64encode(output_buffer.getvalue()).decode('utf-8')
        
        return {
            'success': True,
            'image': result_base64
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        } 