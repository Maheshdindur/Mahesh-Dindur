import React, { useEffect, useRef, useState } from 'react';

export const DynamicNatureBackground = () => {
  const canvasRef = useRef(null);
  const [currentPhaseName, setCurrentPhaseName] = useState('Ocean Wave');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star field generation
    const numStars = 90;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.03 + 0.01
    }));

    // Shooting stars
    const shootingStars = [];

    // Wave parameters
    let waveStep = 0;

    // Timeline control: Cycle between 3 phases over ~30 seconds total
    // Phase 0: Ocean Wave (0 - 10s)
    // Phase 1: Golden Sunshine (10 - 20s)
    // Phase 2: Starry Night Sky (20 - 30s)
    let startTime = Date.now();

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const cycleTime = elapsed % 30; // 30s cycle

      let oceanAlpha = 0;
      let sunAlpha = 0;
      let nightAlpha = 0;

      if (cycleTime < 10) {
        // Ocean phase transition
        oceanAlpha = 1;
        if (cycleTime < 2) oceanAlpha = cycleTime / 2;
        if (cycleTime > 8) oceanAlpha = (10 - cycleTime) / 2;
        if (currentPhaseName !== '🌊 Ocean Current') setCurrentPhaseName('🌊 Ocean Current');
      } else if (cycleTime < 20) {
        // Sunshine phase
        sunAlpha = 1;
        if (cycleTime < 12) sunAlpha = (cycleTime - 10) / 2;
        if (cycleTime > 18) sunAlpha = (20 - cycleTime) / 2;
        if (currentPhaseName !== '🌅 Golden Sunshine') setCurrentPhaseName('🌅 Golden Sunshine');
      } else {
        // Night sky phase
        nightAlpha = 1;
        if (cycleTime < 22) nightAlpha = (cycleTime - 20) / 2;
        if (cycleTime > 28) nightAlpha = (30 - cycleTime) / 2;
        if (currentPhaseName !== '✨ Starry Night') setCurrentPhaseName('✨ Starry Night');
      }

      ctx.clearRect(0, 0, width, height);

      // Base atmospheric dark background color
      ctx.fillStyle = '#08090e';
      ctx.fillRect(0, 0, width, height);

      // --- PHASE 1: OCEAN WAVES (Left to Right Sweep) ---
      if (oceanAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = oceanAlpha * 0.75;

        // Deep ocean gradient overlay
        const oceanBg = ctx.createLinearGradient(0, 0, width, height);
        oceanBg.addColorStop(0, 'rgba(10, 25, 47, 0.6)');
        oceanBg.addColorStop(0.5, 'rgba(12, 74, 96, 0.4)');
        oceanBg.addColorStop(1, 'rgba(6, 182, 212, 0.15)');
        ctx.fillStyle = oceanBg;
        ctx.fillRect(0, 0, width, height);

        // Animated ocean sine waves rolling left to right
        waveStep += 0.025;

        const drawWave = (yOffset, amplitude, frequency, speed, color1, color2) => {
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 15) {
            const y = yOffset + Math.sin(x * frequency + waveStep * speed) * amplitude + Math.cos(x * 0.005 + waveStep) * 15;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();

          const waveGrad = ctx.createLinearGradient(0, yOffset - amplitude, width, height);
          waveGrad.addColorStop(0, color1);
          waveGrad.addColorStop(1, color2);
          ctx.fillStyle = waveGrad;
          ctx.fill();
        };

        drawWave(height * 0.55, 45, 0.004, 1.2, 'rgba(14, 116, 144, 0.35)', 'rgba(6, 182, 212, 0.05)');
        drawWave(height * 0.68, 35, 0.007, 1.8, 'rgba(6, 182, 212, 0.25)', 'rgba(34, 211, 238, 0.03)');
        drawWave(height * 0.8, 25, 0.01, 2.2, 'rgba(56, 189, 248, 0.2)', 'rgba(12, 74, 96, 0.08)');

        ctx.restore();
      }

      // --- PHASE 2: WARM SUNSHINE (Sunrise / Golden Hour) ---
      if (sunAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = sunAlpha * 0.8;

        // Golden hour gradient overlay
        const sunBg = ctx.createRadialGradient(width * 0.3, height * 0.4, 50, width * 0.3, height * 0.4, width * 0.8);
        sunBg.addColorStop(0, 'rgba(255, 120, 73, 0.35)');
        sunBg.addColorStop(0.4, 'rgba(249, 115, 22, 0.18)');
        sunBg.addColorStop(0.7, 'rgba(251, 191, 36, 0.08)');
        sunBg.addColorStop(1, 'rgba(9, 10, 15, 0)');

        ctx.fillStyle = sunBg;
        ctx.fillRect(0, 0, width, height);

        // Soft sun orb glow
        ctx.beginPath();
        const sunGlow = ctx.createRadialGradient(width * 0.25, height * 0.35, 10, width * 0.25, height * 0.35, 180);
        sunGlow.addColorStop(0, 'rgba(255, 183, 3, 0.6)');
        sunGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.25)');
        sunGlow.addColorStop(1, 'rgba(255, 120, 73, 0)');
        ctx.fillStyle = sunGlow;
        ctx.arc(width * 0.25, height * 0.35, 180, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // --- PHASE 3: STARRY NIGHT SKY (Twinkling Stars & Shooting Stars) ---
      if (nightAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = nightAlpha * 0.85;

        // Deep cosmic background
        const nightBg = ctx.createRadialGradient(width * 0.7, height * 0.3, 50, width * 0.5, height * 0.5, width);
        nightBg.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
        nightBg.addColorStop(0.5, 'rgba(15, 23, 42, 0.5)');
        nightBg.addColorStop(1, 'rgba(7, 8, 12, 0.9)');

        ctx.fillStyle = nightBg;
        ctx.fillRect(0, 0, width, height);

        // Render twinkling stars
        stars.forEach((star) => {
          star.alpha += star.speed;
          const alphaVal = (Math.sin(star.alpha) + 1) / 2; // Smooth 0 to 1 cycle
          ctx.fillStyle = `rgba(248, 250, 252, ${alphaVal * 0.85})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Spawn occasional shooting stars
        if (Math.random() < 0.02 && shootingStars.length < 3) {
          shootingStars.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.4),
            length: Math.random() * 80 + 40,
            speed: Math.random() * 10 + 6,
            angle: Math.PI / 4,
            alpha: 1
          });
        }

        // Draw shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          ctx.strokeStyle = `rgba(224, 242, 254, ${s.alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + Math.cos(s.angle) * s.length, s.y + Math.sin(s.angle) * s.length);
          ctx.stroke();

          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.alpha -= 0.025;

          if (s.alpha <= 0) {
            shootingStars.splice(i, 1);
          }
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          width: '100vw',
          height: '100vh'
        }}
      />
      {/* Small phase indicator pill at bottom left */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          background: 'rgba(15, 19, 28, 0.75)',
          backdropFilter: 'blur(12px)',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          pointerEvents: 'none'
        }}
      >
        <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
        <span>Environment Cycle: {currentPhaseName}</span>
      </div>
    </>
  );
};
