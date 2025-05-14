'use client'
import React, { useState, useEffect } from 'react'
import { getCurrentUser } from '../../../auth/utilits/api'
import { getPostInfo, downloadMedia } from './api'
import { useGlobalContext } from '../../../../context/GlobalContext'
import { useRouter } from 'next/navigation'
import { getCookie } from '../../../../utilits/cookies'
import ToolsLayout from '../../../../components/ToolsLayout'
import Loader from '../../../../components/loader'
import './instagram.scss'
import { api_url } from '../../../../utilits/static'

export default function InstagramPage() {
  const { state, dispatch } = useGlobalContext()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadingMediaIndex, setDownloadingMediaIndex] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie('auth_token')
      
      if (!token) {
        router.push('/pages/auth')
        return
      }
      
      const result = await getCurrentUser()
      if (result.success) {
        dispatch({ type: 'SET_USER', payload: result.data })
      } else {
        router.push('/pages/auth')
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [router, dispatch])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      setError('Введите URL публикации Instagram')
      return
    }
    if (!url.includes('instagram.com/')) {
      setError('Введите корректный URL Instagram')
      return
    }
    
    setError(null)
    setIsProcessing(true)
    
    try {
      const response = await getPostInfo(url)
      
      if (response.success) {
        console.log('Instagram data:', response.data);
        setResult(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError('Произошла ошибка при получении информации о публикации')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleDownload = async (mediaUrl, mediaType, index) => {
    setDownloadingMediaIndex(index)
    setError(null)
    
    try {
      const title = `${result?.username || 'instagram'}_${result?.code || 'post'}_${index || ''}`
      const downloadResult = await downloadMedia(mediaUrl, mediaType, title)
      
      if (!downloadResult.success) {
        setError(downloadResult.error || 'Ошибка при скачивании медиа')
      }
    } catch (err) {
      setError('Произошла ошибка при скачивании медиа')
      console.error(err)
    } finally {
      setDownloadingMediaIndex(null)
    }
  }
  
  const renderMediaList = () => {
    if (!result || !result.media || result.media.length === 0) {
      return <p>Нет доступных медиа</p>
    }
    
    return (
      <div className="media-list">
        {result.media.map((media, index) => (
          <div className="media-item" key={index}>
            <div className="media-preview">
              {media.type === 'video' ? (
                <div className="video-thumbnail">
                  {media.thumbnail ? (
                    <img 
                      src={`${api_url}api/v1/tools/download/instagram/thumbnail?url=${encodeURIComponent(media.thumbnail)}`}
                      alt={`Медиа ${index + 1}`} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="thumbnail-placeholder">Миниатюра недоступна</div>
                  )}
                  <div className="video-badge">Видео</div>
                </div>
              ) : (
                <img 
                  src={`${api_url}api/v1/tools/download/instagram/thumbnail?url=${encodeURIComponent(media.url)}`}
                  alt={`Медиа ${index + 1}`} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png";
                  }}
                />
              )}
              
              {result.type === 'carousel' && (
                <div className="media-index">{media.index}</div>
              )}
            </div>
            
            <div className="media-info">
              <span className="media-type">
                {media.type === 'video' ? 'Видео MP4' : 'Изображение JPG'}
              </span>
            </div>
            
            <button 
              className={`download-btn ${downloadingMediaIndex === index ? 'downloading' : ''}`}
              onClick={() => handleDownload(media.url, media.type, index)}
              disabled={downloadingMediaIndex !== null}
            >
              {downloadingMediaIndex === index ? (
                <span className="downloading-text">Загрузка...</span>
              ) : (
                `Скачать ${media.type === 'video' ? 'видео' : 'фото'}`
              )}
            </button>
          </div>
        ))}
      </div>
    )
  }
  
  if (loading) {
    return <Loader />
  }
  
  return (
    <ToolsLayout activeTab="download/instagram">
      <div className="instagram-container">
        <div className="instagram-form-container">
          <form onSubmit={handleSubmit} className="instagram-form">
            <div className="form-group">
              <label>Введите URL публикации с Instagram:</label>
              <div className="input-group">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  disabled={isProcessing}
                />
                <button type="submit" disabled={isProcessing}>
                  {isProcessing ? 'Обработка...' : 'Получить'}
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
          </form>
        </div>
        
        {isProcessing ? (
          <Loader />
        ) : downloadingMediaIndex !== null ? (
          <div className="downloading-container">
            <Loader />
            <p className="downloading-message">Загрузка медиа...</p>
          </div>
        ) : null}
        
        {result && !isProcessing && downloadingMediaIndex === null && (
          <div className="result-container">
            <div className="post-info">
              <div className="post-header">
                <h2>{result.title}</h2>
                <p className="post-uploader">
                  <span className="label">Автор:</span> @{result.username}
                </p>
                <p className="post-type">
                  <span className="label">Тип:</span> {
                    result.type === 'carousel' ? 'Карусель (несколько фото/видео)' : 
                    result.type === 'video' ? 'Видео' : 'Фото'
                  }
                </p>
              </div>
              
              <div className="download-options">
                <h3>Доступные медиа для скачивания:</h3>
                {renderMediaList()}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolsLayout>
  )
}
