/** @format */

import { getBlockCoords } from "../functions/Blocks/blockCoords";
import Settings from "../data/config/config";
import {
  nextBlockRender,
  renderOneBlock,
  stopRenderBlock,
} from "../functions/Other/ESP";
import { findBlocks } from "../functions/Blocks/findBlocks2Break";
import { renderToolBlock } from "../debug_testing_dont_mind/debug";

let MC = Client.getMinecraft();

let C07PacketPlayerDigging = Java.type(
  "net.minecraft.network.play.client.C07PacketPlayerDigging"
);

let EnumFacing = Java.type("net.minecraft.util.EnumFacing");

let C0APacketAnimation = Java.type(
  "net.minecraft.network.play.client.C0APacketAnimation"
);

let blockMine = [];
var publicMinePos = undefined;
let brokenBlox = [];

let mineX = [];
let mineY = [];
let mineZ = [];

let mineNextX = [];
let mineNextY = [];
let mineNextZ = [];

let tempBlockList = [];

let cansend = false;
let enabled = false;
let routeToggle = false;

let timePoint = -1;

let nukerCheck = false;

let numberOAir = 0;

let blockCoords;

let nukerTickCounter = 0;

export function checkNuker() {
  nukerCheck = true;
  blockMine = [];
  makeArr();
}

export function routeNuker() {
  blockMine = [];
  tempBlockList = [];

  if (enabled == false && newNuker == false) {
    if (!routeToggle) {
      routeToggle = !routeToggle;

      if (routeToggle) {
        makeArr();
      }
    }
  } else {
    ChatLib.chat("&cDisabled route nuker");

    enabled = false;
    routeToggle = false;
    newNuker = false;
  }
}

function turnOnOff() {
  if (Settings.routeNukerType == 1) {
    if (enabled == false) {
      enabled = true;
      ChatLib.chat("&aEnabled route nuker");
    } else if (enabled == true) {
      ChatLib.chat("&cDisabled route nuker");

      routeToggle = false;
      enabled = false;
    }
  } else {
    if (newNuker == false) {
      newNuker = true;
      ChatLib.chat("&aEnabled route nuker");

      timePoint = Date.now();
    } else if (newNuker == true) {
      ChatLib.chat("&cDisabled route nuker");

      routeToggle = false;
      newNuker = false;
    }
  }
}

export function makeArr() {
  if (Settings.macroSpot == 1)
    blockCoords = getBlockCoords().rDataCoords.custom;
  else blockCoords = getBlockCoords().rDataCoords.default;

  if (blockCoords.length != 0) {
    if (Settings.nukerType == 0) {
      for (let i = 0; i < blockCoords.length - 1; i++) {
        calcBlocks(
          blockCoords[i].x,
          blockCoords[i].y,
          blockCoords[i].z,
          blockCoords[i + 1].x,
          blockCoords[i + 1].y,
          blockCoords[i + 1].z
        );
      }
    } else {
      calcBlockCyl(blockCoords.length - 1, blockCoords);
    }
  } else {
    ChatLib.chat("&cNo blocks selected so no nuker.");
    routeToggle = false;
    enabled = false;
  }
}

function calcBlocks(x1, y1, z1, x2, y2, z2) {
  if (Settings.nukerType == 0) {
    let numberOAir = 0;
    y1 = y1 + 1.54;

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

    for (let i = 0; i < length; i++) {
      let newX = stepX * i + x1;
      let newY = stepY * i + y1;
      let newZ = stepZ * i + z1;

      for (let m = -1; m <= 1; m++) {
        for (let k = -1; k <= 1; k++) {
          for (let j = -1; j <= 1; j++) {
            let block = World.getBlockAt(newX + m, newY + j, newZ + k);
            blockMine.push(block);

            if (block.type.getRegistryName() == "minecraft:air") {
              numberOAir++;
            }
          }
        }
      }
    }

    if (!nukerCheck) {
      turnOnOff();
    } else {
      ChatLib.chat(
        numberOAir +
          " air blocks found. That is about " +
          Math.floor((100 / blockMine.length) * numberOAir) +
          "%"
      );

      tempBlockList = [];
      numberOAir = 0;
      nukerCheck = false;
    }
  }
}

