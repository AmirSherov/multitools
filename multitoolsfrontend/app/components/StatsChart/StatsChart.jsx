'use client'
import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import './StatsChart.css'

const StatsChart = ({ userData }) => {
  const chartRef = useRef(null)
  const donutRef = useRef(null)
  const activityChartRef = useRef(null)
  const requestsCounterRef = useRef(null)
  const chartInstance = useRef(null)
  const donutInstance = useRef(null)
  const activityInstance = useRef(null)
  const counterInstance = useRef(null)

  const generateActivityData = () => {
    const stats = userData?.stats || {}
    const lastActive = stats.last_active ? new Date(stats.last_active) : null
    const top3 = stats.top3_tools || []
    
    const totalRequests = stats.total_requests || 0
    
    const days = []
    const data = []
    
    const today = new Date()
    
    const avgRequestsPerDay = totalRequests > 0 ? Math.max(1, Math.round(totalRequests / 7)) : 0
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      days.push(date.toLocaleDateString('ru-RU', { weekday: 'short' }))
      
      if (lastActive && date.toDateString() === lastActive.toDateString()) {
        const randomFactor = (date.getDate() * 0.3 + 0.7)
        data.push(Math.round(avgRequestsPerDay * randomFactor))
      } else if (i < 3 && lastActive) {
        data.push(Math.round(avgRequestsPerDay * 0.3 * (3 - i)))
      } else {
        data.push(0)
      }
    }
    
    return { days, data }
  }

  useEffect(() => {
    const stats = userData?.stats || {}
    const top3 = stats.top3_tools || []

    if (activityChartRef.current) {
      const activityData = generateActivityData()
      
      if (activityInstance.current) {
        activityInstance.current.destroy()
      }
      
      const ctx = activityChartRef.current.getContext('2d')
      
      const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
      gradientFill.addColorStop(0, 'rgba(140, 67, 255, 0.4)');
      gradientFill.addColorStop(1, 'rgba(140, 67, 255, 0.02)');
      
      activityInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: activityData.days,
          datasets: [{
            label: 'Количество запросов',
            data: activityData.data,
            fill: true,
            backgroundColor: gradientFill,
            borderColor: 'rgba(140, 67, 255, 0.8)',
            tension: 0.4,
            pointBackgroundColor: '#8c43ff',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Активность за последние 7 дней',
              color: '#e5e7eb',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                title: function(tooltipItems) {
                  const item = tooltipItems[0];
                  return activityData.days[item.dataIndex];
                },
                label: function(context) {
                  const value = context.parsed.y;
                  return value + ' ' + (value === 1 ? 'запрос' : 
                         (value >= 2 && value <= 4) ? 'запроса' : 'запросов');
                }
              },
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              backgroundColor: 'rgba(20, 22, 36, 0.9)',
              borderColor: 'rgba(140, 67, 255, 0.5)',
              borderWidth: 1,
              padding: 10,
              displayColors: false
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeOutQuart'
          },
          interaction: {
            mode: 'index',
            intersect: false
          }
        }
      })
    }
    
    if (requestsCounterRef.current) {
      if (counterInstance.current) {
        counterInstance.current.destroy()
      }
      
      const ctx = requestsCounterRef.current.getContext('2d')
      const totalRequests = stats.total_requests || 0
      const target = Math.max(totalRequests, 20)
      
      counterInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Выполнено', 'Осталось'],
          datasets: [{
            data: [totalRequests, totalRequests < target ? target - totalRequests : 0],
            backgroundColor: [
              'rgba(140, 67, 255, 0.7)',
              'rgba(40, 44, 52, 0.3)'
            ],
            hoverBackgroundColor: [
              'rgba(140, 67, 255, 0.9)',
              'rgba(40, 44, 52, 0.3)'
            ],
            borderWidth: 0,
            borderRadius: 5,
            cutout: '80%'
          }]
        },
        options: {
          responsive: true,
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1500
          },
          plugins: {
            title: {
              display: true,
              text: 'Всего запросов',
              color: '#e5e7eb',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              enabled: false
            }
          }
        },
        plugins: [{
          id: 'textInCenter',
          afterDraw: (chart) => {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;
            
            ctx.restore();
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, '#8c43ff');
            gradient.addColorStop(1, '#f62c84');
            
            ctx.font = 'bold 28px sans-serif';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillStyle = gradient;
            ctx.fillText(totalRequests, width / 2, height / 2);
            
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.font = '14px sans-serif';
            ctx.fillStyle = '#8c8e95';
            ctx.fillText('запросов', width / 2, height / 2 + 28);
            
            ctx.save();
          }
        }]
      });
    }
    
    if (donutRef.current && top3.length) {
      if (donutInstance.current) {
        donutInstance.current.destroy()
      }
      
      const ctx = donutRef.current.getContext('2d')
      
      const labels = top3.map(item => formatToolName(item[0]))
      const values = top3.map(item => item[1])
      
      const backgroundColors = [
        'rgba(140, 67, 255, 0.8)',   // фиолетовый
        'rgba(246, 44, 132, 0.8)',   // розовый
        'rgba(255, 193, 7, 0.8)'     // желтый
      ];
      
      const borderColors = [
        'rgba(140, 67, 255, 1)',
        'rgba(246, 44, 132, 1)',
        'rgba(255, 193, 7, 1)'
      ];
      
      donutInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2,
            hoverOffset: 10,
            hoverBorderWidth: 3
          }]
        },
        options: {
          responsive: true,
          cutout: '65%',
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1500,
          },
          plugins: {
            title: {
              display: true,
              text: 'ТОП-3 инструмента',
              color: '#e5e7eb',
              font: {
                size: 14,
                weight: 'bold'
              },
              padding: {
                bottom: 15
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  return value + ' ' + (value === 1 ? 'запрос' : (value >= 2 && value <= 4) ? 'запроса' : 'запросов');
                }
              },
              backgroundColor: 'rgba(20, 22, 36, 0.9)',
              borderColor: (context) => {
                return context.tooltip.dataPoints ? context.tooltip.dataPoints[0].dataset.borderColor[context.tooltip.dataPoints[0].dataIndex] : 'rgba(140, 67, 255, 0.5)';
              },
              borderWidth: 1,
              padding: 10,
              titleFont: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          plugins: [{
            id: 'customLegend',
            afterRender: function(chart) {
              const ctx = chart.ctx;
              const legendHeight = 30; // Высота каждого элемента легенды
              const legendSpace = 10; // Отступ между элементами
              const startX = chart.chartArea.left + 20;
              let startY = chart.chartArea.bottom + 30;
              
              // Получаем данные для легенды
              const legendData = chart.data.labels.map((label, index) => ({
                text: `${label} - ${chart.data.datasets[0].data[index]} ${
                  chart.data.datasets[0].data[index] === 1 ? 'запрос' : 
                  (chart.data.datasets[0].data[index] >= 2 && chart.data.datasets[0].data[index] <= 4) ? 'запроса' : 'запросов'
                }`,
                color: chart.data.datasets[0].backgroundColor[index]
              }));
              
              ctx.save();
              
              // Рисуем заголовок легенды
              ctx.textBaseline = 'middle';
              ctx.textAlign = 'center';
              ctx.fillStyle = '#e5e7eb';
              ctx.font = 'bold 13px Arial, sans-serif';
              ctx.fillText('Статистика использования инструментов', chart.width / 2, startY - 15);
              
              // Рисуем элементы легенды
              legendData.forEach((item, index) => {
                const y = startY + index * (legendHeight + legendSpace);
                
                // Рисуем маркер
                ctx.beginPath();
                ctx.arc(startX, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = item.color;
                ctx.fill();
                
                // Рисуем текст с градиентом и тенью
                const gradient = ctx.createLinearGradient(startX + 15, y, startX + 250, y);
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(1, '#e5e7eb');
                
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.fillStyle = gradient;
                ctx.font = '500 13px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(item.text, startX + 15, y);
              });
              
              ctx.restore();
            }
          }]
        }
      })
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
      if (donutInstance.current) {
        donutInstance.current.destroy()
      }
      if (activityInstance.current) {
        activityInstance.current.destroy()
      }
      if (counterInstance.current) {
        counterInstance.current.destroy()
      }
    }
  }, [userData])

  return (
    <div className="stats-charts">
      <div className="stats-chart-row">
        <div className="stats-chart-col">
          <canvas ref={activityChartRef} />
        </div>
        <div className="stats-chart-col">
          <canvas ref={donutRef} />
        </div>
      </div>
      <div className="stats-counter-row">
        <div className="stats-counter-col">
          <div className="counter-wrapper">
            <canvas ref={requestsCounterRef} />
          </div>
        </div>
      </div>
      
      <div className="stats-summary">
        <div className="stats-summary-title">Дополнительная информация</div>
        <div className="stats-summary-row">
          <span>Последняя активность:</span>
          <b>
            {userData?.stats?.last_active 
              ? formatDate(new Date(userData.stats.last_active)) 
              : '-'}
          </b>
        </div>
        <div className="stats-summary-row">
          <span>Последний инструмент:</span>
          <b>{userData?.stats?.last_tool ? formatToolName(userData.stats.last_tool) : '-'}</b>
        </div>
      </div>
    </div>
  )
}

