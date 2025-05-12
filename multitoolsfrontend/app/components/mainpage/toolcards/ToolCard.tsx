'use client';
import Link from 'next/link';

interface ToolCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
  tags?: string[];
}

export default function ToolCard({ image, title, description, link, tags }: ToolCardProps) {
  return (
    <div className="tool-card-landing-page">
      <div className="tool-card-landing-page__image">
        <img 
          src={image} 
          alt={title} 
          className="tool-card-landing-page__img"
        />
      </div>
      
      {tags && tags.length > 0 && (
        <div className="tool-card-landing-page__tags">
          {tags.map((tag, index) => (
            <span key={index} className="tool-card-landing-page__tag">{tag}</span>
          ))}
        </div>
      )}
      
      <div className="tool-card-landing-page__content">
        <h3 className="tool-card-landing-page__title">{title}</h3>
        <p className="tool-card-landing-page__description">{description}</p>
        
        <Link href={link} className="tool-card-landing-page__link">
          Открыть инструмент
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
} 