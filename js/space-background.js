// A single viewport-sized field persists behind every content section.
export function createSpaceBackground() {
  const canvas = document.querySelector('#starfield');
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) return { resize() {}, render() {}, setMotion() {} };
  let width = 1, height = 1;
  let seed = 314159;
  const random = () => {
    seed = (Math.imul(1664525, seed) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
  const stars = Array.from({ length: 220 }, () => ({
    x: random(), y: random(), speed: 0.001 + random() * 0.002,
    size: random() > 0.96 ? 2 : 1,
    color: ['#263449', '#334356', '#47566b', '#738099'][Math.floor(random() * 4)],
  }));
  function resize() {
    width = Math.max(1, Math.round(innerWidth / 2));
    height = Math.max(1, Math.round(innerHeight / 2));
    canvas.width = width;
    canvas.height = height;
  }
  function planet(x, y, radius, color) {
    context.fillStyle = color;
    for (let py = -radius; py <= radius; py++) {
      for (let px = -radius; px <= radius; px++) {
        if (px * px + py * py > radius * radius) continue;
        if ((px + py) % 3 === 0) continue;
        context.fillRect(Math.round(x + px), Math.round(y + py), 1, 1);
      }
    }
  }
  function render(time) {
    context.fillStyle = '#05070b';
    context.fillRect(0, 0, width, height);
    for (const star of stars) {
      context.fillStyle = star.color;
      context.fillRect(Math.round(star.x * width), Math.round(((star.y + time * star.speed) % 1) * height), star.size, 1);
    }
    // Distant pixel matter stays subdued so foreground text remains readable.
    planet(width * 0.04, height * 0.65, Math.min(18, width * 0.055), '#152235');
    planet(width * 0.95, height * 0.27, Math.min(12, width * 0.035), '#28212b');
  }
  resize();
  render(0);
  return {
    resize,
    render,
    setMotion(state) { canvas.dataset.motion = state; },
  };
}
