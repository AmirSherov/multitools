'use client';
import Link from 'next/link';
import "./footer.scss"
export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand-col">
            <Link href="/" className="footer__logo">
              <span className="footer__logo-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>MultiTools</span>
            </Link>
            <p className="footer__text">
              Профессиональные инструменты для выполнения повседневных задач. Обработка изображений, конвертация файлов, работа с текстом и AI-помощники.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 5.92375C21.2563 6.25 20.4637 6.46625 19.6375 6.57125C20.4875 6.06375 21.1363 5.26625 21.4412 4.305C20.6488 4.7775 19.7738 5.11125 18.8412 5.2975C18.0887 4.49625 17.0162 4 15.8462 4C13.5763 4 11.7487 5.8425 11.7487 8.10125C11.7487 8.42625 11.7762 8.73875 11.8438 9.03625C8.435 8.87 5.41875 7.23625 3.3925 4.7475C3.03875 5.36125 2.83125 6.06375 2.83125 6.82C2.83125 8.24 3.5625 9.49875 4.6525 10.2275C3.99375 10.215 3.3475 10.0238 2.8 9.7225C2.8 9.735 2.8 9.75125 2.8 9.7675C2.8 11.76 4.22125 13.415 6.085 13.7962C5.75125 13.8875 5.3875 13.9312 5.01 13.9312C4.7475 13.9312 4.4825 13.9163 4.23375 13.8712C4.765 15.4925 6.2725 16.6787 8.065 16.7175C6.67 17.8037 4.89875 18.4662 2.98125 18.4662C2.645 18.4662 2.3225 18.4513 2 18.4088C3.81625 19.5813 5.96875 20.25 8.29 20.25C15.835 20.25 19.96 14 19.96 8.5825C19.96 8.40125 19.9538 8.22625 19.945 8.0525C20.7588 7.475 21.4425 6.75375 22 5.92375Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C16 6.9 16.9 6 18 6C19.1 6 20 6.9 20 8C20 9.1 19.1 10 18 10C16.9 10 16 9.1 16 8ZM12 10C14.2 10 16 11.8 16 14C16 16.2 14.2 18 12 18C9.8 18 8 16.2 8 14C8 11.8 9.8 10 12 10ZM12 8C8.7 8 6 10.7 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 10.7 15.3 8 12 8ZM12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer__col">
            <h3 className="footer__title">Компания</h3>
            <ul className="footer__links">
              <li><Link href="/about" className="footer__link">О нас</Link></li>
              <li><Link href="/features" className="footer__link">Возможности</Link></li>
              <li><Link href="/pricing" className="footer__link">Тарифы</Link></li>
              <li><Link href="/careers" className="footer__link">Карьера</Link></li>
            </ul>
          </div>
          
          <div className="footer__col">
            <h3 className="footer__title">Инструменты</h3>
            <ul className="footer__links">
              <li><Link href="/tools/images" className="footer__link">Обработка изображений</Link></li>
              <li><Link href="/tools/convert" className="footer__link">Конвертация файлов</Link></li>
              <li><Link href="/tools/ai" className="footer__link">AI инструменты</Link></li>
              <li><Link href="/tools/text" className="footer__link">Текстовые редакторы</Link></li>
            </ul>
          </div>
          
          <div className="footer__col">
            <h3 className="footer__title">Поддержка</h3>
            <ul className="footer__links">
              <li><Link href="/contact" className="footer__link">Связаться с нами</Link></li>
              <li><Link href="/faq" className="footer__link">FAQ</Link></li>
              <li><Link href="/privacy" className="footer__link">Политика конфиденциальности</Link></li>
              <li><Link href="/terms" className="footer__link">Условия использования</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer__bottom">
          <p className="footer__copyright">&copy; {new Date().getFullYear()} MultiTools. Все права защищены.</p>
          <p className="footer__tagline">Разработано с ❤️ для наших пользователей</p>
        </div>
      </div>
    </footer>
  );
} 