import "./showCase.scss"
import Image from "next/image"
import Link from "next/link"

export default function ShowCase() {
    return (
        <section className="showcase section" id="showcase">
        <div className="container">
          <div className="showcase__inner">
            <div className="showcase__content">
              <h2 className="showcase__content-heading">Решайте сложные задачи <span>в один клик</span></h2>
              <p className="showcase__content-text">
                Мы разработали MultiTools, чтобы сделать вашу работу эффективнее. Никаких сложных настроек или загрузки программного обеспечения - просто мощные онлайн-инструменты, доступные на любом устройстве.
              </p>
              <div className="showcase__content-features">
                <div className="feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Простой и интуитивно понятный интерфейс</span>
                </div>
                <div className="feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Высокая скорость обработки данных</span>
                </div>
                <div className="feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Доступ с любого устройства, в любом месте</span>
                </div>
              </div>
              <Link href="#tools" className="btn btn-primary">
                Попробовать сейчас
              </Link>
            </div>
            <div className="showcase__image">
              <img
                src="/images/mainpage/server.avif" 
                alt="MultiTools в действии" 
                width={600} 
                height={400}
              />
            </div>
          </div>
        </div>
      </section>
    )
}
