import { getCobbleBlockCoords } from "./underGemstone";
import { getBlockData, getBlockCoords, reWriteLocalData } from "./blockCoords";
import Settings from "../data/config/config";

export function replaceBlockCoord(positionInList) {
  let { rAssist } = getBlockCoords();

  if (
    rAssist.custom.xpos1.length > 1 &&
    rAssist.custom.xpos1.length - 1 >= positionInList &&
    Settings.macroSpot == 1
  ) {
    getBlockData(positionInList);
    replaceCobbleBlock(positionInList);
    getBlockAssist(positionInList);

    return true;
  } else {
    return null;
  }
}

function getBlockAssist(posInList) {
  let { rAssist } = getBlockCoords();

  let block = World.getBlockAt(Player.getX(), Player.getY() - 1, Player.getZ());
  let xpos = block.getX();
  let zpos = block.getZ();
  let ypos = block.getY();

  let xposfinal = xpos - (xpos % 1) + 0.5;
  let zposfinal = zpos - (zpos % 1) + 0.5;
  let yposhead = ypos - (ypos % 1) + 1.6;
  let yposblock = ypos - (ypos % 1) - 0.5;

  rAssist.custom.xpos1[posInList] = xposfinal;
  rAssist.custom.head1[posInList] = yposhead;
  rAssist.custom.block1[posInList] = yposblock;
  rAssist.custom.zpos1[posInList] = zposfinal;

  reWriteLocalData(rAssist, "rAssist");
}

function replaceCobbleBlock(blockListPos) {
  let { cobbleBlocks } = getBlockCoords();

  let block = getCobbleBlockCoords();

  cobbleBlocks.custom.xpos1[blockListPos] = block.getX() + 0.5;
  cobbleBlocks.custom.ypos1[blockListPos] = block.getY();
  cobbleBlocks.custom.zpos1[blockListPos] = block.getZ() + 0.5;

  reWriteLocalData(cobbleBlocks, "cobble");
}
