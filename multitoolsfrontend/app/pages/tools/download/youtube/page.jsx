'use client'
import React, { useState, useEffect } from 'react'
import { getCurrentUser } from '../../../auth/utilits/api'
import { getVideoInfo, downloadVideo } from './api'
import { useGlobalContext } from '../../../../context/GlobalContext'
import { useRouter } from 'next/navigation'
import { getCookie } from '../../../../utilits/cookies'
import ToolsLayout from '../../../../components/ToolsLayout'
import Loader from '../../../../components/loader'
import './youtube.scss'

export default function YouTubePage() {
  const { state, dispatch } = useGlobalContext()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadingFormat, setDownloadingFormat] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState('video') 
  
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
      setError('Введите URL видео')
      return
    }
    if (!url.includes('youtube.com/') && !url.includes('youtu.be/')) {
      setError('Введите корректный URL YouTube')
      return
    }
    
    setError(null)
    setIsProcessing(true)
    
    try {
      const response = await getVideoInfo(url)
      
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError('Произошла ошибка при получении информации о видео')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleDownload = async (formatId, ext) => {
    setDownloadingFormat(formatId)
    setError(null)
    
    try {
      const title = result?.title || 'video'
      const downloadResult = await downloadVideo(url, formatId, ext, title)
      
      if (!downloadResult.success) {
        setError(downloadResult.error || 'Ошибка при скачивании видео')
      }
    } catch (err) {
      setError('Произошла ошибка при скачивании видео')
      console.error(err)
    } finally {
      setDownloadingFormat(null)
    }
  }
  
  const renderFormatsList = () => {
    if (!result || !result.formats || result.formats.length === 0) {
      return <p>Нет доступных форматов</p>
    }
    
    const filteredFormats = result.formats.filter(format => 
      selectedType === 'video' ? format.ext === 'mp4' : format.ext === 'mp3'
    )
    
    if (filteredFormats.length === 0) {
      return <p>Нет доступных форматов для выбранного типа</p>
    }
    
    return (
      <div className="formats-list">
        {filteredFormats.map((format, index) => (
          <div className="format-item" key={index}>
            <div className="format-info">
              <span className="format-quality">
                {format.ext === 'mp3' ? 'Аудио MP3' : format.resolution}
              </span>
              <span className="format-size">{format.filesize_str}</span>
            </div>
            <button 
              className={`download-btn ${downloadingFormat === format.format_id ? 'downloading' : ''}`}
              onClick={() => handleDownload(format.format_id, format.ext)}
              disabled={downloadingFormat !== null}
            >
              {downloadingFormat === format.format_id ? (
                <span className="downloading-text">Загрузка...</span>
              ) : (
                `Скачать ${format.ext === 'mp3' ? 'аудио' : format.resolution}`
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
    <ToolsLayout activeTab="download/youtube">
      <div className="youtube-container">
        <div className="youtube-form-container">
          <form onSubmit={handleSubmit} className="youtube-form">
            <div className="form-group">
              <label>Введите URL видео с YouTube:</label>
              <div className="input-group">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
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
        ) : downloadingFormat ? (
          <div className="downloading-container">
            <Loader />
            <p className="downloading-message">Загрузка видео...</p>
          </div>
        ) : null}
        
        {result && !isProcessing && !downloadingFormat && (
          <div className="result-container">
            <div className="video-info">
              <div className="video-thumbnail">
                <img src={result.thumbnail} alt={result.title} />
                <div className="video-meta">
                  <span className="duration">{result.duration_string}</span>
                </div>
              </div>
              <div className="video-details">
                <h2>{result.title}</h2>
                <p className="video-uploader">
                  <span className="label">Автор:</span> {result.uploader}
                </p>
                <div className="video-summary">
                  <div className="video-stat">
                    <span className="label">Просмотры:</span> {result.view_count.toLocaleString()}
                  </div>
                </div>
                
                <div className="download-options">
                  <div className="format-selector">
                    <button 
                      className={`format-type-btn ${selectedType === 'video' ? 'active' : ''}`}
                      onClick={() => setSelectedType('video')}
                    >
                      Видео (MP4)
                    </button>
                    <button 
                      className={`format-type-btn ${selectedType === 'audio' ? 'active' : ''}`}
                      onClick={() => setSelectedType('audio')}
                    >
                      Аудио (MP3)
                    </button>
                  </div>
                  
                  <h3>Доступные форматы:</h3>
                  {renderFormatsList()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolsLayout>
  )
} 