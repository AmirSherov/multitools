'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './ToolsLayout.scss';

const ToolsLayout = ({ children, activeTab }) => {
  return (
    <div className="tools-layout">
      <Sidebar activeTab={activeTab} />
      <main className="tools-content">
        <div className="tools-header">
          <h1 className="tools-title">
            {activeTab === 'dashboard' ? 'Панель управления' : 
             activeTab === 'download/youtube' ? 'Скачать с YouTube' :
             activeTab === 'download/instagram' ? 'Скачать с Instagram' :
             activeTab === 'download/tiktok' ? 'Скачать с TikTok' :
             activeTab === 'profile' ? 'Профиль' : 'Инструменты'}
          </h1>
        </div>
        <div className="tools-body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ToolsLayout; 