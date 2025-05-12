import FeatureCard from './FeatureCard';
import { FC, useEffect, useState, useRef } from 'react';
import './features.scss';

const features = [
  {
    icon: "/images/mainpage/icon-1.svg",
    title: "Обработка изображений",
    description: "Оптимизируйте, сжимайте, изменяйте размер и конвертируйте изображения в различные форматы одним кликом",
    link: "/tools/images"
  },
  {
    icon: "/images/mainpage/icon-2.svg",
    title: "Поддержка множества форматов",
    description: "Работайте с файлами любого типа - от стандартных документов до специализированных форматов",
    link: "/tools/convert"
  },
  {
    icon: "/images/mainpage/icon-3.svg",
    title: "Текстовые инструменты",
    description: "Форматирование, исправление, перевод и оптимизация текста для любых целей и задач",
    link: "/tools/text"
  },
  {
    icon: "/images/mainpage/icon-4.svg",
    title: "AI помощники",
    description: "Используйте силу искусственного интеллекта для ускорения и автоматизации рутинных задач",
    link: "/tools/ai"
  }
];

const Features: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="mainpage-features"
      style={{ padding: "80px 0" }}
    >
      <div className="container" style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px"
      }}>
        <div className={`mainpage-features__heading ${isVisible ? 'is-visible' : ''}`}>
          <h2 
            className={`section-title ${isVisible ? 'is-visible' : ''}`}
            style={{
              fontSize: "42px",
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: "20px",
              background: "linear-gradient(135deg, #8c43ff 0%, #f62c84 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Мощные инструменты для решения повседневных задач
          </h2>
          <p 
            className={`section-subtitle ${isVisible ? 'is-visible' : ''}`}
            style={{
              fontSize: "20px",
              color: "#bdbddd",
              lineHeight: 1.6,
              maxWidth: "800px",
              margin: "0 auto"
            }}
          >
            От обработки изображений до конвертации файлов - все, что нужно, в одном месте
          </p>
        </div>
        <div className="mainpage-features__grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-item ${isVisible ? 'is-visible' : ''}`}
            >
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 