"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const FRAME_COUNT = 120;
const SEQUENCE_DIR = "/images/sequence4";

interface ScrollAnimationSeq4Props {
  onProgress?: (progress: number) => void;
  onLoadComplete?: () => void;
}

export default function ScrollAnimationSeq4({ onProgress, onLoadComplete }: ScrollAnimationSeq4Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store images in memory
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef({ value: 0 });

  useEffect(() => {
    imagesRef.current = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      imagesRef.current.push(new Image());
    }

    let loadedCount = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = imagesRef.current[i - 1];
      const num = i.toString().padStart(3, "0");
      img.src = `${SEQUENCE_DIR}/ezgif-frame-${num}.webp`;

      img.onload = () => {
        loadedCount++;
        if (onProgress) {
          onProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        }

        if (i - 1 === Math.round(currentFrame.current.value)) {
          render();
        }
        if (loadedCount === FRAME_COUNT) {
          ScrollTrigger.refresh();
          if (onLoadComplete) {
            onLoadComplete();
          }
        }
      };
    }
  }, [onProgress, onLoadComplete]);

  function render() {
    if (!canvasRef.current || imagesRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.round(currentFrame.current.value);
    const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));
    const img = imagesRef.current[safeIndex];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (img && img.complete) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#d71920";
      ctx.font = "50px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Loading Frame ${safeIndex + 1}...`, canvas.width / 2, canvas.height / 2);
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let autoScrollTween: gsap.core.Tween | null = null;
    let scrollTimeout: NodeJS.Timeout | null = null;
    let isActiveSection = false;
    let isProgrammaticScroll = false;

    const startAutoScroll = () => {
      if (!isActiveSection || !containerRef.current) return;

      const endY = containerRef.current.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      const distanceLeft = endY - window.scrollY;

      if (distanceLeft <= 5) return;

      const duration = Math.max(0.5, distanceLeft / 400);

      isProgrammaticScroll = true;
      autoScrollTween = gsap.to(window, {
        scrollTo: {
          y: endY,
          autoKill: true,
          onAutoKill: () => {
            isProgrammaticScroll = false;
          },
        },
        duration: duration,
        ease: "none",
        onComplete: () => {
          isProgrammaticScroll = false;
        },
      });
    };

    const handleScroll = () => {
      if (!isActiveSection) return;
      if (isProgrammaticScroll) return;

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        startAutoScroll();
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const ctx = gsap.context(() => {
      const frameObj = { val: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onToggle: (self: any) => {
            isActiveSection = self.isActive;
            if (!self.isActive) {
              if (autoScrollTween) autoScrollTween.kill();
              if (scrollTimeout) clearTimeout(scrollTimeout);
              isProgrammaticScroll = false;
            }
          },
          onEnter: () => {
            gsap.delayedCall(0.5, () => {
              startAutoScroll();
            });
          },
          onEnterBack: () => {
            gsap.delayedCall(0.5, () => {
              if (!isActiveSection || !containerRef.current) return;
              const startY = containerRef.current.getBoundingClientRect().top + window.scrollY;
              const distanceLeft = window.scrollY - startY;
              if (distanceLeft <= 5) return;

              const duration = Math.max(0.5, distanceLeft / 400);
              isProgrammaticScroll = true;
              autoScrollTween = gsap.to(window, {
                scrollTo: {
                  y: startY,
                  autoKill: true,
                  onAutoKill: () => {
                    isProgrammaticScroll = false;
                  },
                },
                duration: duration,
                ease: "none",
                onComplete: () => {
                  isProgrammaticScroll = false;
                },
              });
            });
          },
        },
      });

      tl.to(frameObj, {
        val: FRAME_COUNT - 1,
        ease: "none",
        onUpdate: () => {
          currentFrame.current.value = frameObj.val;
          render();
        },
      });
    }, containerRef);

    return () => {
      if (autoScrollTween) autoScrollTween.kill();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full relative h-[400vh] bg-[#050505]">
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full max-w-6xl h-auto object-contain rounded-xl shadow-2xl bg-black"
        />
      </div>
    </div>
  );
}
