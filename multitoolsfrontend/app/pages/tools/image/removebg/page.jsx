'use client'
import React, { useState, useEffect } from 'react'
import { getCurrentUser } from '../../../auth/utilits/api'
import { useGlobalContext } from '../../../../context/GlobalContext'
import { useRouter } from 'next/navigation'
import { getCookie } from '../../../../utilits/cookies'
import ToolsLayout from '../../../../components/ToolsLayout'
import Loader from '../../../../components/loader'
import './removebg.scss'
import { removeImageBackground } from './api'

export default function RemoveBgPage() {
  const { state, dispatch } = useGlobalContext()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  
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
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите файл изображения (JPEG, PNG, и т.д.)')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла превышает 5MB. Пожалуйста, выберите файл меньшего размера.')
      return
    }
    
    setSelectedImage(file)
    setError(null)
    
    const imageUrl = URL.createObjectURL(file)
    setPreviewUrl(imageUrl)
    
    setResultImage(null)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedImage) {
      setError('Пожалуйста, выберите изображение')
      return
    }
    
    setIsProcessing(true)
    setError(null)
    
    try {
      // Используем функцию API для обработки изображения
      const result = await removeImageBackground(selectedImage)
      
      if (result.success) {
        setResultImage(result.image)
      } else {
        setError(result.error || 'Произошла ошибка при обработке изображения')
      }
    } catch (err) {
      setError('Произошла ошибка при обращении к серверу')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleDownload = () => {
    if (!resultImage) return
    
    const link = document.createElement('a')
    link.href = resultImage
    link.download = 'image_no_background.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handleReset = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setResultImage(null)
    setError(null)
  }
  
  if (loading) {
    return <Loader />
  }
  
  return (
    <ToolsLayout activeTab="image/removebg">
      <div className="removebg-container">
        <div className="removebg-form-container">
          <form onSubmit={handleSubmit} className="removebg-form">
            <div className="form-group">
              <label>Загрузите изображение для удаления фона:</label>
              
              <div className="file-input-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isProcessing}
                />
                
                {previewUrl ? (
                  <img src={previewUrl} alt="Предпросмотр" className="preview-image" />
                ) : (
                  <div className="placeholder">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="title">Перетащите изображение сюда или нажмите для выбора</div>
                    <div className="subtitle">Поддерживаются JPG, PNG и другие форматы изображений</div>
                  </div>
                )}
              </div>
              
              {error && <div className="error-message">{error}</div>}
            </div>
            
            {previewUrl && !resultImage && (
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isProcessing || !selectedImage}
              >
                {isProcessing ? 'Обработка...' : 'Удалить фон'}
              </button>
            )}
          </form>
        </div>
        
        {isProcessing && (
          <div className="processing-container">
            <Loader />
            <p className="processing-message">Удаляем фон с изображения...</p>
          </div>
        )}
        
        {resultImage && !isProcessing && (
          <div className="result-container">
            <h2>Результат обработки</h2>
            
            <div className="images-comparison">
              <div className="image-container">
                <div className="image-title">Исходное изображение</div>
                <div className="image-preview">
                  <img src={previewUrl} alt="Исходное изображение" />
                </div>
              </div>
              
              <div className="image-container">
                <div className="image-title">Без фона</div>
                <div className="image-preview">
                  <img src={resultImage} alt="Изображение без фона" />
                </div>
              </div>
            </div>
            
            <div className="download-actions">
              <button 
                className="download-button primary"
                onClick={handleDownload}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 11L12 15L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 21H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 18H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Скачать PNG без фона
              </button>
              
              <button 
                className="download-button"
                onClick={handleReset}
              >
                Обработать другое изображение
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolsLayout>
  )
}
