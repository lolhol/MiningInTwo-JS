import { getCollisionBlock } from "./blocksOnLine";
import { getCylinderBaseVec } from "./getCylinderBaseVec";
import { getDistance as getDistance } from "./getDistance";
import { getHeadY } from "./getHeadY";
import { isSameBlock } from "./isSameBlock";

export function adjustLook(destBlock) {
  let playerHeight = getHeadY();
  //renderToolPoint(Player.getX(), Player.getY() + playerHeight, Player.getZ());

  let destBlockCenter = [
    destBlock.getX() + 0.5,
    destBlock.getY() + 0.5,
    destBlock.getZ() + 0.5,
  ];

  let distToBlockCenter = getDistance(
    [Player.getX(), Player.getY() + playerHeight, Player.getZ()],
    [destBlockCenter[0], destBlockCenter[1], destBlockCenter[2]]
  );

  let collision = getCollisionBlock(
    Player.getX(),
    Player.getY() + playerHeight,
    Player.getZ(),
    destBlockCenter[0],
    destBlockCenter[1],
    destBlockCenter[2],
    distToBlockCenter
  );

  if (!collision) {
    return null;
  }

  let radiusStep = 0.1;
  let radiusMax = Math.sqrt(3) / 2 + radiusStep;

  for (let radius = radiusStep; radius < radiusMax; radius += radiusStep) {
    let angleStep = (radiusMax / radius) * 5;
    for (let angle = 0; angle < 360 + angleStep; angle += angleStep) {
      let vec = getCylinderBaseVec(
        [Player.getX(), Player.getY() + playerHeight, Player.getZ()],
        destBlockCenter,
        angle,
        radius
      );

      let point = [
        destBlockCenter[0] + vec[0],
        destBlockCenter[1] + vec[1],
        destBlockCenter[2] + vec[2],
      ];

      let collisionPoint = getCollisionBlock(
        Player.getX(),
        Player.getY() + playerHeight,
        Player.getZ(),
        point[0],
        point[1],
        point[2],
        distToBlockCenter + Math.sqrt(3) / 2
      );

      if (isSameBlock(collisionPoint.block, destBlock)) {
        return point;
      }

      //addPoint(point[0], point[1], point[2]);
    }
  }

  return null;
}
