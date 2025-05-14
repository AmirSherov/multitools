'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from './cookies';
import { verifyToken } from '../pages/auth/utilits/api';
import Loader from '../components/loader';

/**
 * HOC для защиты страниц, требующих авторизации
 * @param {React.ComponentType} Component - Компонент для защиты
 * @param {Object} options - Дополнительные опции
 * @param {boolean} options.requireAuth - Требуется ли авторизация для страницы
 * @param {string} options.redirectTo - URL для редиректа, если условие не выполнено
 */
export function withAuthProtection(Component, { requireAuth = true, redirectTo = '/pages/auth' }) {
  return function ProtectedRoute(props) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuthentication = async () => {
        const token = getCookie('auth_token');
        
        let isValid = false;
        
        if (token) {
          try {
            isValid = await verifyToken(token);
          } catch (error) {
            console.error('Ошибка проверки токена:', error);
            isValid = false;
          }
        }
        
        setIsAuthenticated(isValid);
        if ((requireAuth && !isValid) || (!requireAuth && isValid)) {
          router.push(redirectTo);
        } else {
          setLoading(false);
        }
      };
      
      checkAuthentication();
    }, [router]);
    if (loading) {
      return <Loader />;
    }
    return <Component {...props} />;
  };
}

/**
 * HOC для защиты страниц авторизации от авторизованных пользователей
 * @param {React.ComponentType} Component - Компонент страницы авторизации
 */
export function withAuthPageProtection(Component) {
  return withAuthProtection(Component, { 
    requireAuth: false, 
    redirectTo: '/pages/tools' 
  });
}

/**
 * HOC для защиты приватных страниц (требующих авторизации)
 * @param {React.ComponentType} Component - Компонент приватной страницы
 */
export function withPrivateRouteProtection(Component) {
  return withAuthProtection(Component, { 
    requireAuth: true, 
    redirectTo: '/pages/auth' 
  });
} 