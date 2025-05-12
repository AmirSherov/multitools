'use client'
import { useState, useEffect, useRef } from "react";
import ToolCard from "../toolcards/ToolCard";
import Link from "next/link";
import "./tools.scss";

const tools = [
  {
    image: "/images/mainpage/converter.png",
    title: "Конвертер изображений",
    description: "Конвертируйте изображения в различные форматы: JPG, PNG, WEBP, SVG и другие",
    link: "/tools/convert-image",
    category: "images",
    tags: ["Изображения", "Конвертация"]
  },
  {
    image: "/images/mainpage/reducing.png",
    title: "Сжатие PDF",
    description: "Уменьшите размер PDF файлов без потери качества для удобного хранения и пересылки",
    link: "/tools/compress-pdf",
    category: "documents",
    tags: ["PDF", "Сжатие"]
  },
  {
    image: "/images/mainpage/textgenerator.webp",
    title: "AI Генератор текста",
    description: "Создавайте уникальные тексты для любых целей с помощью искусственного интеллекта",
    link: "/tools/ai-text",
    category: "ai",
    tags: ["AI", "Текст"]
  },
  {
    image: "/images/mainpage/bgremover.webp",
    title: "Удаление фона",
    description: "Автоматически удаляйте фон с изображений в один клик без потери качества",
    link: "/tools/remove-bg",
    category: "images",
    tags: ["Изображения", "Фон"]
  }
];

const Tools = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isVisible, setIsVisible] = useState(true);
  const toolsHeadingRef = useRef<HTMLDivElement>(null);
  const toolsGridRef = useRef<HTMLDivElement>(null);
  const toolsMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (toolsHeadingRef.current) {
      observer.observe(toolsHeadingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section className="tools-landing section" id="tools">
      <div className="container">
        <div className="tools-landing__heading is-visible" ref={toolsHeadingRef}>
          <h2 className="section-title is-visible">Наши популярные инструменты</h2>
          <p className="section-subtitle is-visible">
            Выберите из нашей коллекции самых популярных и полезных инструментов для вашей работы
          </p>
        </div>

        <div className="tabs">
          <div 
            className={`tabs__item ${activeTab === "all" ? "tabs__item--active" : ""}`}
            onClick={() => handleTabClick("all")}
          >
            Все
          </div>
          <div 
            className={`tabs__item ${activeTab === "images" ? "tabs__item--active" : ""}`}
            onClick={() => handleTabClick("images")}
          >
            Изображения
          </div>
          <div 
            className={`tabs__item ${activeTab === "documents" ? "tabs__item--active" : ""}`}
            onClick={() => handleTabClick("documents")}
          >
            Документы
          </div>
          <div 
            className={`tabs__item ${activeTab === "ai" ? "tabs__item--active" : ""}`}
            onClick={() => handleTabClick("ai")}
          >
            AI инструменты
          </div>
        </div>

        <div className="tools-landing__grid is-visible" ref={toolsGridRef}>
          {tools
            .filter(tool => 
              activeTab === "all" || 
              (activeTab === "images" && tool.category === "images") ||
              (activeTab === "documents" && tool.category === "documents") ||
              (activeTab === "ai" && tool.category === "ai")
            )
            .map((tool, index) => (
              <div key={index} className="tool-item is-visible">
                <ToolCard 
                  image={tool.image}
                  title={tool.title}
                  description={tool.description}
                  link={tool.link}
                  tags={tool.tags}
                />
              </div>
            ))
          }
        </div>
        
        <div className="tools-landing__more is-visible" ref={toolsMoreRef}>
          <Link href="/tools" className="btn btn-outline">
            Смотреть все инструменты
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Tools; 