import React, { useEffect, useRef, useState } from 'react';

/**
 * DashboardAnimatedBackground
 *
 * Full-screen cinematic animated background for CrediTrust AI Executive Dashboard.
 * Integrates the official Dribbble reference video (Tig Manukyan / Credit Card Motion)
 * with a dark emerald cinematic overlay, subtle floating luminous particles,
 * and an automatic high-fidelity canvas fallback (flowing silk ribbons) if video
 * is unavailable or user prefers reduced motion.
 *
 * OPTIMIZED HIGH-PERFORMANCE SCROLL-SCRUBBING ENGINE:
 * 1. Native Hardware Seek Pipeline:
 *    - Re-encoded MP4 with ultra-dense keyframes (GOP=4, 0 B-frames, -tune fastdecode).
 *    - Uses requestVideoFrameCallback (rVFC) with 'seeked' fallback for frame-exact presentation.
 *    - Non-blocking seek queue: when a seek is in flight (isSeeking = true), incoming scroll updates
 *      do not abort the hardware decoder; instead, the newest scroll position supersedes pending work
 *      and is applied immediately the instant the active frame finishes decoding.
 * 2. Zero-Layout-Thrashing & Cached Dimensions:
 *    - maxScroll and video.duration are cached and recalculated only on resize / content mutations.
 *    - window.scrollY / document.documentElement.scrollTop is read passively without triggering reflows.
 * 3. Zero React State in Scroll Loop:
 *    - All rapidly mutating values are kept in stable closures/refs outside the React render cycle.
 *    - Component is wrapped in React.memo to prevent parent re-renders from touching the video.
 * 4. Dedicated GPU Compositing Layer:
 *    - Video element has translateZ(0) and backface-visibility: hidden to prevent repaint storms
 *      across overlapping glassmorphic cards and backdrop-filter surfaces.
 */
export const DashboardAnimatedBackgroundComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallbackCanvas, setUseFallbackCanvas] = useState<boolean>(false);

  // ─── High-Performance Scroll-to-Video Synchronization ─────────────────────
  useEffect(() => {
    // Check user preference for reduced motion — use canvas fallback instead
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setUseFallbackCanvas(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Ensure the video is paused — controlled strictly via scroll-driven currentTime
    video.pause();

    // Browser feature detection for requestVideoFrameCallback
    const hasRVFC =
      typeof HTMLVideoElement !== 'undefined' &&
      'requestVideoFrameCallback' in HTMLVideoElement.prototype;

    // ─── Mutable Seek Pipeline State ──────────────────────────────────────────
    let rafId: number | null = null;
    let rvfcId: number | null = null;

    // Cached layout and video metrics (avoids layout thrashing on scroll)
    let cachedMaxScroll = 1;
    let cachedDuration = 0;
    let metadataReady = video.readyState >= 1; // HAVE_METADATA

    // Seek queue and concurrency guard
    let isSeeking = false;
    let seekStartTime = 0;
    let pendingTargetTime: number | null = null;
    let lastSeekAppliedTime = -1;
    let latestScrollProgress: number | null = null;

    // ─── Cache viewport & document scroll geometry ────────────────────────────
    const updateCachedDimensions = () => {
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight || 1;
      cachedMaxScroll = Math.max(scrollHeight - clientHeight, 1);
    };

    updateCachedDimensions();

    // ResizeObserver catches dynamic content changes without querying layout on scroll
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateCachedDimensions();
      });
      resizeObserver.observe(document.documentElement);
    }

    // ─── Read Normalized Scroll Progress (0.0 to 1.0) ────────────────────────
    const getScrollProgress = (): number => {
      const scrollY =
        window.scrollY !== undefined
          ? window.scrollY
          : document.documentElement.scrollTop || document.body.scrollTop || 0;
      return Math.min(Math.max(scrollY / cachedMaxScroll, 0), 1);
    };

    // ─── Execute Video Seek with Concurrency Management ──────────────────────
    const executeSeek = (targetTime: number) => {
      if (!video || cachedDuration <= 0) return;

      const clamped = Math.min(Math.max(targetTime, 0), cachedDuration);

      // Deadband: skip seeks smaller than ~3ms (less than 1/10th of a 30fps frame)
      if (Math.abs(clamped - lastSeekAppliedTime) < 0.003) {
        return;
      }

      if (isSeeking) {
        // Hardware decoder is actively decoding a previous seek.
        // Queue this latest target time so it supersedes any stale intermediate position
        // without thrashing the hardware decoder pipeline.
        pendingTargetTime = clamped;
        return;
      }

      // Initiate hardware seek
      isSeeking = true;
      seekStartTime = performance.now();
      lastSeekAppliedTime = clamped;
      pendingTargetTime = null;

      try {
        video.currentTime = clamped;
      } catch {
        isSeeking = false;
        return;
      }

      // Coordinate frame presentation with rVFC if supported
      if (hasRVFC && 'requestVideoFrameCallback' in video) {
        if (rvfcId !== null && 'cancelVideoFrameCallback' in video) {
          (video as any).cancelVideoFrameCallback(rvfcId);
        }
        rvfcId = (video as any).requestVideoFrameCallback(handleFramePresented);
      }
    };

    // ─── Frame Presented / Seek Completed Callback ───────────────────────────
    const handleSeekCompleted = () => {
      isSeeking = false;
      rvfcId = null;

      // If a newer scroll position arrived while the previous frame was decoding,
      // apply it immediately to keep the video locked to the newest scroll position.
      if (pendingTargetTime !== null) {
        const nextTarget = pendingTargetTime;
        pendingTargetTime = null;
        executeSeek(nextTarget);
      }
    };

    const handleSeekedEvent = () => {
      handleSeekCompleted();
    };

    const handleFramePresented = (_now: DOMHighResTimeStamp, _metadata: any) => {
      handleSeekCompleted();
    };

    // ─── Watchdog Guard for Edge-Case Decoder Stalls ──────────────────────────
    const checkDecoderWatchdog = () => {
      // If isSeeking has been held for > 90ms (e.g. dropped event), force unlock
      if (isSeeking && performance.now() - seekStartTime > 90) {
        handleSeekCompleted();
      }
    };

    // ─── Single rAF Batch Callback ───────────────────────────────────────────
    const applyAnimationFrame = () => {
      rafId = null;
      checkDecoderWatchdog();

      if (latestScrollProgress === null) return;
      if (!metadataReady || cachedDuration <= 0) return;

      const progress = latestScrollProgress;
      latestScrollProgress = null;
      const targetTime = progress * cachedDuration;

      executeSeek(targetTime);
    };

    // ─── Passive Scroll Event Handler ────────────────────────────────────────
    const handleScroll = () => {
      latestScrollProgress = getScrollProgress();
      if (rafId === null) {
        rafId = requestAnimationFrame(applyAnimationFrame);
      }
    };

    // ─── Video Metadata Loaded Handler ───────────────────────────────────────
    const handleLoadedMetadata = () => {
      metadataReady = true;
      cachedDuration = video.duration && isFinite(video.duration) ? video.duration : 0;
      updateCachedDimensions();

      // Initial alignment: scrub to the current scroll position immediately
      const initialProgress = getScrollProgress();
      if (cachedDuration > 0) {
        executeSeek(initialProgress * cachedDuration);
      }
    };

    // If metadata is already available on mount, initialize duration and seek
    if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
      handleLoadedMetadata();
    }

    // ─── Visibility Change Handler ───────────────────────────────────────────
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        video.pause();
        updateCachedDimensions();
        // Re-synchronize frame when user returns to tab
        if (metadataReady && cachedDuration > 0) {
          executeSeek(getScrollProgress() * cachedDuration);
        }
      }
    };

    const handleWindowResize = () => {
      updateCachedDimensions();
    };

    // ─── Event Listeners Registration ────────────────────────────────────────
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeekedEvent);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleWindowResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeekedEvent);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleWindowResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (rvfcId !== null && hasRVFC && 'cancelVideoFrameCallback' in video) {
        (video as any).cancelVideoFrameCallback(rvfcId);
        rvfcId = null;
      }
    };
  }, []);

  // ─── Canvas Particle / Fallback Wave Simulation ───────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

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

    const particleCount = 24;
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
    let isVisible = !document.hidden;

    const render = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      time += 0.007;
      ctx.clearRect(0, 0, width, height);

      // Procedural silk ribbon waves if video fails or reduced-motion is requested
      if (useFallbackCanvas) {
        const baseGrad = ctx.createLinearGradient(0, 0, width, height);
        baseGrad.addColorStop(0, '#0A0E0D');
        baseGrad.addColorStop(0.4, '#101514');
        baseGrad.addColorStop(0.75, '#121816');
        baseGrad.addColorStop(1, '#0A0E0D');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);

        const waveLayers = [
          {
            colorStart: 'rgba(35, 45, 42, 0.35)',
            colorEnd: 'rgba(10, 14, 13, 0.05)',
            highlight: 'rgba(215, 224, 219, 0.35)',
            speed: 0.9,
            amplitude: 65,
            yOffset: 0.3,
            phaseOffset: 0,
          },
          {
            colorStart: 'rgba(45, 58, 54, 0.28)',
            colorEnd: 'rgba(12, 17, 16, 0.05)',
            highlight: 'rgba(220, 232, 223, 0.40)',
            speed: 1.2,
            amplitude: 80,
            yOffset: 0.5,
            phaseOffset: Math.PI * 0.45,
          },
          {
            colorStart: 'rgba(38, 50, 46, 0.22)',
            colorEnd: 'rgba(10, 14, 13, 0.05)',
            highlight: 'rgba(168, 137, 85, 0.35)',
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
      radial1.addColorStop(0, 'rgba(35, 48, 44, 0.12)');
      radial1.addColorStop(1, 'rgba(10, 14, 13, 0)');
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

    const handleCanvasVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && animationFrameId === null) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleCanvasVisibility);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleCanvasVisibility);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
  }, [useFallbackCanvas]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* 1. Underlying Cinematic MP4 Video Layer — playback scrubbed by scroll position */}
      {!useFallbackCanvas && (
        <video
          ref={videoRef}
          src="/assets/video/dashboard-bg.mp4"
          muted
          playsInline
          preload="auto"
          onError={() => setUseFallbackCanvas(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-85 scale-[1.02]"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        />
      )}

      {/* 2. Institutional Color Grading & Tone Matching Layer (Neutral Graphite / Charcoal) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B100F]/60 via-[#0E1413]/40 to-[#0B100F]/70 pointer-events-none" />

      {/* 3. Caustic Ambient Depth & Particle Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen opacity-75 pointer-events-none"
      />

      {/* 4. Fine Neutral Vignette around edges to anchor glassmorphism */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(8,12,11,0.70)] pointer-events-none" />
    </div>
  );
};

export const DashboardAnimatedBackground = React.memo(DashboardAnimatedBackgroundComponent);
