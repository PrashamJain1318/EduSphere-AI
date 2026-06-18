import React, { useRef, useEffect } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse parallax offsets
    let mouse = { rx: 0, ry: 0, targetRx: 0, targetRy: 0 };
    const handleMouseMove = (e) => {
      mouse.targetRx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouse.targetRy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Generate floating icons/shapes
    const shapes = [];
    const colors = ['rgba(59, 130, 246, 0.08)', 'rgba(99, 102, 241, 0.07)', 'rgba(236, 72, 153, 0.07)', 'rgba(168, 85, 247, 0.06)'];

    for (let i = 0; i < 24; i++) {
      shapes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 30 + Math.random() * 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        type: ['atom', 'dna', 'square', 'circle', 'book'][Math.floor(Math.random() * 5)],
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
      });
    }

    // Render loop
    const render = () => {
      // Smooth interpolation for mouse parallax
      mouse.rx += (mouse.targetRx - mouse.rx) * 0.08;
      mouse.ry += (mouse.targetRy - mouse.ry) * 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains('dark');

      shapes.forEach((shape) => {
        // Apply regular drift + parallax offset
        let renderX = shape.x + mouse.rx * 40;
        let renderY = shape.y + mouse.ry * 40;

        // Wrap around boundaries
        shape.x += shape.speedX;
        shape.y += shape.speedY;

        if (shape.x < -100) shape.x = canvas.width + 100;
        if (shape.x > canvas.width + 100) shape.x = -100;
        if (shape.y < -100) shape.y = canvas.height + 100;
        if (shape.y > canvas.height + 100) shape.y = -100;

        shape.angle += shape.rotationSpeed;

        ctx.strokeStyle = shape.color;
        ctx.fillStyle = shape.color;
        ctx.lineWidth = 1.5;

        ctx.save();
        ctx.translate(renderX, renderY);
        ctx.rotate(shape.angle);

        // 1. Draw Atom
        if (shape.type === 'atom') {
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw electron orbits
          ctx.beginPath();
          ctx.ellipse(0, 0, shape.size / 2, shape.size / 6, Math.PI / 4, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, shape.size / 2, shape.size / 6, -Math.PI / 4, 0, Math.PI * 2);
          ctx.stroke();
        } 
        // 2. Draw DNA helix
        else if (shape.type === 'dna') {
          ctx.beginPath();
          for (let x = -shape.size / 2; x <= shape.size / 2; x += 4) {
            const y1 = Math.sin(x * 0.15) * 8;
            ctx.arc(x, y1, 1.5, 0, Math.PI * 2);
            ctx.fill();

            const y2 = -Math.sin(x * 0.15) * 8;
            ctx.arc(x, y2, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // vertical bond lines
            if (x % 12 === 0) {
              ctx.beginPath();
              ctx.moveTo(x, y1);
              ctx.lineTo(x, y2);
              ctx.stroke();
            }
          }
        } 
        // 3. Draw Book outline
        else if (shape.type === 'book') {
          ctx.beginPath();
          ctx.rect(-shape.size / 3, -shape.size / 4, shape.size / 1.5, shape.size / 2);
          ctx.stroke();
          // central line pages
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 4);
          ctx.lineTo(0, shape.size / 4);
          ctx.stroke();
        } 
        // 4. Draw Geometry Box shapes
        else if (shape.type === 'square') {
          ctx.strokeRect(-shape.size / 3, -shape.size / 3, shape.size / 1.5, shape.size / 1.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-20 block" />;
};

export default AnimatedBackground;
