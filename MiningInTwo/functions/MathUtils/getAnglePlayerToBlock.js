import { radiansToDegree } from "./radiansToDegree";

export function getAnglePlayerToBlock(block) {
  let sideX = block.getX() + 0.5 - Player.getX();
  let sideZ = block.getZ() + 0.5 - Player.getZ();

  if (sideX == 0) {
    return null;
  }

  let tan = sideZ / sideX;
  let anglePlayerToBlock = radiansToDegree(Math.atan(tan));
  if (sideX < 0) {
    anglePlayerToBlock += 180;
  }

  return anglePlayerToBlock;
}
