'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './Sidebar.scss';

const Sidebar = ({ activeTab }) => {
  const [expandedCategory, setExpandedCategory] = useState('download');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleToolSelect = (tool) => {
    router.push(`/pages/tools/${tool}`);
    setIsOpen(false);
  };

  return (
    <>
      <button className="mobile-toggle" onClick={toggleSidebar}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 17H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>MultiTools</span>
          </div>
          
          <button className="menu-toggle" onClick={toggleSidebar}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
              <Link href="/pages/tools" className="sidebar-link">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10H7C9 10 10 9 10 7V5C10 3 9 2 7 2H5C3 2 2 3 2 5V7C2 9 3 10 5 10Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 22H19C21 22 22 21 22 19V17C22 15 21 14 19 14H17C15 14 14 15 14 17V19C14 21 15 22 17 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Панель управления</span>
              </Link>
            </li>
            
            <li className={`sidebar-menu-item category ${expandedCategory === 'download' ? 'expanded' : ''} ${activeTab?.startsWith('download') ? 'active' : ''}`}>
              <div className="sidebar-link" onClick={() => toggleCategory('download')}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 11L12 15L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 21H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 18H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Скачивание</span>
                <svg className="arrow-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <ul className="submenu">
                <li className={`submenu-item ${activeTab === 'download/instagram' ? 'active' : ''}`} onClick={() => handleToolSelect('download/instagram')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 7.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Instagram</span>
                </li>
                {/* <li className={`submenu-item ${activeTab === 'download/tiktok' ? 'active' : ''}`} onClick={() => handleToolSelect('download/tiktok')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 8.5V15.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 8.5V15.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>TikTok</span>
                </li> */}
              </ul>
            </li>    
            <li className={`sidebar-menu-item category ${expandedCategory === 'image' ? 'expanded' : ''} ${activeTab?.startsWith('image') ? 'active' : ''}`}>
              <div className="sidebar-link" onClick={() => toggleCategory('image')}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Изображение</span>
                <svg className="arrow-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <ul className="submenu">
                <li className={`submenu-item ${activeTab === 'image/removebg' ? 'active' : ''}`} onClick={() => handleToolSelect('image/removebg')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.68 16.96L18.55 9.65C17.49 7.17 14.34 7.07 13.14 9.49L11.5 12.76C10.89 13.97 9.47 14.23 8.55 13.31L8.2 12.96C7.22 11.98 5.66 12.26 5.03 13.53L3.05 17.5C2.29 19.04 3.43 20.95 5.13 20.96H19.85C21.63 20.96 22.77 18.88 21.68 16.96Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 8C18.3284 8 19 7.32843 19 6.5C19 5.67157 18.3284 5 17.5 5C16.6716 5 16 5.67157 16 6.5C16 7.32843 16.6716 8 17.5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Удалить фон <img src="/aiicon.png" width={18} height={18} style={{position: 'relative', top: '4px'}} alt="" /> </span>
                </li>
              </ul>
            </li>
            <li className="sidebar-menu-item">
              <Link href="/pages/profile" className="sidebar-link">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.72 11.28 8.72 9.51C8.72 7.7 10.18 6.23 12 6.23C13.81 6.23 15.28 7.7 15.28 9.51C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.74 19.38C16.96 21.01 14.6 22 12 22C9.4 22 7.04 21.01 5.26 19.38C5.36 18.44 5.96 17.52 7.03 16.8C9.77 14.98 14.25 14.98 16.97 16.8C18.04 17.52 18.64 18.44 18.74 19.38Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Профиль</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar; 