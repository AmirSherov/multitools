import { setCookie, getCookie, deleteCookie } from '../../../utilits/cookies'
import { notify } from 'amirdev-notify'
import { api_url } from '../../../utilits/static'

/**
 * Проверяет токен пользователя
 * @param {string} token - токен для проверки
 * @returns {Promise<boolean>} - результат проверки
 */
export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${api_url}api/v1/auth/verify-token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    })
    
    const data = await response.json()
    
    if (data.valid) {
      return true
    } else {
      deleteCookie('auth_token')
      return false
    }
  } catch (error) {
    notify({
      delay: 2,
      message: 'Ошибка проверки токена. Попробуйте позже.',
      type: 'error',
      position: 'top-center'
    })
    console.error('Ошибка проверки токена:', error)
    return false
  }
}

/**
 * Выполняет вход пользователя
 * @param {string} email - email пользователя
 * @param {string} password - пароль пользователя
 * @returns {Promise<{success: boolean, error: string|null}>} - результат входа
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${api_url}api/v1/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      setCookie('auth_token', data.token, 1)
      notify({
        delay: 3,
        message: 'Вы успешно вошли в систему',
        type: 'success',
        position: 'top-center'
      })
      console.log(data)
      return { success: true, error: null, data: data }
    } else {
      const errorMessage = data.email || data.password || data.non_field_errors || 'Ошибка входа'
      return { success: false, error: errorMessage }
    }
  } catch (error) {
    notify({
      delay: 2,
      message: 'Ошибка сервера. Попробуйте позже.',
      type: 'error',
       position: 'top-center'
    })
    console.error('Ошибка входа:', error)
    return { success: false, error: 'Ошибка сервера. Попробуйте позже.' }
  }
}

/**
 * Выполняет выход пользователя
 * @returns {Promise<boolean>} - результат выхода
 */
export const logout = async () => {
  try {
    const token = getCookie('auth_token')
    if (token) {
      await fetch(`${api_url}api/v1/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      })
      
      deleteCookie('auth_token')
      notify({
        delay: 2,
        message: 'Вы успешно вышли из системы',
        type: 'success',
        position: 'top-center'
      })
      return true
    }
    return false
  } catch (error) {
    console.error('Ошибка выхода:', error)
    return false
  }
}

/**
 * Регистрирует нового пользователя
 * @param {Object} userData - данные пользователя
 * @returns {Promise<{success: boolean, error: string|null, userId: number|null, email: string|null}>}
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${api_url}api/v1/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirm: userData.passwordConfirm,
        first_name: userData.firstName,
        last_name: userData.lastName
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      notify({
        delay: 3,
        message: 'Регистрация успешна! Проверьте вашу почту для подтверждения.',
        type: 'success',
         position: 'top-center'
      })
      return { 
        success: true, 
        error: null,
        userId: data.user_id,
        email: data.email
      }
    } else {
      let errorMessage = 'Ошибка регистрации'
      if (data.username) errorMessage = `Имя пользователя: ${data.username}`
      else if (data.email) errorMessage = `Email: ${data.email}`
      else if (data.password) errorMessage = `Пароль: ${data.password}`
      else if (data.password_confirm) errorMessage = `Подтверждение пароля: ${data.password_confirm}`
      
      return { success: false, error: errorMessage, userId: null, email: null }
    }
  } catch (error) {
    notify({
      delay: 2,
      message: 'Ошибка сервера. Попробуйте позже.',
      type: 'error',
       position: 'top-center'
    })
    console.error('Ошибка регистрации:', error)
    return { success: false, error: 'Ошибка сервера. Попробуйте позже.', userId: null, email: null }
  }
}

/**
 * Проверяет код подтверждения email
 * @param {string} email - email пользователя
 * @param {string} code - код подтверждения
 * @returns {Promise<{success: boolean, error: string|null, token: string|null}>}
 */
export const verifyEmail = async (email, code) => {
  try {
    const response = await fetch(`${api_url}api/v1/auth/verify-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      setCookie('auth_token', data.token, 1)
      
      notify({
        delay: 3,
        message: 'Email подтвержден! Вы успешно вошли в систему.',
        type: 'success',
         position: 'top-center'
      })
      
      return { 
        success: true, 
        error: null,
        token: data.token
      }
    } else {
      let errorMessage = 'Ошибка подтверждения'
      if (data.email) errorMessage = `Email: ${data.email}`
      else if (data.code) errorMessage = `Код: ${data.code}`
      
      return { success: false, error: errorMessage, token: null }
    }
  } catch (error) {
    notify({
      delay: 2,
      message: 'Ошибка сервера. Попробуйте позже.',
      type: 'error',
       position: 'top-center'
    })
    console.error('Ошибка подтверждения email:', error)
    return { success: false, error: 'Ошибка сервера. Попробуйте позже.', token: null }
  }
}

/**
 * Запрашивает повторную отправку кода подтверждения
 * @param {string} email - email пользователя
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const resendVerificationCode = async (email) => {
  try {
    const response = await fetch(`${api_url}api/v1/auth/resend-code/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      notify({
        delay: 3,
        message: 'Новый код отправлен на вашу почту!',
        type: 'success',
        position: 'top-center'
      })
      return { success: true, error: null }
    } else {
      return { success: false, error: data.error || 'Не удалось отправить новый код' }
    }
  } catch (error) {
    notify({
      delay: 2,
      message: 'Ошибка сервера. Попробуйте позже.',
      type: 'error'
    })
    console.error('Ошибка отправки кода:', error)
    return { success: false, error: 'Ошибка сервера. Попробуйте позже.' }
  }
}

/**
 * Получает данные текущего пользователя по токену
 * @returns {Promise<{success: boolean, data: Object|null, error: string|null}>}
 */
export const getCurrentUser = async () => {
  try {
    const token = getCookie('auth_token')
    
    if (!token) {
      return { success: false, error: 'Не найден токен авторизации' }
    }
    
    const response = await fetch(`${api_url}api/v1/auth/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        deleteCookie('auth_token')
        return { success: false, error: 'Недействительный токен авторизации' }
      }
      return { success: false, error: `Ошибка сервера: ${response.status}` }
    }
    
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error)
    return { success: false, error: 'Ошибка сервера. Попробуйте позже.' }
  }
} 