import './hero.scss';
import { FC } from 'react';

interface HeroProps {
  onScrollClick?: () => void;
  showScroll?: boolean;
}

const Hero: FC<HeroProps> = ({ onScrollClick, showScroll = true }) => {
  const handleButtonClick = (targetId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="mainpage-hero">
      <div className="mainpage-hero__content">
        <h1 className="mainpage-hero__title">
          Мультитулс
          <span>Все инструменты в одном месте</span>
        </h1>
        <p className="mainpage-hero__subtitle">
          Обрабатывайте файлы, изображения, текст и многое другое с помощью нашей коллекции онлайн-инструментов
        </p>
        <div className="mainpage-hero__buttons">
          <a 
            href="/pages/auth" 
            className="btn btn-primary"
          >
            Начать сейчас
          </a>
          <a 
            href="#features" 
            className="btn btn-outline"
            onClick={(e) => handleButtonClick('features', e)}
          >
            Узнать больше
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero; 