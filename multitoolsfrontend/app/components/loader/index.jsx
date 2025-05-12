'use client'
import React from 'react'
import './loader.scss'

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-element square-tl"></div>
        <div className="loader-element circle-tr"></div>
        <div className="loader-element circle-bl"></div>
        <div className="loader-element square-br"></div>
      </div>
    </div>
  )
}
