export function getNearestBlocks() {
  let radius = 1;
  let blockReturnList = [];
  for (let x = -radius; x <= radius; x++) {
    for (let y = -1; y <= 2; y++) {
      for (let z = -radius; z <= radius; z++) {
        let block = World.getBlockAt(
          Player.getX() + x,
          Player.getY() + y,
          Player.getZ() + z
        );

        if (block.toString().includes("stained_glass")) {
          blockReturnList.push(block);
        }
      }
    }
  }

  return blockReturnList;
}

export function checkBlocksAround() {
  returnBlocks = getNearestBlocks();

  if (returnBlocks.length == 0) {
    return false;
  } else {
    return true;
  }
}
