import { state } from './state';

export function initAgentCanvas(): void {
  const canvas = document.getElementById('agent-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function drawAgents(): void {
    if (!ctx || !canvas) return;

    const isDark = state.theme === 'dark';
    const bgColor = isDark ? '#1e3a5f' : '#f0f4f8';
    const gridColor = isDark ? '#243b53' : '#d9e2ec';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Connections
    ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.2)';
    ctx.lineWidth = 0.5;
    state.agents.forEach((agent, i) => {
      state.agents.slice(i + 1).forEach(other => {
        const dx = agent.x - other.x;
        const dy = agent.y - other.y;
        if (Math.sqrt(dx * dx + dy * dy) < 50) {
          ctx.beginPath();
          ctx.moveTo(agent.x, agent.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });
    });

    // Agents
    const colors: Record<string, { fill: string; stroke: string }> = {
      household: { fill: '#fbbf24', stroke: '#f59e0b' },
      firm: { fill: '#22c55e', stroke: '#16a34a' },
      bank: { fill: '#3b82f6', stroke: '#2563eb' }
    };
    const radiusMap: Record<string, number> = { rational: 4, adaptive: 5, herding: 6 };

    state.agents.forEach(agent => {
      const color = colors[agent.type];
      const radius = radiusMap[agent.behavior];

      if (agent.behavior === 'herding') {
        const gradient = ctx.createRadialGradient(agent.x, agent.y, radius, agent.x, agent.y, radius * 3);
        gradient.addColorStop(0, color.fill + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = color.fill;
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  function animate(): void {
    if (state.isSimulating && canvas) {
      state.agents = state.agents.map(agent => {
        let { x, y, vx, vy } = agent;
        x += vx;
        y += vy;
        if (x <= 20 || x >= canvas.width - 20) vx *= -1;
        if (y <= 20 || y >= canvas.height - 20) vy *= -1;
        return { ...agent, x, y, vx, vy };
      });
    }
    drawAgents();
    state.animationFrame = requestAnimationFrame(animate);
  }

  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
  }
  animate();
}
