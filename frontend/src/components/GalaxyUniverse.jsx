import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Orbit } from 'lucide-react';

const GalaxyUniverse = ({ subjects }) => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [hoveredPlanet, setHoveredPlanet] = useState(null);

  // Define planet colors and relative sizes
  const planetColors = {
    'Mathematics': '#3b82f6', // blue
    'Physics': '#a855f7', // purple
    'Chemistry': '#ec4899', // pink
    'Biology': '#10b981', // green
    'Science': '#14b8a6', // teal
    'History': '#f59e0b', // amber
    'Civics': '#ef4444', // red
    'Civics (Political Science)': '#ef4444', // red
    'Geography': '#06b6d4', // cyan
    'Economics': '#10b981', // emerald
    'English': '#f43f5e', // rose
    'Hindi A': '#e11d48',
    'Hindi B': '#f43f5e',
    'Sanskrit': '#8b5cf6',
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 420;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse positions
    let mouse = { x: canvas.width / 2, y: canvas.height / 2, rx: 0, ry: 0 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      // Normalised mouse offsets (-1 to 1) for 3D tilts
      mouse.rx = (mouse.x - canvas.width / 2) / (canvas.width / 2);
      mouse.ry = (mouse.y - canvas.height / 2) / (canvas.height / 2);
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Generate stars
    const stars = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        alpha: Math.random(),
      });
    }

    // Map subjects into planetary states
    const planets = subjects.map((sub, index) => {
      const angle = (index * (Math.PI * 2)) / subjects.length;
      const orbitX = 160 + index * 30; // Radius x
      const orbitY = 70 + index * 12; // Radius y (tilted orbit)
      return {
        id: sub._id,
        name: sub.name,
        color: planetColors[sub.name] || '#6366f1',
        angle,
        speed: 0.003 + (subjects.length - index) * 0.0008,
        radius: 12 + Math.random() * 4,
        orbitX,
        orbitY,
        x: 0,
        y: 0,
        satellites: ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4'].slice(0, 2 + (index % 3)),
      };
    });

    const handleCanvasClick = () => {
      if (hoveredPlanet) {
        navigate(`/subjects/${hoveredPlanet.id}`);
      }
    };
    canvas.addEventListener('click', handleCanvasClick);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 1. Draw Nebula Background Glow
      const nebulaGlow = ctx.createRadialGradient(
        centerX + mouse.rx * 50,
        centerY + mouse.ry * 30,
        50,
        centerX,
        centerY,
        300
      );
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        nebulaGlow.addColorStop(0, 'rgba(30, 27, 75, 0.4)'); // Indigo tint
        nebulaGlow.addColorStop(0.5, 'rgba(15, 23, 42, 0.2)');
        nebulaGlow.addColorStop(1, 'transparent');
      } else {
        nebulaGlow.addColorStop(0, 'rgba(219, 234, 254, 0.4)'); // Light blue tint
        nebulaGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        nebulaGlow.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = nebulaGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Twinkling Stars
      ctx.fillStyle = isDark ? '#ffffff' : '#475569';
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0) star.twinkleSpeed = -star.twinkleSpeed;
        ctx.globalAlpha = Math.max(0.1, star.alpha);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 3. Draw Solar System Sun
      const sunGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        28
      );
      sunGlow.addColorStop(0, '#f59e0b');
      sunGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.3)');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
      ctx.fill();

      // 4. Draw Orbit paths and Planets
      let currentHover = null;

      planets.forEach((planet) => {
        planet.angle += planet.speed; // Increment angle

        // Calculate 3D coordinate orbits with mouse offsets
        const px = centerX + Math.cos(planet.angle) * planet.orbitX + mouse.rx * 20;
        const py = centerY + Math.sin(planet.angle) * planet.orbitY + mouse.ry * 15;

        planet.x = px;
        planet.y = py;

        // Draw Orbit Ring line
        ctx.beginPath();
        ctx.ellipse(centerX + mouse.rx * 20, centerY + mouse.ry * 15, planet.orbitX, planet.orbitY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Check if mouse is hovering planet
        const dist = Math.sqrt((mouse.x - px) ** 2 + (mouse.y - py) ** 2);
        const isMouseOver = dist < planet.radius + 6;

        if (isMouseOver) {
          currentHover = planet;
        }

        // Draw Orbiting Moons (Satellites)
        planet.satellites.forEach((sat, satIdx) => {
          const satAngle = planet.angle * 2.5 + (satIdx * Math.PI) / 2;
          const sx = px + Math.cos(satAngle) * 20;
          const sy = py + Math.sin(satAngle) * 8;
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.3)';
          ctx.fill();
        });

        // Draw Planet Body
        const planetGlow = ctx.createRadialGradient(px, py, 1, px, py, planet.radius);
        planetGlow.addColorStop(0, '#ffffff');
        planetGlow.addColorStop(0.3, planet.color);
        planetGlow.addColorStop(1, 'rgba(0,0,0,0.8)');

        ctx.beginPath();
        ctx.arc(px, py, planet.radius + (isMouseOver ? 3 : 0), 0, Math.PI * 2);
        ctx.fillStyle = planetGlow;
        ctx.shadowColor = planet.color;
        ctx.shadowBlur = isMouseOver ? 20 : 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow

        // Label Tag
        ctx.font = 'bold 9px Inter';
        ctx.fillStyle = isDark ? '#e2e8f0' : '#334155';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, px, py - planet.radius - 8);
      });

      setHoveredPlanet(currentHover);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [subjects, hoveredPlanet]);

  return (
    <div className="glass-card rounded-3xl border border-white/20 dark:border-slate-800/40 relative overflow-hidden shadow-xl bg-slate-900/5 h-[420px]">
      {/* Title Tag */}
      <div className="absolute top-6 left-6 z-10 space-y-1">
        <div className="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <Orbit className="h-3 w-3 animate-spin" />
          <span>Interactive Galaxy Universe</span>
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Click planets to enter subjects</h2>
      </div>

      {/* Galaxy Canvas */}
      <canvas ref={canvasRef} className="block w-full cursor-crosshair" />

      {/* Floating Tooltip details */}
      {hoveredPlanet && (
        <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 bg-slate-950/90 text-white p-4 rounded-2xl border border-blue-500/30 backdrop-blur-md shadow-2xl z-20 w-auto max-w-xs animate-float">
          <div className="flex items-center space-x-2">
            <span
              className="h-3.5 w-3.5 rounded-full inline-block"
              style={{ backgroundColor: hoveredPlanet.color, boxShadow: `0 0 10px ${hoveredPlanet.color}` }}
            />
            <h4 className="font-extrabold text-sm">{hoveredPlanet.name} Planet</h4>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Moons (Chapters): <strong>{hoveredPlanet.satellites.length * 2} active topics</strong>. Click planet to explore materials.
          </p>
        </div>
      )}
    </div>
  );
};

export default GalaxyUniverse;
