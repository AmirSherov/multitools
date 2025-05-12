'use client';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

export default function OptimizedParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      <Particles
        id='tsparticles'
        init={particlesInit}
        options={{
          fullScreen: {
            enable: false,
            zIndex: -1
          },
          fpsLimit: 45,
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 1000
              }
            },
            color: {
              value: ['#8c43ff', '#4263ff', '#f62c84', '#00bcd4']
            },
            shape: {
              type: ['circle', 'polygon'],
              polygon: {
                sides: 5
              }
            },
            opacity: {
              value: 0.4,
              random: true,
              anim: {
                enable: false
              }
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false
              }
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: 'none',
              out_mode: 'out',
              random: false,
              straight: false,
            },
            links: {
              enable: true,
              distance: 120,
              color: '#8c43ff',
              opacity: 0.2,
              width: 1
            }
          },
          interactivity: {
            detect_on: "window",
            events: {
              onhover: {
                enable: true,
                mode: 'repulse'
              },
              onclick: {
                enable: true,
                mode: 'push'
              }
            },
            modes: {
              repulse: {
                distance: 100
              },
              push: {
                particles_nb: 4
              }
            }
          },
          retina_detect: true,
          background: {
            color: 'transparent'
          }
        }}
        style={{ 
          position: 'absolute', 
          zIndex: 0,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
