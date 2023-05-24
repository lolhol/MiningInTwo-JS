export function getCylinderBaseVec(a, b, degree, radius) {
  let [x1, y1, z1] = a;
  let [x2, y2, z2] = b;

  let dx = x2 - x1;
  let dy = y2 - y1;
  let dz = z2 - z1;

  if (Math.abs(dz) < 0.000001) {
    dz = 0.000001;
  }

  let planeCoef = x1 * dx + y1 * dy + z1 * dz;

  let xN = 0;
  let yN = 0;
  let zN = planeCoef / dz;
  let dxN = xN - x1;
  let dyN = yN - y1;
  let dzN = zN - z1;
  let lenN = Math.sqrt(dxN * dxN + dyN * dyN + dzN * dzN);
  dxN = dxN / lenN;
  dyN = dyN / lenN;
  dzN = dzN / lenN;

  let dxM = dy * dzN - dz * dyN;
  let dyM = dz * dxN - dx * dzN;
  let dzM = dx * dyN - dy * dxN;
  let cLen = Math.sqrt(dxM * dxM + dyM * dyM + dzM * dzM);
  dxM = dxM / cLen;
  dyM = dyM / cLen;
  dzM = dzM / cLen;

  let angle = degree * (Math.PI / 180);
  let dxP = dxN * Math.cos(angle) + dxM * Math.sin(angle);
  let dyP = dyN * Math.cos(angle) + dyM * Math.sin(angle);
  let dzP = dzN * Math.cos(angle) + dzM * Math.sin(angle);

  return [dxP * radius, dyP * radius, dzP * radius];
}
