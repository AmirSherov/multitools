'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

// Получаем сохраненные данные пользователя при инициализации
const getUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {};
  }
  return {};
};

const initialState = {
  user: getUserFromStorage(),
  theme: 'light',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      // Сохраняем в localStorage при обновлении
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_USER':
      // Удаляем из localStorage при выходе
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      return {
        ...state,
        user: {},
      };
    default:
      return state;
  }
}

const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  }
  return context;
}
