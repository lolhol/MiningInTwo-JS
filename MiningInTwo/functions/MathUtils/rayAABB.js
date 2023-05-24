export function intersection(out, ro, rd, aabb) {
  let d = distance(ro, rd, aabb);

  if (d === Infinity) {
    out = null;
  } else {
    out = out || [];

    for (let i = 0; i < ro.length; i++) {
      out[i] = ro[i] + rd[i] * d;
    }
  }

  return out;
}

export function distance(ro, rd, aabb) {
  let dims = ro.length;
  let lo = -Infinity;
  let hi = +Infinity;

  for (let i = 0; i < dims; i++) {
    let dimLo = (aabb[0][i] - ro[i]) / rd[i];
    let dimHi = (aabb[1][i] - ro[i]) / rd[i];

    if (dimLo > dimHi) {
      let tmp = dimLo;
      dimLo = dimHi;
      dimHi = tmp;
    }

    if (dimHi < lo || dimLo > hi) {
      return Infinity;
    }

    if (dimLo > lo) lo = dimLo;
    if (dimHi < hi) hi = dimHi;
  }

  return lo > hi ? Infinity : lo;
}
