/** @format */

import { addBlockRoute, getBlockCoords } from "./blockCoords";
import Settings from "../../data/config/config";

let state = null;

export function checkBlock(posState) {
  let i;

  if (posState == "getBlock") {
    let blockCoords;
    if (Settings.macroSpot == 1)
      blockCoords = getBlockCoords().rDataCoords.custom;
    else blockCoords = getBlockCoords().rDataCoords.default;

    if (blockCoords.length > 0) {
      for (i = 0; i < blockCoords.length; i++) {
        if (
          Math.abs(blockCoords[i].z - Player.getZ()) < 0.0001 &&
          Math.abs(blockCoords[i].x - Player.getX()) < 0.0001
        ) {
          state = "startMacro";
          return state;
        }
      }
    } else {
      state = null;
      return state;
    }
  }
}
