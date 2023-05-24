/** @format */

import { getBlockCoords } from "../functions/Blocks/blockCoords";
import { getPlayerSightCollisionBlock } from "../functions/MathUtils/adjustLook";
import {
  changeOfflineState,
  getOfflineState,
  getState,
  setState,
} from "../functions/Other/state";
import { distanceToPlayerHead } from "../functions/MathUtils/distanceToPlayerHead";
import { getClosestBlockFromList } from "../functions/Blocks/getClosestBlockFromList";
import Settings from "../data/config/config";
import { throwRod } from "../functions/Items/throwRod";
import { lookAtSlowly } from "../functions/Looks/lookAtSlowly";
import { clickAOTV } from "../functions/Items/clickAOTV";

const MC = Client.getMinecraft();
const RIGHTCLICK = MC.getClass().getDeclaredMethod("func_147121_ag");
const SHIFT = new KeyBind(MC.field_71474_y.field_74311_E);

let nullStateTickAmount = 0;

register("Tick", () => {
  if (getOfflineState() == "online") {
    if (getState() == null) {
      nullStateTickAmount++;
    } else {
      nullStateTickAmount = 0;
    }

    if (nullStateTickAmount >= 400) {
      throwRod();
      initiateReStartMacro();
      nullStateTickAmount = 0;

      changeOfflineState("offline");
    }
  }
});

export function initiateReStartMacro() {
  new Thread(() => {
    let rDataCoords;

    if (Settings.macroSpot == 1)
      rDataCoords = getBlockCoords().rDataCoords.custom;
    else rDataCoords = getBlockCoords().rDataCoords.default;

    let checkBlocks = [];

    for (let i = 0; i < rDataCoords.length - 1; i++) {
      let distToHead = distanceToPlayerHead(
        rDataCoords[i].x,
        rDataCoords[i].y,
        rDataCoords[i].z
      );

      //ChatLib.chat(distToHead);

      if (distToHead < 61) {
        let block = getPlayerSightCollisionBlock(
          World.getBlockAt(rDataCoords[i].x, rDataCoords[i].y, rDataCoords[i].z)
        );

        if (block) {
          checkBlocks.push(rDataCoords[i]);
        }
      }

      if (checkBlocks.length >= 2) {
        break;
      }
    }

    if (checkBlocks.length > 0) {
      SHIFT.setState(false);
      Thread.sleep(10);
      SHIFT.setState(true);

      let blockUnder = World.getBlockAt(
        Player.getX(),
        Player.getY() - 1,
        Player.getZ()
      );

      lookAtSlowly(
        blockUnder.getX(),
        blockUnder.getY(),
        blockUnder.getZ(),
        300
      );

      Thread.sleep(700);

      clickAOTV();

      let closestBlock = getClosestBlockFromList(checkBlocks);

      throwRod();

      //teleportToBlock(closestBlock, 500, 400);
      Thread.sleep(1000);

      lookAtSlowly(closestBlock.x, closestBlock.y, closestBlock.z, 500);

      //ChatLib.chat("HI s");

      Thread.sleep(Math.floor(500 * 2.5));

      clickAOTV();
      SHIFT.setState(false);

      Thread.sleep(10000);

      changeOfflineState("online");
      setState("armadillo");
    } else {
      changeOfflineState("offline");
    }
  }).start();
}
