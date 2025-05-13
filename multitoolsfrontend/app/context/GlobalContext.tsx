'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

export type UserDataType = {
  isAuthenticated: boolean;
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

type StateType = {
  user: UserDataType;
  theme: 'light' | 'dark';
};

const initialState: StateType = {
  user: {
    isAuthenticated: false
  },
  theme: 'light',
};

type ActionType = 
  | { type: 'LOGIN'; payload: UserDataType }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' };

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: {
          ...action.payload,
          isAuthenticated: true
        }
      };
    case 'LOGOUT':
      return {
        ...state,
        user: {
          isAuthenticated: false
        }
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    default:
      return state;
  }
}

type GlobalContextType = {
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext должен использоваться внутри GlobalContextProvider');
  }
  return context;
} 