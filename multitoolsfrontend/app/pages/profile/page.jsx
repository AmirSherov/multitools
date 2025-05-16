'use client'
import React, { useState, useEffect } from 'react'
import { getCurrentUser, logout } from '../auth/utilits/api'
import { useGlobalContext } from '../../context/GlobalContext'
import { useRouter } from 'next/navigation'
import { getCookie } from '../../utilits/cookies'
import ToolsLayout from '../../components/ToolsLayout'
import Loader from '../../components/loader'
import StatsChart from '../../components/StatsChart/StatsChart'
import './profile.scss'
import '../../components/StatsChart/StatsChart.css'

export default function ProfilePage() {
  const { state, dispatch } = useGlobalContext()
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stats')

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
    return <Loader />
  }

  return (
    <ToolsLayout activeTab="profile">
      <div className="profile-modern-wrapper">
        <div className="profile-modern-card">
          <div className="profile-modern-left">
            <div className="profile-modern-avatar">
                <img width={60} height={60} src={'/userfeed.png'} alt="avatar" />
            </div>
            <div className="profile-modern-maininfo">
              <div className="profile-modern-name">{userData.first_name} {userData.last_name}</div>
              <div className="profile-modern-username">@{userData.username}</div>
              <div className="profile-modern-email">{userData.email}</div>
            </div>
          </div>
          <div className="profile-modern-right">
            <div className="profile-modern-tabs">
              <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>Статистика</button>
              <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>О пользователе</button>
              <button className={activeTab === 'timeline' ? 'active' : ''} onClick={() => setActiveTab('timeline')}>История</button>
            </div>
            <div className="profile-modern-tabcontent">
              {activeTab === 'stats' && (
                <StatsChart userData={userData} />
              )}
              {activeTab === 'about' && (
                <div className="profile-modern-about">
                  <div className="profile-modern-row">
                    <span className="profile-modern-label">Имя:</span>
                    <span>{userData.first_name}</span>
                  </div>
                  <div className="profile-modern-row">
                    <span className="profile-modern-label">Фамилия:</span>
                    <span>{userData.last_name}</span>
                  </div>
                  <div className="profile-modern-row">
                    <span className="profile-modern-label">Email:</span>
                    <span>{userData.email}</span>
                  </div>
                  <div className="profile-modern-row">
                    <span className="profile-modern-label">Username:</span>
                    <span>{userData.username}</span>
                  </div>
                  <div className="profile-modern-row">
                    <span className="profile-modern-label">Дата регистрации:</span>
                    <span>{new Date(userData.date_joined).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              )}
              {activeTab === 'timeline' && (
                <div className="profile-modern-timeline-empty">Нет событий</div>
              )}
            </div>
            <div className="profile-modern-actions">
              <button className="logout-btn" onClick={handleLogout}>Выйти из аккаунта</button>
            </div>
          </div>
        </div>
      </div>
    </ToolsLayout>
  )
}