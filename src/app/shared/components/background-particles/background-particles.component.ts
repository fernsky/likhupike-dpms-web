import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-background-particles',
  template: `<canvas #canvas></canvas>`,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        z-index: 0;
      }
      canvas {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  standalone: true,
})
export class BackgroundParticlesComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 50;

    // Set canvas size
    const resize = () => {
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        if (particle.y > window.innerHeight) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
}
