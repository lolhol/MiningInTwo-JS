/** @format */

export function getCloseBlock(blocksList) {
  for (let i = 0; i < blocksList.length; i++) {
    if (distanceToPlayerHead(blocksList.x, blocksList.y, blocksList.z) < 3) {
      return i;
    }
  }
}
