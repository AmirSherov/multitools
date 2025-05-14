'use client'
import React, { useState, useEffect } from 'react'
import { logout, getCurrentUser } from '../auth/utilits/api'
import { useGlobalContext } from '../../context/GlobalContext'
import { useRouter } from 'next/navigation'
import { getCookie } from '../../utilits/cookies'
import ToolsLayout from '../../components/ToolsLayout'
import './tools.scss'

export default function ToolsPage() {
  const { state, dispatch } = useGlobalContext()
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie('auth_token')
      
      if (!token) {
        router.push('/pages/auth')
        return
      }
      
      const result = await getCurrentUser()
      if (result.success) {
        setUserData(result.data)
        dispatch({ type: 'SET_USER', payload: result.data })
      } else {
        router.push('/pages/auth')
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [router, dispatch])
  
  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      dispatch({ type: 'CLEAR_USER' })
      router.push('/')
    }
  }
  
  if (loading) {
    return <div className="loading-container">Загрузка...</div>
  }
  
  return (
    <ToolsLayout activeTab="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <h2>Добро пожаловать, {userData.first_name}!</h2>
          <p>Выберите инструмент из меню слева, чтобы начать работу.</p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon download">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11L12 15L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 21H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 18H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Загрузки</h3>
              <p>0 файлов</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon storage">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.3 8.92L19.05 9C17.99 9.82 16.94 10.58 15.88 11.29L14.38 12.24C11.2 14.08 8.01998 15.92 4.83998 17.76L4.78998 17.8C4.31998 18.07 3.64998 18.07 3.17998 17.79L2.63998 17.5C2.02998 17.15 1.71998 16.38 1.96998 15.73L6.99998 2.98C7.23998 2.35 7.95998 1.97 8.62998 2.07L10.06 2.32C10.65 2.4 11.08 2.77 11.34 3.29L12.28 5.34C14.18 3.5 16.11 1.64 18.05 0.35C19.19 -0.52 20.85 0.24 20.96 1.68C21.1 3.31 20.82 6.05 19.3 8.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.4 13.59L13.89 16.38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.82001 17.78C4.92001 19.85 5.63001 20.94 7.58001 20.99C12.59 21.17 17.6 21.11 22.62 20.98V7.04" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Хранилище</h3>
              <p>0% использовано</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon tools">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.9 2.90002L14.52 3.00002C18.4 3.44002 20 5.96002 20 10.55V15.45C20 20.05 18.4 22.57 14.52 23.01L13.9 23.11C9.64 23.11 6.72 20.82 6.12 15.55M6.1 8.50002L5.48 8.40002C4.39 8.28002 3.41 7.93002 2.68 7.22002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12C2 5.81 4.13 3.99 9.09 3.99H9.43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.5 12L10.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Инструменты</h3>
              <p>1 доступно</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-actions">
          <button className="logout-btn" onClick={handleLogout}>Выйти из аккаунта</button>
        </div>
      </div>
    </ToolsLayout>
  )
}