function checkMode() {
  if (!nukerCheck) {
    numberOAir = 0;
    turnOnOff();
  } else {
    ChatLib.chat(
      numberOAir +
        " air blocks found. That is about " +
        Math.floor((100 / blockMine.length) * numberOAir) +
        "%"
    );

    tempBlockList = [];
    numberOAir = 0;
    nukerCheck = false;
  }
}

function calcBlockCyl(length, coords) {
  blockMine = [];

  new Thread(() => {
    for (let i = 0; i < length; i++) {
      let foundBlocks = findBlocks(
        coords[i].x,
        coords[i].y + 2.54,
        coords[i].z,
        coords[i + 1].x,
        coords[i + 1].y,
        coords[i + 1].z,
        0.5
      );
      blockMine.push(...foundBlocks.blocks);

      numberOAir += foundBlocks.blockOAir;
    }

    checkMode();
  }).start();
}

function distanceToPlayerHead(x, y, z) {
  let dX = Player.getX() - x;
  let dZ = Player.getZ() - z;
  let dY = Player.getY() + 1.25 - y;
  let dis = Math.sqrt(dX * dX + dZ * dZ);
  let dis2 = Math.sqrt(dis * dis + dY * dY);
  return dis2;
}

let send = true;
let currentBlock;

export function shiftList() {
  return blockMine.shift();
}

register("Tick", () => {
  if (!World.isLoaded) return;
  if (enabled) {
    if (blockMine.length != 0) {
      let currSlot;

      try {
        currSlot = Player.getInventory()
          .getStackInSlot(Player.getHeldItemIndex())
          .getName()
          .toString();
      } catch (e) {
        return;
      }

      if (
        (currSlot.includes("Gauntlet") ||
          currSlot.includes("Drill") ||
          currSlot.includes("Pickaxe")) &&
        Math.abs(Player.getY() - Math.floor(Player.getY()) < 0.0001)
      ) {
        if (blockMine[0] != null) {
          try {
            currentBlock = blockMine[0];
            let currentBlockPos = new net.minecraft.util.BlockPos(
              currentBlock.getX(),
              currentBlock.getY(),
              currentBlock.getZ()
            );

            let stringVers = World.getBlockAt(
              currentBlock.getX(),
              currentBlock.getY(),
              currentBlock.getZ()
            );

            renderOneBlock(currentBlock);

            let strVers = stringVers.toString();

            if (
              !strVers.includes("air") &&
              !strVers.includes("cobblestone") &&
              !strVers.includes("glass") &&
              !strVers.includes("chest") &&
              !strVers.includes("prisma") &&
              !strVers.includes("slab") &&
              !strVers.includes("wood")
            ) {
              if (
                distanceToPlayerHead(
                  currentBlock.getX(),
                  currentBlock.getY(),
                  currentBlock.getZ()
                ) < 5
              ) {
                if (send) {
                  send = false;

                  MC.field_71439_g.field_71174_a.func_147297_a(
                    new C07PacketPlayerDigging(
                      C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK,
                      currentBlockPos,
                      EnumFacing.func_176733_a(
                        Client.getMinecraft().field_71439_g.field_70177_z
                      )
                    )
                  );

                  //currentBlock = shiftList();
                  brokenBlox.push(currentBlock);
                }

                MC.field_71439_g.field_71174_a.func_147297_a(
                  new C07PacketPlayerDigging(
                    C07PacketPlayerDigging.Action.START_DESTROY_BLOCK,
                    currentBlockPos,
                    EnumFacing.func_176733_a(
                      Client.getMinecraft().field_71439_g.field_70177_z
                    )
                  )
                );

                MC.field_71439_g.field_71174_a.func_147297_a(
                  new C0APacketAnimation()
                );
                MC.field_71439_g.func_71038_i();

                send = true;
              }
            } else {
              currentBlock = blockMine.shift();

              for (let m = 0; m < blockMine.length - 1; m++) {
                if (blockMine[m].type.getRegistryName() == "minecraft:air") {
                  blockMine.splice(m, 1);
                } else {
                  break;
                }
              }
            }
          } catch (e) {
            ChatLib.chat("Nuker error! Report to @godbrigero!");
            enabled = false;
            routeToggle = false;
          }
        } else {
          if (tempBlockList[0] != null) {
            for (let i = 0; i < tempBlockList.length; i++) {
              blockMine.push(tempBlockList[i]);
            }
          }
        }
      }
    } else {
      ChatLib.chat("&cDisabled route nuker!!");

      stopRenderBlock();
      enabled = false;
      routeToggle = false;
    }

    nukerTickCounter++;
  }
});

