"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SEQ4_FRAME_COUNT = 120;
const SEQ3_FRAME_COUNT = 240;
const TOTAL_FRAME_COUNT = SEQ4_FRAME_COUNT + SEQ3_FRAME_COUNT;

interface ScrollAnimationProps {
  onProgress?: (progress: number) => void;
  onLoadComplete?: () => void;
}

export default function ScrollAnimation({ onProgress, onLoadComplete }: ScrollAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store the images in memory
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  // Track the current frame number outside of React state/refs for GSAP
  const currentFrame = useRef({ value: 0 });

  useEffect(() => {
    imagesRef.current = [];
    for (let i = 0; i < TOTAL_FRAME_COUNT; i++) {
      imagesRef.current.push(new Image());
    }
    
    const loadImages = async () => {
      let loadedCount = 0;
      for (let i = 1; i <= TOTAL_FRAME_COUNT; i++) {
        const img = imagesRef.current[i - 1];
        
        // Frames 1-120: Sequence 4, Frames 121-360: Sequence 3
        if (i <= SEQ4_FRAME_COUNT) {
          const num = i.toString().padStart(3, "0");
          img.src = `/images/sequence4/ezgif-frame-${num}.webp`;
        } else {
          const num = (i - SEQ4_FRAME_COUNT).toString().padStart(3, "0");
          img.src = `/images/sequence3/ezgif-frame-${num}.webp`;
        }
        
        img.onload = () => {
          loadedCount++;
          if (onProgress) {
            onProgress(Math.round((loadedCount / TOTAL_FRAME_COUNT) * 100));
          }
          
          // If the image that just loaded is the one we are currently looking at, render it!
          if (i - 1 === Math.round(currentFrame.current.value)) {
            render();
          }
          if (loadedCount === TOTAL_FRAME_COUNT) {
            ScrollTrigger.refresh();
            if (onLoadComplete) {
              onLoadComplete();
            }
          }
        };
      }
    };
    loadImages();
  }, [onProgress, onLoadComplete]);

  function render() {
    if (!canvasRef.current || imagesRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.round(currentFrame.current.value);
    // Safety clamp
    const safeIndex = Math.max(0, Math.min(TOTAL_FRAME_COUNT - 1, frameIndex));
    const img = imagesRef.current[safeIndex];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (img && img.complete) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback: if image isn't loaded yet, draw a loading indicator
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
      if (!containerRef.current) return;

      const endY = containerRef.current.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      const distanceLeft = endY - window.scrollY;

      if (distanceLeft <= 10) return;

      const duration = Math.max(0.5, distanceLeft / 350);

      isProgrammaticScroll = true;
      if (autoScrollTween) autoScrollTween.kill();

      autoScrollTween = gsap.to(window, {
        scrollTo: { 
          y: endY, 
          autoKill: true,
          onAutoKill: () => {
            isProgrammaticScroll = false;
          }
        },
        duration: duration,
        ease: "none",
        onComplete: () => {
          isProgrammaticScroll = false;
        },
      });
    };

    const handleScroll = () => {
      if (isProgrammaticScroll) return;

      // User is manually scrolling: pause auto-scroll
      if (autoScrollTween) {
        autoScrollTween.kill();
      }

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isActiveSection) {
          startAutoScroll();
        }
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
            if (self.isActive && !isProgrammaticScroll) {
              startAutoScroll();
            } else if (!self.isActive) {
              if (autoScrollTween) autoScrollTween.kill();
              if (scrollTimeout) clearTimeout(scrollTimeout);
              isProgrammaticScroll = false;
            }
          },
          onEnter: () => {
            isActiveSection = true;
            gsap.delayedCall(0.5, startAutoScroll);
          },
          onLeave: () => {
            isActiveSection = false;
            if (autoScrollTween) autoScrollTween.kill();
            if (scrollTimeout) clearTimeout(scrollTimeout);
            isProgrammaticScroll = false;
          },
          onLeaveBack: () => {
            isActiveSection = false;
            if (autoScrollTween) autoScrollTween.kill();
            if (scrollTimeout) clearTimeout(scrollTimeout);
            isProgrammaticScroll = false;
          }
        },
      });

      tl.to(frameObj, {
        val: TOTAL_FRAME_COUNT - 1,
        ease: "none",
        onUpdate: () => {
          currentFrame.current.value = frameObj.val;
          render();
        }
      });
    }, containerRef.current || undefined);

    // Initial trigger: when page loads and preloader disappears (~1.2s), start auto-scroll automatically
    const initialTimer = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom > window.innerHeight) {
          isActiveSection = true;
          startAutoScroll();
        }
      }
    }, 1200);

    return () => {
      clearTimeout(initialTimer);
      if (autoScrollTween) autoScrollTween.kill();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

    // Using a 550vh container for smooth scrolling through all 360 frames (sequence4 + sequence3)
    // while the canvas is natively stuck via position: sticky
    return (
      <div ref={containerRef} className="w-full relative h-[550vh] bg-[#050505]">
        <div className="sticky top-20 w-full h-[calc(100vh-5rem)] flex flex-col items-center justify-center md:justify-start pt-0 md:pt-4 lg:pt-6 overflow-hidden px-2 sm:px-4">
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="w-full max-w-6xl max-h-[calc(100vh-7rem)] h-auto object-contain rounded-xl shadow-2xl bg-black"
          />
        </div>
      </div>
  );
}
