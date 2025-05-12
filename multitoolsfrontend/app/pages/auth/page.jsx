'use client'
import React, { useState, useEffect } from 'react'
import './auth.scss'
import Loader from '../../components/loader'
import { getCookie } from '../../utilits/cookies'
import { NotifyProvider } from 'amirdev-notify'
import { verifyToken, login, logout } from './utilits/api'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = getCookie('auth_token')
    if (token) {
      checkToken(token)
    }
  }, [])

  const checkToken = async (token) => {
    const isValid = await verifyToken(token)
    setIsLoggedIn(isValid)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await login(email, password)
    
    if (result.success) {
      setIsLoggedIn(true)
      setTimeout(() => {
        window.location.href = '/pages/tools'
      }, 1500)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleLogout = async () => {
    setLoading(true)
    const success = await logout()
    if (success) {
      setIsLoggedIn(false)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <NotifyProvider>
        {loading && <Loader />}
        <div className="auth-side">
          <div className="bg-pattern"></div>
          <div className="auth-side-content">
            <div className="auth-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" fill="white"/>
              </svg>
            </div>
            <h1 className="auth-header">Привет пользователь!&nbsp;👋</h1>
            <p className="auth-description">
              Автоматизируй свои задачи и повысь производительность!
            </p>
          </div>
          <div className="auth-copyright">
            © 2025 MultiTools. Все права защищены.
          </div>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-form">
              <>
                <div className="form-logo">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> 
                  MultiTools
                </div>
                <h2 className="form-title">С возвращением!</h2>
                <p className="form-description">
                  Нет аккаунта? <a href="/pages/auth/newuser">Создайте новый аккаунт</a>, это БЕСПЛАТНО! Займет меньше минуты.
                </p>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      className="form-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <input
                      className="form-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Пароль"
                      required
                    />
                  </div>
                  
                  {error && <div className="auth-error">{error}</div>}
                  
                  <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
                    {loading ? 'Вход...' : 'Войти'}
                  </button>
                </form>
                
                <div className="forgot-password">
                  Забыли пароль? <a href="#">Нажмите здесь</a>
                </div>
              </>
          </div>
        </div>
      </NotifyProvider>
    </div>
  )
} 