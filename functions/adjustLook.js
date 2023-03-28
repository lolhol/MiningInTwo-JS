import {
  addLine,
  addPoint,
  renderToolBlock,
  renderToolLine,
  renderToolPoint,
  addBlock,
} from "../debug_testing_dont_mind/debug";
import { getCollisionBlock } from "./blocksOnLine";
import { getDist } from "./getDist";
import { getHeadY } from "./getHeadY";
import { isSameBlock } from "./isSameBlock";
import { lookAtSlowly } from "./lookAtSlowly";
import { intersection } from "./rayAABB";

export function adjustLook(destBlock) {
  let playerHeight = getHeadY();

  let destBlockCenter = [
    destBlock.getX() + 0.5,
    destBlock.getY() + 0.5,
    destBlock.getZ() + 0.5,
  ];

  let playerDestBlockCenter = getDist(
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
    playerDestBlockCenter
  );

  if (!collision) {
    return null;
  }

  if (
    Math.abs(collision.block.getX() - destBlock.getX()) < 0.0001 &&
    Math.abs(collision.block.getZ() - destBlock.getZ()) < 0.0001 &&
    Math.abs(collision.block.getY() - destBlock.getY()) < 0.0001
  ) {
    return destBlockCenter;
  }

  for (let i = 0; i < 3; i++) {
    for (let d = 0; d < 2; d++) {
      let point = [
        collision.output[0],
        collision.output[1],
        collision.output[2],
      ];
      point[i] = Math.floor(collision.output[i] + d) + (d == 0 ? -0.05 : 0.05);

      //addPoint(point[0], point[1], point[2]);
      //renderToolPoint(point[0], point[1], point[2]);

      let collisionPoint = getCollisionBlock(
        Player.getX(),
        Player.getY() + playerHeight,
        Player.getZ(),
        point[0],
        point[1],
        point[2],
        playerDestBlockCenter
      );

      if (isSameBlock(collisionPoint.block, destBlock)) {
        return point;
      }
    }
  }
}
