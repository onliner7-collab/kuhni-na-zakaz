"use client";

import { type CSSProperties, useCallback, useEffect, useRef } from "react";

interface ElectricContactBorderProps {
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  padding?: number;
  displacement?: number;
  thickness?: number;
  className?: string;
  style?: CSSProperties;
}

function hexToRgba(hex: string, alpha = 1) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((char) => char + char).join("")
    : value;
  const int = Number.parseInt(normalized, 16);

  if (Number.isNaN(int)) return `rgba(91, 244, 255, ${alpha})`;

  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

export function ElectricContactBorder({
  color = "#5bf4ff",
  speed = 0.42,
  chaos = 0.075,
  borderRadius = 999,
  padding = 26,
  displacement = 58,
  thickness = 0.95,
  className,
  style,
}: ElectricContactBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback((x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const noise2D = useCallback((x: number, y: number) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;
    const a = random(i + j * 57);
    const b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57);
    const d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }, [random]);

  const octavedNoise = useCallback((x: number, time: number, seed: number) => {
    let y = 0;
    let amplitude = chaos;
    let frequency = 10;

    for (let i = 0; i < 10; i += 1) {
      y += amplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= 1.6;
      amplitude *= 0.7;
    }

    return y;
  }, [chaos, noise2D]);

  const getCornerPoint = useCallback((
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    arcLength: number,
    progress: number,
  ) => {
    const angle = startAngle + progress * arcLength;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  }, []);

  const getRoundedRectPoint = useCallback((
    t: number,
    left: number,
    top: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    const straightWidth = width - 2 * radius;
    const straightHeight = height - 2 * radius;
    const cornerArc = (Math.PI * radius) / 2;
    const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    const distance = t * totalPerimeter;
    let accumulated = 0;

    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + radius + progress * straightWidth, y: top };
    }
    accumulated += straightWidth;

    if (distance <= accumulated + cornerArc) {
      return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left + width, y: top + radius + progress * straightHeight };
    }
    accumulated += straightHeight;

    if (distance <= accumulated + cornerArc) {
      return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, (distance - accumulated) / cornerArc);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + width - radius - progress * straightWidth, y: top + height };
    }
    accumulated += straightWidth;

    if (distance <= accumulated + cornerArc) {
      return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left, y: top + height - radius - progress * straightHeight };
    }
    accumulated += straightHeight;

    return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, (distance - accumulated) / cornerArc);
  }, [getCornerPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const borderOffset = padding;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      return { width, height, dpr };
    };

    let { width, height, dpr: lastDpr } = updateSize();

    const drawElectricBorder = (currentTime: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) {
        lastDpr = dpr;
        const newSize = updateSize();
        width = newSize.width;
        height = newSize.height;
      }

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const left = borderOffset;
      const top = borderOffset;
      const borderWidth = width - 2 * borderOffset;
      const borderHeight = height - 2 * borderOffset;
      const radius = Math.min(borderRadius, Math.min(borderWidth, borderHeight) / 2);
      const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
      const sampleCount = Math.floor(approximatePerimeter / 2);

      ctx.beginPath();
      for (let i = 0; i <= sampleCount; i += 1) {
        const progress = i / sampleCount;
        const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);
        const displacedX = point.x + octavedNoise(progress * 8, timeRef.current, 0) * displacement;
        const displacedY = point.y + octavedNoise(progress * 8, timeRef.current, 1) * displacement;

        if (i === 0) ctx.moveTo(displacedX, displacedY);
        else ctx.lineTo(displacedX, displacedY);
      }
      ctx.closePath();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(5, 18, 22, 0.72)";
      ctx.lineWidth = thickness + 3.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.shadowColor = hexToRgba(color, 0.56);
      ctx.shadowBlur = 5;
      ctx.strokeStyle = hexToRgba(color, 0.42);
      ctx.lineWidth = thickness + 0.9;
      ctx.stroke();

      ctx.shadowBlur = 0.8;
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = hexToRgba("#e8feff", 0.95);
      ctx.lineWidth = Math.max(0.7, thickness * 0.48);
      ctx.setLineDash([10, 34, 4, 52]);
      ctx.lineDashOffset = -timeRef.current * 14;
      ctx.stroke();
      ctx.setLineDash([]);

      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(drawElectricBorder);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
    });

    resizeObserver.observe(container);
    animationRef.current = requestAnimationFrame(drawElectricBorder);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [borderRadius, chaos, color, displacement, getRoundedRectPoint, octavedNoise, padding, speed, thickness]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{
        borderRadius,
        boxShadow: `0 0 0 1px rgba(5, 18, 22, 0.5), 0 0 0 2px ${hexToRgba(color, 0.28)}, 0 0 8px ${hexToRgba(color, 0.24)}, 0 0 18px ${hexToRgba(color, 0.12)}`,
        ...style,
      }}
    >
      <canvas ref={canvasRef} className="electric-contact-canvas" aria-hidden="true" />
    </span>
  );
}
