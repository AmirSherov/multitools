import { getCookie } from '../../../../utilits/cookies';
import { api_url } from '../../../../utilits/static';

/**
 * Отправляет изображение на сервер для удаления фона
 * @param {File} imageFile - Файл изображения
 * @returns {Promise<Object>} - Результат обработки
 */
export const removeImageBackground = async (imageFile) => {
  try {
    if (!imageFile) {
      return { success: false, error: 'Изображение не выбрано' };
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const token = getCookie('auth_token');
    
    if (!token) {
      return { success: false, error: 'Необходима авторизация' };
    }
    
    const response = await fetch(`${api_url}api/v1/tools/image/removebg/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        image: `data:image/png;base64,${data.image}`
      };
    } else {
      return {
        success: false,
        error: data.error || 'Произошла ошибка при обработке изображения'
      };
    }
  } catch (error) {
    console.error('Ошибка при обращении к API:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при обращении к серверу' 
    };
  }
};
