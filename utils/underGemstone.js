import { getBlockCoords, reWriteLocalData } from "./blockCoords";

let routeNukerLineFilePath =
  "./config/ChatTriggers/modules/MiningInTwo/data/cobbleCoords.json";

export function writeCobbleCoords() {
  let block = getCobbleBlockCoords();

  if (block) {
    let cobbleBlocks = getBlockCoords().cobbleBlocks;

    cobbleBlocks.custom.xpos1.push(block.getX() + 0.5);
    cobbleBlocks.custom.ypos1.push(block.getY());
    cobbleBlocks.custom.zpos1.push(block.getZ() + 0.5);

    reWriteLocalData(cobbleBlocks, "cobble");

    return true;
  } else {
    return false;
  }
}

export function getCobbleBlockCoords() {
  let radius = 0;
  for (let x = -radius; x <= radius; x++) {
    for (let y = -12; y <= 0; y++) {
      for (let z = -radius; z <= radius; z++) {
        let block = World.getBlockAt(
          Player.getX() + x,
          Player.getY() + y,
          Player.getZ() + z
        );

        if (block.toString().includes("cobblestone")) {
          return block;
        }
      }
    }
  }
}

export function checkIfCobbleUnder() {
  let block = getCobbleBlockCoords();

  if (block) {
    return true;
  } else {
    return false;
  }
}
