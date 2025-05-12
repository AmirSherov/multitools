import './features.scss';
import Link from 'next/link';
import { FC } from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  link: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description, link }) => (
  <div className="mainpage-feature-card">
    <div className="mainpage-feature-card__icon">
      <img src={icon} alt={title} />
    </div>
    
    <div className="mainpage-feature-card__content">
      <h3 className="mainpage-feature-card__title">{title}</h3>
      <p className="mainpage-feature-card__desc">{description}</p>
      <Link href={link} className="mainpage-feature-card__link">
        Подробнее
      </Link>
    </div>
  </div>
);

export default FeatureCard; 