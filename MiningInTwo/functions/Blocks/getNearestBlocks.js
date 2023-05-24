/** @format */

import { setState } from "../Other/state";
import Settings from "../../data/config/config";
import { getBlockCoords, getCurrentBlockList } from "./blockCoords";
import { getDistance } from "../MathUtils/getDistance";
import { distance } from "../MathUtils/rayAABB";

let bypass = false;

export function getNearestBlocks() {
  let radius = 1;
  let blockReturnList = [];
  for (let x = -radius; x <= radius; x++) {
    for (let y = -4; y <= 2; y++) {
      for (let z = -radius; z <= radius; z++) {
        let block = World.getBlockAt(
          Player.getX() + x,
          Player.getY() + y,
          Player.getZ() + z
        );

        if (block.toString().includes("stained_glass")) {
          if (!Settings.ignorePane || bypass == true) {
            blockReturnList.push(block);
          } else {
            if (!block.toString().includes("stained_glass_pane"))
              blockReturnList.push(block);
          }
        }
      }
    }
  }

  return blockReturnList;
}

export function getBlockUnder() {
  let radius = 1;

  for (let x = -radius; x <= radius; x++) {
    for (let y = -7; y <= 0; y++) {
      for (let z = -radius; z <= radius; z++) {
        let cobbleBlock = World.getBlockAt(
          Player.getX() + x,
          Player.getY() + y,
          Player.getZ() + z
        );

        if (cobbleBlock.toString().includes("cobblestone")) {
          return cobbleBlock;
        }
      }
    }
  }
}

export function sendYofBlock(y) {
  return y;
}

export function bypassState(bypassState) {
  bypass = bypassState;
}

export function mainBlockChecks() {
  let checks = false;
  let block;
  let radius = 0;
  let blockReturnList = getNearestBlocks();
  let blockMax = [];
  let turnBlockList = [];

  if (Settings.topToBottom) {
    blockReturnList = blockReturnList.sort((a, b) => {
      return b.getY() < a.getY() ? -1 : b.getY() > a.getY() ? 1 : 0;
    });
  }

  let underBlock = World.getBlockAt(
    Player.getX(),
    Player.getY() - 1,
    Player.getZ()
  );

  let blockCoords;
  let nextBlockList = 0;

  if (Settings.macroSpot == 1)
    blockCoords = getBlockCoords().rDataCoords.custom;
  else blockCoords = getBlockCoords().rDataCoords.default;

  if (nextBlockList > blockCoords.length - 1) {
    nextBlockList = 0;
  } else {
    nextBlockList += 1;
  }

  let nextBlock = blockCoords[nextBlockList];

  blockReturnList.sort((a, b) => {
    return getDistance(
      [a.getX(), a.getY(), a.getZ()],
      [nextBlock.x, nextBlock.y, nextBlock.z]
    ) >
      getDistance(
        [b.getX(), b.getY(), b.getZ()],
        [nextBlock.x, nextBlock.y, nextBlock.z]
      )
      ? 1
      : -1;
  });

  if (blockReturnList.length != 0) {
    for (let x = -radius; x <= radius; x++) {
      for (let y = -2; y <= 0; y++) {
        for (let z = -radius; z <= radius; z++) {
          let cobbleBlock = World.getBlockAt(
            Player.getX() + x,
            Player.getY() + y,
            Player.getZ() + z
          );

          if (cobbleBlock.toString().includes("cobblestone")) {
            checks = true;
          }
        }
      }
    }

    for (let i = 0; i < blockReturnList.length; i++) {
      if (
        Math.abs(blockReturnList[i].getX() - Player.getX()) < 0.0001 &&
        Math.abs(blockReturnList[i].getZ() - Player.getZ())
      ) {
        if (blockReturnList.length > 1) {
          blockReturnList.splice(i, 1);
          i--;
        } else {
          setState(null);
        }
      }
    }

    if (checks == true) {
      for (let k = 0; k < blockReturnList.length; k++) {
        if (blockReturnList[k].getY() + 2 <= Player.getY()) {
          //ChatLib.chat(blockReturnList[k].getY() + 1.3 + " " + Player.getY());
          blockReturnList.splice(k, 1);
          k--;
        }
      }

      if (blockReturnList.length != 0) {
        block = blockReturnList.shift();
      } else {
        setState(null);
      }
    } else {
      if (Settings.blockReturnList != true) {
        if (blockReturnList.length != 0) {
          block = blockReturnList.shift();
        }
      } else {
        for (let i = 0; i < blockReturnList.length; i++) {
          blockMax.push(blockReturnList[i].getY());
        }

        block = blockMax.max();
        blockMax.splice(block);
      }
    }
    //ChatLib.chat(block.getY());
    if (block) {
      return block;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
