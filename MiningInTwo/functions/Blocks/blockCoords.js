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

export function getCurrentBlockList(block) {
  let blockCoords;

  if (Settings.macroSpot == 1)
    blockCoords = getBlockCoords().rDataCoords.custom;
  else blockCoords = getBlockCoords().rDataCoords.default;

  for (let i = 0; i < blockCoords.length - 1; i++) {
    if (
      Math.abs(blockCoords[i].x - block.getX()) < 0.0001 &&
      Math.abs(blockCoords[i].z - block.getZ()) < 0.0001
    ) {
      if (i + 1 < blockCoords.length) {
        return blockCoords[i + 1];
      } else {
        return blockCoords[0];
      }
    }
  }

  return -1;
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

export function placeInMid(pointNumber) {
  let rAssistCustom = rAssist.custom;

  let blockUnder = World.getBlockAt(
    Player.getX(),
    Player.getY() - 1,
    Player.getZ()
  );

  let midBlock = {
    x: blockUnder.getX(),
    y: blockUnder.getY() - 1,
    z: blockUnder.getZ(),
  };

  let rDataCustom = rDataCoords.custom;
  rDataCustom.splice(pointNumber - 1, 0, midBlock);

  rDataCoords = {
    default: rDataCoords.default,
    custom: rDataCustom,
  };

  rAssistCustom.xpos1.splice(pointNumber - 1, 0, blockUnder.getX() + 0.5);
  rAssistCustom.head1.splice(pointNumber - 1, 0, blockUnder.getY());
  rAssistCustom.block1.splice(pointNumber - 1, 0, blockUnder.getY() - 0.5);
  rAssistCustom.zpos1.splice(pointNumber - 1, 0, blockUnder.getZ() + 0.5);

  rAssist = {
    default: rAssist.default,
    custom: rAssistCustom,
  };

  let cobbleBlocksCustom = cobbleBlocks.custom;
  cobbleBlocksCustom.xpos1.splice(pointNumber - 1, 0, blockUnder.getX() + 0.5);
  cobbleBlocksCustom.ypos1.splice(pointNumber - 1, 0, blockUnder.getY() - 0.5);
  cobbleBlocksCustom.zpos1.splice(pointNumber - 1, 0, blockUnder.getZ() + 0.5);

  cobbleBlocks = {
    default: cobbleBlocks.default,
    custom: cobbleBlocksCustom,
  };

  ///////////////////////////////////////////////////////////////////////////

  backUpToFile(rDataCoords, rDataFilePath);
  backUpToFile(cobbleBlocks, cobleFilePath);
  backUpToFile(rAssist, rAssistFilePath);
}

export function removePoint(pointNumber) {
  if (pointNumber != 1) {
    let rDataCustom = rDataCoords.custom.splice(pointNumber - 1);

    rDataCoords = {
      default: rDataCoords.default,
      custom: rDataCustom,
    };
  } else {
    rDataCoords.custom.pop();
    let rDataCustom = rDataCoords.custom;

    rDataCoords = {
      default: rDataCoords.default,
      custom: rDataCustom,
    };
  }

  let cobbleBlocksCustom = cobbleBlocks.custom;
  cobbleBlocksCustom.xpos1.splice(pointNumber - 1, 1);
  cobbleBlocksCustom.ypos1.splice(pointNumber - 1, 1);
  cobbleBlocksCustom.zpos1.splice(pointNumber - 1, 1);

  cobbleBlocks = {
    default: cobbleBlocks.default,
    custom: cobbleBlocksCustom,
  };

  let rAssistCustom = rAssist.custom;
  rAssistCustom.xpos1.splice(pointNumber - 1, 1);
  rAssistCustom.head1.splice(pointNumber - 1, 1);
  rAssistCustom.block1.splice(pointNumber - 1, 1);
  rAssistCustom.zpos1.splice(pointNumber - 1, 1);

  rAssist = {
    default: rAssist.default,
    custom: rAssistCustom,
  };

  backUpToFile(rDataCoords, rDataFilePath);
  backUpToFile(cobbleBlocks, cobleFilePath);
  backUpToFile(rAssist, rAssistFilePath);
}

export function cloneDefaultRoute() {
  rDataCoords = {
    default: rDataCoords.default,
    custom: rDataCoords.default,
  };

  cobbleBlocks = {
    default: cobbleBlocks.default,
    custom: cobbleBlocks.default,
  };

  rAssist = {
    default: rAssist.default,
    custom: rAssist.default,
  };

  backUpToFile(rDataCoords, rDataFilePath);
  backUpToFile(cobbleBlocks, cobleFilePath);
  backUpToFile(rAssist, rAssistFilePath);
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
