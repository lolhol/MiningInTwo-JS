export function getDistance(a, b) {
  let d = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  return Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
}