// Добавляем функцию форматирования даты выше в компоненте
// Форматируем дату в удобочитаемый вид
const formatDate = (date) => {
  if (!date) return '-';
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const oneDay = 86400000; // миллисекунд в дне
  
  // Если активность была сегодня
  if (date.toDateString() === now.toDateString()) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Сегодня в ${hours}:${minutes}`;
  }
  
  // Если активность была вчера
  if (diff < oneDay * 2 && date.toDateString() === new Date(now - oneDay).toDateString()) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Вчера в ${hours}:${minutes}`;
  }
  
  // Если активность была на этой неделе
  if (diff < oneDay * 7) {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${days[date.getDay()]} в ${hours}:${minutes}`;
  }
  
  // Если активность была давно
  return date.toLocaleString('ru-RU');
}

// Расширяем список названий инструментов
const formatToolName = (toolName) => {
  const toolNames = {
    // Инструменты для загрузки
    'download_instagram': 'Загрузка Instagram',
    'download_tiktok': 'Загрузка TikTok',
    'download_youtube': 'Загрузка YouTube',
    'download_facebook': 'Загрузка Facebook',
    'download_twitter': 'Загрузка Twitter',
    'download_vk': 'Загрузка ВКонтакте',
    
    // Инструменты для работы с изображениями
    'image_editor': 'Редактор изображений',
    'image_converter': 'Конвертер изображений',
    'image_resize': 'Изменение размера фото',
    'image_compress': 'Сжатие изображений',
    
    // Инструменты для работы с текстом
    'text_converter': 'Конвертер текста',
    'text_translate': 'Переводчик текста',
    'text_to_speech': 'Текст в речь',
    
    // Инструменты для анализа
    'data_analyzer': 'Анализ данных',
    'seo_analyzer': 'SEO анализ',
    
    // Общие инструменты
    'file_converter': 'Конвертер файлов',
    'password_generator': 'Генератор паролей',
    'qr_generator': 'Генератор QR-кодов'
  };
  
  // Если название инструмента не найдено в словаре, 
  // пытаемся сделать его более читаемым (download_instagram -> Download Instagram)
  if (!toolNames[toolName]) {
    return toolName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return toolNames[toolName];
};

export default StatsChart 