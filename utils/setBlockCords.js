/** @format */

import { getState, setState } from "../functions/state";

let setBlockMap = new Map();
let blockNumber = 0;

export function blockList(states) {
  if (getState() == "getBlock") {
    setBlockMap.set(
      blockNumber,
      World.getBlockAt(Player.getX(), Player.getY() - 1, Player.getZ())
    );

    blockNumber++;
  }

  if (states == "Tp") {
    return setBlockMap;
  }

  if (states == "pos") {
    for (let j = 0; j < setBlockMap.size; j++) {
      if (Math.abs(setBlockMap.get(j).getX()) - Player.getX() < 0.001) {
        if (Math.abs(setBlockMap.get(j).getZ()) - Player.getZ() < 0.001) {
          return j;
        }
      }
    }
  }

  if (setBlockMap) {
    if (states == "clear") {
      setBlockMap.clear();
      blockNumber = 0;
    }
  }

  if (states == "blockNumber") {
    return blockNumber;
  }
}
