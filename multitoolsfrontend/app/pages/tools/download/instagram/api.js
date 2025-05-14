import { api_url } from '../../../../utilits/static';
import { getCookie } from '../../../../utilits/cookies';

/**
 * Получить информацию о публикации Instagram по URL
 * @param {string} url - URL публикации Instagram
 * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
 */
export const getPostInfo = async (url) => {
  try {
    const token = getCookie('auth_token');
    
    if (!token) {
      return { success: false, data: null, error: 'Необходима авторизация' };
    }
    
    const response = await fetch(`${api_url}api/v1/tools/download/instagram/`, {
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
      return { success: false, data: null, error: data.error || 'Ошибка получения информации о публикации' };
    }
  } catch (error) {
    console.error('Ошибка при запросе информации о публикации:', error);
    return { success: false, data: null, error: 'Ошибка соединения с сервером' };
  }
};

/**
 * Получить URL для скачивания медиа из Instagram
 * @param {string} mediaUrl - URL медиа для скачивания
 * @param {string} mediaType - Тип медиа (video или image)
 * @param {string} title - Название для сохраняемого файла
 * @returns {string} URL для скачивания
 */
export const getDownloadUrl = (mediaUrl, mediaType, title) => {
  const token = getCookie('auth_token');
  
  if (!token) {
    return null;
  }
  const downloadUrl = new URL(`${api_url}api/v1/tools/download/instagram/`);
  downloadUrl.searchParams.append('media_url', mediaUrl);
  downloadUrl.searchParams.append('media_type', mediaType);
  downloadUrl.searchParams.append('title', title);
  
  return downloadUrl.toString();
};

/**
 * Скачать медиа через AJAX и затем начать загрузку для пользователя
 * @param {string} mediaUrl - URL медиа
 * @param {string} mediaType - Тип медиа (video или image)
 * @param {string} title - Название файла
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const downloadMedia = async (mediaUrl, mediaType, title) => {
  try {
    const token = getCookie('auth_token');
    
    if (!token) {
      return { success: false, error: 'Необходима авторизация' };
    }
    const downloadUrl = getDownloadUrl(mediaUrl, mediaType, title);
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Неизвестная ошибка');
      console.error(`Ошибка HTTP: ${response.status}, Текст: ${errorText}`);
      return { success: false, error: `Ошибка скачивания: ${response.status}` };
    }
    
    const blob = await response.blob();
    
    if (blob.size === 0) {
      console.error('Получен пустой файл');
      return { success: false, error: 'Получен пустой файл' };
    }
    
    const ext = mediaType === 'video' ? 'mp4' : 'jpg';
    const fileName = `${title}.${ext}`;
    
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    
    // Небольшая задержка перед очисткой URL
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    }, 100);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при скачивании медиа:', error);
    return { success: false, error: 'Ошибка скачивания медиа' };
  }
};
