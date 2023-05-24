import { getDistance } from "./getDistance";
import { intersection } from "./rayAABB";

export function getCollisionBlock(x1, y1, z1, x2, y2, z2, maxDist) {
  let destBlock = World.getBlockAt(x2, y2, z2);

  let dx = x2 - x1;
  let dy = y2 - y1;
  let dz = z2 - z1;

  let length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  let stepX = dx / length;
  let stepY = dy / length;
  let stepZ = dz / length;

  let xCur = x1;
  let yCur = y1;
  let zCur = z1;

  let collidingBlocks = [];
  for (let i = 0; i < maxDist + 1; i++) {
    for (let sx = -1; sx <= 1; sx++) {
      for (let sy = -1; sy <= 1; sy++) {
        for (let sz = -1; sz <= 1; sz++) {
          if (sx * stepX + sy * stepY + sz * stepZ < 0) {
            continue;
          }

          let x = xCur + sx;
          let y = yCur + sy;
          let z = zCur + sz;

          let block = World.getBlockAt(x, y, z);

          if (block.type.getRegistryName() == "minecraft:air") {
            continue;
          }

          let ro = [x1, y1, z1];
          let rd = [stepX, stepY, stepZ];
          let aabb = [
            [block.getX(), block.getY(), block.getZ()],
            [block.getX() + 1, block.getY() + 1, block.getZ() + 1],
          ];
          let output = intersection([], ro, rd, aabb);
          if (!output) {
            continue;
          }

          if (
            getDistance(ro, [
              block.getX() + 0.5,
              block.getY() + 0.5,
              block.getZ() + 0.5,
            ]) > maxDist
          ) {
            continue;
          }

          collidingBlocks.push({ block, output });
        }
      }
    }

    xCur += stepX;
    yCur += stepY;
    zCur += stepZ;
  }

  collidingBlocks.sort((a, b) => {
    return getDistance([x1, y1, z1], a.output) <
      getDistance([x1, y1, z1], b.output)
      ? -1
      : 1;
  });

  return collidingBlocks.length > 0 ? collidingBlocks[0] : null;
}
