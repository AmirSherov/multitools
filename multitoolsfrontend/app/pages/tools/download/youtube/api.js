import { api_url } from '../../../../utilits/static';
import { getCookie } from '../../../../utilits/cookies';

/**
 * Получить информацию о видео по URL
 * @param {string} url - URL YouTube видео
 * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
 */
export const getVideoInfo = async (url) => {
  try {
    const token = getCookie('auth_token');
    
    if (!token) {
      return { success: false, data: null, error: 'Необходима авторизация' };
    }
    
    const response = await fetch(`${api_url}api/v1/tools/download/youtube/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ url })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data: data.data, error: null };
    } else {
      return { success: false, data: null, error: data.error || 'Ошибка получения информации о видео' };
    }
  } catch (error) {
    console.error('Ошибка при запросе информации о видео:', error);
    return { success: false, data: null, error: 'Ошибка соединения с сервером' };
  }
};

/**
 * Получить URL для скачивания видео
 * @param {string} url - URL YouTube видео
 * @param {string} formatId - ID формата видео
 * @param {string} ext - Расширение файла (mp4 или mp3)
 * @returns {string} URL для скачивания
 */
export const getDownloadUrl = (url, formatId, ext = 'mp4') => {
  const token = getCookie('auth_token');
  
  if (!token) {
    return null;
  }
  
  // Формируем URL для скачивания с учетом всех параметров
  const downloadUrl = new URL(`${api_url}api/v1/tools/download/youtube/`);
  downloadUrl.searchParams.append('url', url);
  downloadUrl.searchParams.append('format_id', formatId);
  downloadUrl.searchParams.append('ext', ext);
  
  return downloadUrl.toString();
};

/**
 * Скачать видео через AJAX и затем начать загрузку для пользователя
 * @param {string} url - URL YouTube видео
 * @param {string} formatId - ID формата видео
 * @param {string} ext - Расширение файла (mp4 или mp3)
 * @param {string} title - Название видео для файла
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const downloadVideo = async (url, formatId, ext = 'mp4', title = 'video') => {
  try {
    const token = getCookie('auth_token');
    
    if (!token) {
      return { success: false, error: 'Необходима авторизация' };
    }
    
    const downloadUrl = getDownloadUrl(url, formatId, ext);
    
    // Добавляем токен в заголовки для авторизации
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    // Получаем файл как blob
    const blob = await response.blob();
    
    // Создаем временную ссылку для скачивания
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = `${title}.${ext}`;
    
    // Добавляем элемент в DOM, вызываем клик и удаляем
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при скачивании видео:', error);
    return { success: false, error: 'Ошибка скачивания видео' };
  }
}; 