let newNuker = false;
let brokenBlockx = [];

function checkForType(block) {
  let currBlock = World.getBlockAt(block.getX(), block.getY(), block.getZ());
  let registryName = currBlock.type.getRegistryName();

  if (
    registryName != "minecraft:air" &&
    registryName != "minecraft:cobblestone" &&
    registryName != "minecraft:prismarine" &&
    registryName != "minecraft:prismarine_bricks" &&
    registryName != "minecraft:dark_prismarine" &&
    registryName != "minecraft:wool" &&
    !currBlock.toString().includes("glass") &&
    registryName != "minecraft:chest"
  ) {
    return true;
  } else {
    return false;
  }
}

let counter = 0;
let removedBlox = [];

register("Tick", () => {
  if (newNuker) {
    if (counter >= 7) {
      for (let i = 0; i < removedBlox.length - 1; i++) {
        if (checkForType(removedBlox[i]) == true) {
          blockMine.unshift(removedBlox[i]);
        } else {
          removedBlox.shift();
        }
      }

      counter = 0;
    }

    counter++;
  }
});

register("RenderWorld", () => {
  //ChatLib.chat(newNuker);
  if (
    newNuker &&
    Date.now() - timePoint >= 1000 / Settings.nukerBPS &&
    blockMine.length != 0 &&
    Math.abs(Player.getY() - Math.floor(Player.getY()) < 0.0001)
  ) {
    let currentBlock = blockMine[0];
    let currSlot;

    try {
      currSlot = Player.getInventory()
        .getStackInSlot(Player.getHeldItemIndex())
        .getName()
        .toString();
    } catch (e) {
      return;
    }

    if (
      currentBlock != null &&
      (currSlot.includes("Gauntlet") ||
        currSlot.includes("Drill") ||
        currSlot.includes("Pickaxe"))
    ) {
      renderOneBlock(currentBlock);
      if (
        distanceToPlayerHead(
          currentBlock.getX(),
          currentBlock.getY(),
          currentBlock.getZ()
        ) < 4.5
      ) {
        if (checkForType(currentBlock)) {
          let currentBlockPos = new net.minecraft.util.BlockPos(
            currentBlock.getX(),
            currentBlock.getY(),
            currentBlock.getZ()
          );

          MC.field_71439_g.field_71174_a.func_147297_a(
            new C07PacketPlayerDigging(
              C07PacketPlayerDigging.Action.START_DESTROY_BLOCK,
              currentBlockPos,
              EnumFacing.func_176733_a(
                Client.getMinecraft().field_71439_g.field_70177_z
              )
            )
          );

          MC.field_71439_g.field_71174_a.func_147297_a(
            new C0APacketAnimation()
          );
          MC.field_71439_g.func_71038_i();

          let removedBlock = blockMine.shift();

          removedBlox.push(removedBlock);
        } else {
          blockMine.shift();
        }
      }
    }

    timePoint = Date.now();
  } else if (blockMine.length == 0) {
    stopRenderBlock();
  }
});
