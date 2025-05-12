'use client'
import React from 'react'
import { logout } from '../auth/utilits/api'
export default function ToolsPage() {
  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }
  return (
    <>
     <div>ToolsPage</div>
     <button onClick={handleLogout}>log out</button>
    </>
  )
}
