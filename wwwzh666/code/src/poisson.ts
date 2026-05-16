export interface Point2D {
  x: number;
  y: number;
}

export function poissonDiskSample(width: number, height: number, radius: number, limit: number): Point2D[] {
  const cellSize = radius / Math.SQRT2;
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const grid = new Array<number>(gridWidth * gridHeight).fill(-1);
  const points: Point2D[] = [];
  const active: Point2D[] = [];
  const tries = 28;

  const insert = (point: Point2D) => {
    points.push(point);
    active.push(point);
    grid[Math.floor(point.x / cellSize) + Math.floor(point.y / cellSize) * gridWidth] = points.length - 1;
  };

  const isValid = (point: Point2D) => {
    if (point.x < 0 || point.x >= width || point.y < 0 || point.y >= height) return false;
    const gx = Math.floor(point.x / cellSize);
    const gy = Math.floor(point.y / cellSize);
    for (let y = Math.max(0, gy - 2); y <= Math.min(gridHeight - 1, gy + 2); y += 1) {
      for (let x = Math.max(0, gx - 2); x <= Math.min(gridWidth - 1, gx + 2); x += 1) {
        const index = grid[x + y * gridWidth];
        if (index === -1) continue;
        const other = points[index];
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        if (dx * dx + dy * dy < radius * radius) return false;
      }
    }
    return true;
  };

  insert({ x: width * 0.5, y: height * 0.5 });

  while (active.length > 0 && points.length < limit) {
    const activeIndex = Math.floor(Math.random() * active.length);
    const base = active[activeIndex];
    let found = false;

    for (let attempt = 0; attempt < tries; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * (1 + Math.random());
      const point = {
        x: base.x + Math.cos(angle) * distance,
        y: base.y + Math.sin(angle) * distance,
      };
      if (isValid(point)) {
        insert(point);
        found = true;
        break;
      }
    }

    if (!found) active.splice(activeIndex, 1);
  }

  return points;
}
