import React, { useEffect, useRef } from 'react';

/**
 * Enterprise Cybersecurity Telemetry & Threat Mesh Animation
 * Designed with the aesthetic of high-end defense platforms (CrowdStrike, Darktrace, Cloudflare Radar)
 * Features dynamic interconnected security nodes, live packet pulses, and interactive cursor magnetic field.
 */
export function Cyber3DScene({ className = 'absolute inset-0 w-full h-full pointer-events-none z-0' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const updateDimensions = () => {
      const parent = canvas.parentElement;
      return {
        w: (canvas.width = parent ? parent.clientWidth : window.innerWidth),
        h: (canvas.height = parent ? parent.clientHeight : window.innerHeight),
      };
    };

    let { w: width, h: height } = updateDimensions();

    // Particle nodes configuration
    const NODE_COUNT = Math.floor(Math.min(width, 1600) / 16);
    const MAX_DISTANCE = 130;
    const MOUSE_RADIUS = 160;

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    class SecurityNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.8 + 1.2;
        this.baseAlpha = Math.random() * 0.5 + 0.3;
        this.alpha = this.baseAlpha;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
        const rand = Math.random();
        if (rand > 0.85) {
          this.color = '56, 189, 248'; // Bright Cyan
          this.isKeyNode = true;
        } else if (rand > 0.7) {
          this.color = '129, 140, 248'; // Indigo
          this.isKeyNode = false;
        } else {
          this.color = '14, 165, 233'; // Sky Blue
          this.isKeyNode = false;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.pulse += this.pulseSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.25;

        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            this.x -= (dx / dist) * force * 1.8;
            this.y -= (dy / dist) * force * 1.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();

        if (this.isKeyNode) {
          const pingRadius = this.radius + (Math.sin(this.pulse) + 1) * 3.5;
          ctx.beginPath();
          ctx.arc(this.x, this.y, pingRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${this.color}, ${Math.max(0, 0.4 - pingRadius * 0.04)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    const nodes = Array.from({ length: NODE_COUNT }, () => new SecurityNode());

    const packets = [];
    const createPacket = (nodeA, nodeB) => {
      packets.push({
        x: nodeA.x,
        y: nodeA.y,
        targetX: nodeB.x,
        targetY: nodeB.y,
        progress: 0,
        speed: 0.02 + Math.random() * 0.02,
        color: nodeA.color,
      });
    };

    let packetTimer = 0;

    const handleResize = () => {
      const dims = updateDimensions();
      width = dims.w;
      height = dims.h;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      if (mouse.active) {
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          MOUSE_RADIUS
        );
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.07)');
        gradient.addColorStop(0.7, 'rgba(56, 189, 248, 0.02)');
        gradient.addColorStop(1, 'rgba(8, 12, 20, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        nodeA.update();
        nodeA.draw();

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const lineAlpha = (1 - dist / MAX_DISTANCE) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();

            if (packetTimer % 45 === 0 && Math.random() < 0.03 && packets.length < 25) {
              createPacket(nodeA, nodeB);
            }
          }
        }

        if (mouse.active) {
          const dx = nodeA.x - mouse.x;
          const dy = nodeA.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const lineAlpha = (1 - dist / MOUSE_RADIUS) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      packetTimer++;
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        p.progress += p.speed;
        if (p.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }
        const px = p.x + (p.targetX - p.x) * p.progress;
        const py = p.y + (p.targetY - p.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.85)`;
        ctx.shadowColor = 'rgba(56, 189, 248, 1)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
    />
  );
}
