/** @format */

import Settings from "../data/config/config";

import RenderLib from "../../RenderLib/index";
import { getBlockCoords } from "../utils/blockCoords";

let blocks = [];
let state = false;
let block;
let pairCount = 0;
let isWritten = false;

const CYLINDER_RADIUS = 0.7;

register("gameUnload", () => {
  if (routeToggle) {
    isWritten = false;
    state = false;

    blocks = [];
  }
});

export function getBlocksOnLine(x1, y1, z1, x2, y2, z2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let dz = z2 - z1;

  if (Math.abs(dz) < 0.000001) {
    dz = 0.000001;
  }

  let length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  let stepX = dx / length;
  let stepY = dy / length;
  let stepZ = dz / length;

  let planeCoef = x1 * dx + y1 * dy + z1 * dz;

  let xN = 0;
  let yN = 0;
  let zN = planeCoef / dz;
  let dxN = xN - x1;
  let dyN = yN - y1;
  let dzN = zN - z1;
  let lenN = Math.sqrt(dxN * dxN + dyN * dyN + dzN * dzN);
  dxN = dxN / lenN;
  dyN = dyN / lenN;
  dzN = dzN / lenN;

  let dxM = dy * dzN - dz * dyN;
  let dyM = dz * dxN - dx * dzN;
  let dzM = dx * dyN - dy * dxN;
  let cLen = Math.sqrt(dxM * dxM + dyM * dyM + dzM * dzM);
  dxM = dxM / cLen;
  dyM = dyM / cLen;
  dzM = dzM / cLen;

  for (let degree = 0; degree < 360; degree += 20) {
    let angle = degree * (Math.PI / 180);
    let dxP = dxN * Math.cos(angle) + dxM * Math.sin(angle);
    let dyP = dyN * Math.cos(angle) + dyM * Math.sin(angle);
    let dzP = dzN * Math.cos(angle) + dzM * Math.sin(angle);

    for (let i = 0; i < length; i++) {
      let newX = stepX * i + x1 + dxP * CYLINDER_RADIUS;
      let newY = stepY * i + y1 + dyP * CYLINDER_RADIUS;
      let newZ = stepZ * i + z1 + dzP * CYLINDER_RADIUS;

      let block = World.getBlockAt(newX, newY, newZ);

      let found = false;
      for (let j = 0; j < blocks.length; j++) {
        if (
          blocks[j].getX() == block.getX() &&
          blocks[j].getY() == block.getY() &&
          blocks[j].getZ() == block.getZ()
        ) {
          found = true;
        }
      }

      if (found == false) {
        blocks.push(block);
        blocks.push(World.getBlockAt(x2, y2 + 2, z2));
      }
    }
  }
}

export function routeHelper() {
  let blockCoords;
  let blockCoordsAssist;

  if (Settings.macroSpot == 1) {
    blockCoords = getBlockCoords().cobbleBlocks.custom;
    blockCoordsAssist = getBlockCoords().rAssist.custom;
  } else {
    blockCoords = getBlockCoords().cobbleBlocks.default;
    blockCoordsAssist = getBlockCoords().rAssist.default;
  }

  let xPosCobble = blockCoords.xpos1;
  let yPosCobble = blockCoords.ypos1;
  let zPosCobble = blockCoords.zpos1;

  let xpos1 = blockCoordsAssist.xpos1;
  let block1 = blockCoordsAssist.block1;
  let zpos1 = blockCoordsAssist.zpos1;

  try {
    getBlocksOnLine(
      xPosCobble[pairCount],
      yPosCobble[pairCount] + 2.548,
      zPosCobble[pairCount],
      xpos1[pairCount + 1],
      block1[pairCount + 1] + 1.3,
      zpos1[pairCount + 1]
    );

    blocks.sort((a, b) => {
      return distanceFromTo(
        b.getX(),
        b.getY(),
        b.getZ(),
        xPosCobble[pairCount],
        yPosCobble[pairCount],
        zPosCobble[pairCount]
      ) <
        distanceFromTo(
          a.getX(),
          a.getY(),
          a.getZ(),
          xPosCobble[pairCount],
          yPosCobble[pairCount],
          zPosCobble[pairCount]
        )
        ? 1
        : -1;
    });

    /*blocks.filter(
      (a) =>
        !a.toString().includes("air") &&
        !a.toString().includes("cobblestone") &&
        !a.toString().includes("stained_galss")
    );*/

    block = blocks.shift();
    state = true;
    isWritten = true;
  } catch (e) {
    ChatLib.chat("L");
  }
}

