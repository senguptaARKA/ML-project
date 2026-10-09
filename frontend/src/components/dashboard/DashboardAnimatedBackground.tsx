import React, { useEffect, useRef, useState } from 'react';

/**
 * DashboardAnimatedBackground
 *
 * Full-screen cinematic animated background for CrediTrust AI Executive Dashboard.
 * Integrates the official Dribbble reference video (Tig Manukyan / Credit Card Motion)
 * with a dark emerald cinematic overlay, subtle floating luminous particles,
 * and an automatic high-fidelity canvas fallback (flowing silk ribbons) if video
 * is unavailable or user prefers reduced motion.
 */
export const DashboardAnimatedBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallbackCanvas, setUseFallbackCanvas] = useState<boolean>(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setUseFallbackCanvas(true);
      return;
    }

    const video = videoRef.current;
    if (video) {
      // Attempt video playback
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented or video failed, engaging canvas simulation fallback:', err);
          setUseFallbackCanvas(true);
        });
      }
    }

    // Pause video when tab is hidden to save GPU/CPU cycles
    const handleVisibility = () => {
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Canvas particle / fallback wave simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle floating luminous dust particles
    interface Particle {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speedX: number;
      speedY: number;
      phase: number;
    }

    const particleCount = 26;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.18,
        speedY: -Math.random() * 0.25 - 0.08,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let isVisible = true;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.007;

      ctx.clearRect(0, 0, width, height);

      // If video fallback mode is active, render procedural silk ribbon waves
      if (useFallbackCanvas) {
        // Deep background gradient
        const baseGrad = ctx.createLinearGradient(0, 0, width, height);
        baseGrad.addColorStop(0, '#06140F');
        baseGrad.addColorStop(0.4, '#0A211A');
        baseGrad.addColorStop(0.75, '#102F29');
        baseGrad.addColorStop(1, '#06140F');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);

        // Fluid waves
        const waveLayers = [
          {
            colorStart: 'rgba(56, 88, 47, 0.35)',
            colorEnd: 'rgba(6, 20, 15, 0.05)',
            highlight: 'rgba(171, 184, 156, 0.4)',
            speed: 0.9,
            amplitude: 65,
            yOffset: 0.3,
            phaseOffset: 0,
          },
          {
            colorStart: 'rgba(106, 148, 67, 0.28)',
            colorEnd: 'rgba(16, 47, 41, 0.05)',
            highlight: 'rgba(220, 232, 223, 0.45)',
            speed: 1.2,
            amplitude: 80,
            yOffset: 0.5,
            phaseOffset: Math.PI * 0.45,
          },
          {
            colorStart: 'rgba(146, 179, 92, 0.22)',
            colorEnd: 'rgba(6, 20, 15, 0.05)',
            highlight: 'rgba(168, 137, 85, 0.4)',
            speed: 0.85,
            amplitude: 90,
            yOffset: 0.7,
            phaseOffset: Math.PI * 0.9,
          },
        ];

        waveLayers.forEach((layer) => {
          ctx.save();
          const baseY = height * layer.yOffset;
          const currentPhase = time * layer.speed + layer.phaseOffset;

          ctx.beginPath();
          ctx.moveTo(0, height);
          ctx.lineTo(0, baseY);

          const step = width / 6;
          for (let i = 0; i <= 6; i++) {
            const x = i * step;
            const waveY =
              baseY +
              Math.sin(currentPhase + i * 0.9) * layer.amplitude +
              Math.cos(currentPhase * 0.6 + i * 0.4) * (layer.amplitude * 0.35);

            if (i === 0) {
              ctx.lineTo(x, waveY);
            } else {
              const prevX = (i - 1) * step;
              const prevWaveY =
                baseY +
                Math.sin(currentPhase + (i - 1) * 0.9) * layer.amplitude +
                Math.cos(currentPhase * 0.6 + (i - 1) * 0.4) * (layer.amplitude * 0.35);
              const cpX = (prevX + x) / 2;
              ctx.quadraticCurveTo(cpX, (prevWaveY + waveY) / 2, x, waveY);
            }
          }

          ctx.lineTo(width, height);
          ctx.closePath();

          const waveGrad = ctx.createLinearGradient(0, baseY - layer.amplitude, 0, height);
          waveGrad.addColorStop(0, layer.colorStart);
          waveGrad.addColorStop(1, layer.colorEnd);
          ctx.fillStyle = waveGrad;
          ctx.fill();

          ctx.beginPath();
          for (let i = 0; i <= 6; i++) {
            const x = i * step;
            const waveY =
              baseY +
              Math.sin(currentPhase + i * 0.9) * layer.amplitude +
              Math.cos(currentPhase * 0.6 + i * 0.4) * (layer.amplitude * 0.35);
            if (i === 0) ctx.moveTo(x, waveY);
            else {
              const prevX = (i - 1) * step;
              const prevWaveY =
                baseY +
                Math.sin(currentPhase + (i - 1) * 0.9) * layer.amplitude +
                Math.cos(currentPhase * 0.6 + (i - 1) * 0.4) * (layer.amplitude * 0.35);
              ctx.quadraticCurveTo((prevX + x) / 2, (prevWaveY + waveY) / 2, x, waveY);
            }
          }
          ctx.strokeStyle = layer.highlight;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.restore();
        });
      }

      // Atmospheric ambient radial glow
      const glow1X = width * (0.35 + 0.15 * Math.sin(time * 0.6));
      const glow1Y = height * (0.3 + 0.12 * Math.cos(time * 0.4));
      const radial1 = ctx.createRadialGradient(glow1X, glow1Y, 0, glow1X, glow1Y, width * 0.4);
      radial1.addColorStop(0, 'rgba(49, 95, 80, 0.18)');
      radial1.addColorStop(1, 'rgba(6, 20, 15, 0)');
      ctx.fillStyle = radial1;
      ctx.fillRect(0, 0, width, height);

      // Render floating dust particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 2 + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 232, 223, ${pulseAlpha})`;
        ctx.shadowColor = 'rgba(168, 137, 85, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [useFallbackCanvas]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Underlying Cinematic MP4 Video Layer */}
      {!useFallbackCanvas && (
        <video
          ref={videoRef}
          src="/assets/video/dashboard-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setUseFallbackCanvas(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-1000 scale-[1.02]"
        />
      )}

      {/* 2. Institutional Color Grading & Tone Matching Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06140F]/80 via-[#0A211A]/70 to-[#06140F]/90 mix-blend-multiply" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#06140F]/40 to-[#06140F]/90" />

      {/* 3. Caustic Ambient Depth & Particle Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen opacity-90"
      />

      {/* 4. Fine Vignette around edges to anchor glassmorphism */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(6,20,15,0.85)]" />
    </div>
  );
};
