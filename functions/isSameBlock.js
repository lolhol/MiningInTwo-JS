export function isSameBlock(a, b) {
  return a.getX() == b.getX() && a.getY() == b.getY() && a.getZ() == b.getZ();
}
