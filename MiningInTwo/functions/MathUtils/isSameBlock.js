export function isSameBlock(a, b) {
  return (
    Math.abs(a.getX() - b.getX()) < 0.0001 &&
    Math.abs(a.getY() - b.getY()) < 0.0001 &&
    Math.abs(a.getZ() - b.getZ()) < 0.0001
  );
}
