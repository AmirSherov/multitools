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
          fpsLimit: 20,
          particles: {
            number: {
              value: 20,
              density: {
                enable: true,
                value_area: 600
              }
            },
            color: {
              value: '#8c43ff'
            },
            shape: {
              type: 'circle'
            },
            opacity: {
              value: 0.2
            },
            size: {
              value: 1.5
            },
            move: {
              enable: true,
              speed: 0.3,
              out_mode: 'out'
            },
            links: {
              enable: false
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: false
              },
              onclick: {
                enable: false
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