function distanceFromTo(x, y, z, x1, y1, z1) {
  let dX = x1 - x;
  let dZ = y1 - z;
  let dY = z1 - y;

  let dis = Math.sqrt(dX * dX + dZ * dZ);
  let dis2 = Math.sqrt(dis * dis + dY * dY);
  return dis2;
}

register("command", (...args) => {
  routeHelper();
}).setName("test");

register("Tick", () => {
  if (isWritten == true && blocks.length == 0) {
    let cobbleBlocks;

    if (Settings.macroSpot == 1) {
      cobbleBlocks = getBlockCoords().cobbleBlocks.custom;
    } else {
      cobbleBlocks = getBlockCoords().cobbleBlocks.default;
    }

    let xPosCobble = cobbleBlocks.xpos1;

    if (pairCount < xPosCobble.length) {
      pairCount += 1;
      isWritten = false;
      routeHelper();
    } else {
      isWritten = false;
      pairCount = 0;
      ChatLib.chat("&l---------------------------------------------");
      ChatLib.chat(
        "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" + " &lRoute Cleared!"
      );
      ChatLib.chat("&l---------------------------------------------");
    }
  }
});

register("renderWorld", () => {
  if (state == true) {
    if (!World.isLoaded) return;
    if (block) {
      let nextCount = 0;
      let rAssist;

      if (Settings.macroSpot == 1) {
        rAssist = getBlockCoords().rAssist.custom;
        cobbleBlock = getBlockCoords().cobbleBlocks.custom;
      } else {
        rAssist = getBlockCoords().rAssist.default;
        cobbleBlock = getBlockCoords().cobbleBlocks.default;
      }

      let xpos1 = rAssist.xpos1;
      let block1 = rAssist.block1;
      let zpos1 = rAssist.zpos1;

      if (xpos1.length != 0) {
        if (
          World.getBlockAt(block.getX(), block.getY(), block.getZ())
            .toString()
            .includes("air") ||
          World.getBlockAt(block.getX(), block.getY(), block.getZ())
            .toString()
            .includes("cobblestone") ||
          World.getBlockAt(block.getX(), block.getY(), block.getZ())
            .toString()
            .includes("stained_glass") ||
          World.getBlockAt(block.getX(), block.getY(), block.getZ())
            .toString()
            .includes("bedrock")
        ) {
          RenderLib.drawEspBox(
            block.getX() + 0.5,
            block.getY(),
            block.getZ() + 0.5,
            1,
            1,
            0,
            1,
            0,
            1,
            true
          );
          block = blocks.shift();
        } else {
          for (let i = 0; i < xpos1.length; i++) {
            if (
              Math.abs(xpos1[i] - block.getX()) < 0.0001 &&
              Math.abs(block1[i] - block.getY()) < 0.00001 &&
              Math.abs(zpos1[i] - block.getZ()) < 0.00001
            ) {
              block = blocks.shift();
              nextCount++;
            }
          }

          RenderLib.drawEspBox(
            block.getX() + 0.5,
            block.getY(),
            block.getZ() + 0.5,
            1,
            1,
            0,
            1,
            0,
            1,
            true
          );

          try {
            RenderLib.drawEspBox(
              blocks[0 + nextCount].getX() + 0.5,
              blocks[0 + nextCount].getY(),
              blocks[0 + nextCount].getZ() + 0.5,
              1,
              1,
              1,
              1,
              1,
              1,
              true
            );
          } catch (e) {}
        }
      }
    } else {
      isWritten = true;
      state = false;
    }
  }
});
