'use client'
import React, { useState } from 'react'
import './newuser.scss'
import Loader from '../../../components/loader'
import { NotifyProvider } from 'amirdev-notify'
import { register, verifyEmail, resendVerificationCode } from '../utilits/api'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: ''
  })
  const [verificationMode, setVerificationMode] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [codeInputs, setCodeInputs] = useState(['', '', '', '', '', ''])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVerificationCodeChange = (e, index) => {
    const value = e.target.value
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCodeInputs = [...codeInputs]
      newCodeInputs[index] = value
      setCodeInputs(newCodeInputs)
      setVerificationCode(newCodeInputs.join(''))
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !codeInputs[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.passwordConfirm) {
      setError('Пароли не совпадают')
      return
    }
    
    setLoading(true)
    const result = await register(formData)
    setLoading(false)
    
    if (result.success) {
      setVerificationMode(true)
      setVerificationEmail(result.email)
    } else {
      setError(result.error)
    }
  }

  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await verifyEmail(verificationEmail, verificationCode)
    setLoading(false)
    
    if (result.success) {
      setTimeout(() => {
        window.location.href = '/pages/tools'
      }, 3000)
    } else {
      setError(result.error)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setLoading(true)
    
    const result = await resendVerificationCode(verificationEmail)
    setLoading(false)
    
    if (!result.success) {
      setError(result.error)
    }
  }

  const renderVerificationForm = () => (
    <div className="auth-form">
      <div className="form-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg> 
        MultiTools
      </div>
      <h2 className="form-title">Подтверждение Email</h2>
      <p className="form-description">
        Мы отправили 6-значный код на адрес <strong>{verificationEmail}</strong>. Введите его ниже для завершения регистрации.
      </p>
      
      <form onSubmit={handleVerifyEmail}>
        <div className="verification-code-container">
          {codeInputs.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength={1}
              className="verification-code-input"
              value={digit}
              onChange={(e) => handleVerificationCodeChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoFocus={index === 0}
            />
          ))}
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <button type="submit" className="auth-btn auth-btn-primary" disabled={loading || verificationCode.length !== 6}>
          {loading ? 'Проверка...' : 'Подтвердить'}
        </button>
        
        <div className="resend-code">
          Не получили код? <a href="#" onClick={handleResendCode}>Отправить повторно</a>
        </div>
      </form>
    </div>
  )

  const renderRegistrationForm = () => (
    <div className="auth-form auth-form-register">
      <div className="form-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg> 
        MultiTools
      </div>
      <h2 className="form-title">Создание нового аккаунта</h2>
      <p className="form-description">
        Уже есть аккаунт? <a href="/pages/auth">Войдите в систему</a> для доступа к сервису.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">Имя</label>
            <input
              id="firstName"
              className="form-input"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Иван"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Фамилия</label>
            <input
              id="lastName"
              className="form-input"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Иванов"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            id="username"
            className="form-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="username"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="passwordConfirm">Подтверждение пароля</label>
            <input
              id="passwordConfirm"
              className="form-input"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Повторите пароль"
              required
            />
          </div>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <div className="form-group terms-checkbox">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            Я согласен с <a href="#">Условиями использования</a> и <a href="#">Политикой конфиденциальности</a>
          </label>
        </div>
        
        <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  )

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
            <h1 className="auth-header">
              {verificationMode ? 'Подтверждение почты!' : 'Регистрация!'}
              &nbsp;{verificationMode ? '📧' : '✨'}
            </h1>
            <p className="auth-description">
              {verificationMode 
                ? 'Осталось последнее действие - введите код, который мы отправили на вашу почту' 
                : 'Присоединяйтесь к нам и автоматизируйте свои задачи для повышения продуктивности!'}
            </p>
          </div>
          <div className="auth-copyright">
            © 2025 MultiTools. Все права защищены.
          </div>
        </div>
        
        <div className="auth-form-container">
          {verificationMode ? renderVerificationForm() : renderRegistrationForm()}
        </div>
      </NotifyProvider>
    </div>
  )
}
