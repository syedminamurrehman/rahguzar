"use client";
import { useEffect, useRef } from "react";

const BubbleAnimation = ({ bubbleCount }: { bubbleCount: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let bubbles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      velocityX: number;
      velocityY: number;
      opacity: number;
      expansionRate: number;
      life: number;
    }[] = [];

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createBubbles = () => {
      bubbles = [];
      for (let i = 0; i < bubbleCount; i++) {
        const radius = Math.random() * 15 + 5;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const hue = Math.floor(Math.random() * 360);
        const color = `hsl(${hue}, 100%, 70%)`;
        const velocityX = (Math.random() - 0.5) * 8;
        const velocityY = (Math.random() - 0.5) * 8;
        const expansionRate = Math.random() * 0.4 + 0.2;
        const life = Math.random() * 60 + 60; // frames
        bubbles.push({
          x,
          y,
          radius,
          color,
          velocityX,
          velocityY,
          opacity: 1,
          expansionRate,
          life,
        });
      }
    };

    const drawBubble = (bubble: typeof bubbles[number]) => {
      const gradient = ctx.createRadialGradient(
        bubble.x,
        bubble.y,
        0,
        bubble.x,
        bubble.y,
        bubble.radius * 1.5
      );
      gradient.addColorStop(0, `${bubble.color}`);
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.globalAlpha = bubble.opacity;
      ctx.fillStyle = gradient;
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const updateBubble = (bubble: typeof bubbles[number], i: number) => {
      bubble.x += bubble.velocityX;
      bubble.y += bubble.velocityY;
      bubble.radius += bubble.expansionRate;
      bubble.opacity -= 0.02;
      bubble.life -= 1;

      // Regenerate bubble if it fades out
      if (bubble.opacity <= 0 || bubble.life <= 0) {
        const hue = Math.floor(Math.random() * 360);
        bubbles[i] = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 15 + 5,
          color: `hsl(${hue}, 100%, 70%)`,
          velocityX: (Math.random() - 0.5) * 8,
          velocityY: (Math.random() - 0.5) * 8,
          opacity: 1,
          expansionRate: Math.random() * 0.4 + 0.2,
          life: Math.random() * 60 + 60,
        };
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((bubble, i) => {
        drawBubble(bubble);
        updateBubble(bubble, i);
      });
      frameId = requestAnimationFrame(animate);
    };

    setCanvasDimensions();
    createBubbles();
    animate();

    const handleResize = () => {
      setCanvasDimensions();
      createBubbles();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, [bubbleCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
        filter: "blur(1px)",
      }}
    />
  );
};

export default BubbleAnimation;
