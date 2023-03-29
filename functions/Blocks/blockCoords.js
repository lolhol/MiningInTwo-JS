/** @format */

import Settings from "../../data/config/config";

const rDataFilePath =
  "./config/ChatTriggers/modules/MiningInTwo/data/routeData.json";
const cobleFilePath =
  "./config/ChatTriggers/modules/MiningInTwo/data/cobbleCoords.json";
const rAssistFilePath =
  "./config/ChatTriggers/modules/MiningInTwo/data/routeAssist.json";

let rDataCoords = JSON.parse(FileLib.read(rDataFilePath));
let cobbleBlocks = JSON.parse(FileLib.read(cobleFilePath));
let rAssist = JSON.parse(FileLib.read(rAssistFilePath));

export function getBlockCoords() {
  return { rDataCoords, cobbleBlocks, rAssist };
}

export function getBlockCoordsAtPlayer() {
  let blockCoords;

  if (Settings.macroSpot == 1)
    blockCoords = getBlockCoords().rDataCoords.custom;
  else blockCoords = getBlockCoords().rDataCoords.default;

  for (let j = 0; j < blockCoords.length; j++) {
    if (Math.abs(blockCoords[j].x - Player.getX()) < 0.00001) {
      if (Math.abs(blockCoords[j].z - Player.getZ()) < 0.001) {
        return j;
      }
    }
  }
}

export function addBlockRoute() {
  rDataCoords.custom.push({
    x: Player.getX(),
    y: Player.getY() - 1,
    z: Player.getZ(),
  });

  reWriteLocalData(rDataCoords, "rData");
}

export function addBlockDeffRoute() {
  let defaultCoords = rDataCoords.default;

  defaultCoords.push({
    x: Player.getX(),
    y: Player.getY() - 1,
    z: Player.getZ(),
  });

  let finalCoords = {
    default: defaultCoords,
    custom: rDataCoords.custom,
  };

  reWriteLocalData(finalCoords, "rData");
}

export function reWriteLocalData(data, type) {
  if (type == "rData") {
    rDataCoords = data;
    backUpToFile(data, rDataFilePath);
  } else if (type == "cobble") {
    cobbleBlocks = data;
    backUpToFile(data, cobleFilePath);
  } else if (type == "rAssist") {
    rAssist = data;
    backUpToFile(data, rAssistFilePath);
  }
}

export function clearDeffRoute() {
  rDataCoords = {
    default: [],
    custom: rDataCoords.custom,
  };

  backUpToFile(rDataCoords, rDataFilePath);
}

export function clearBlockCoords() {
  rDataCoords = {
    default: rDataCoords.default,
    custom: [],
  };

  cobbleBlocks = {
    default: cobbleBlocks.default,
    custom: { xpos1: [], ypos1: [], zpos1: [] },
  };

  rAssist = {
    default: rAssist.default,
    custom: { xpos1: [], head1: [], block1: [], zpos1: [] },
  };

  /*rAssist.xpos1.splice(0);
  rAssist.head1.splice(0);
  rAssist.block1.splice(0);
  rAssist.zpos1.splice(0);*/

  backUpToFile(rDataCoords, rDataFilePath);
  backUpToFile(cobbleBlocks, cobleFilePath);
  backUpToFile(rAssist, rAssistFilePath);
}

export function backUpToFile(data, path) {
  FileLib.write(path, JSON.stringify(data, undefined, 2), true);
}

export function getBlockData(posInList) {
  let { rDataCoords } = getBlockCoords();

  rDataCoords.custom[posInList] = {
    x: Player.getX(),
    y: Player.getY() - 1,
    z: Player.getZ(),
  };

  reWriteLocalData(rDataCoords, "rData");
}
