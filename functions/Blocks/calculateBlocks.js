import { getBlockCoords } from "./blockCoords";
import Settings from "../../data/config/config";
import { addPoint, renderToolBlock } from "../../debug_testing_dont_mind/debug";
import { distanceFromTo } from "../../other/routeHelper";
import { addBlock } from "./blocks";
import { renderOneBlock, stopRenderBlock } from "../Other/ESP";

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

let nukerCheck = false;

let numberOAir = 0;

let blockCoords;

let nukerTickCounter = 0;

register("command", (...args) => {
  routeNuker();
}).setName("routenuker");

register("command", (...args) => {
  checkNuker();
}).setName("checknuker");

function checkNuker() {
  nukerCheck = true;
  blockMine = [];
  makeArr();
}

function routeNuker() {
  blockMine = [];
  tempBlockList = [];

  if (!routeToggle) {
    routeToggle = !routeToggle;

    if (routeToggle) {
      makeArr();
    }
  }
}

function turnOnOff() {
  if (enabled == false) {
    enabled = true;
    ChatLib.chat("&aEnabled route nuker");
  } else if (enabled == true) {
    ChatLib.chat("&cDisabled route nuker");

    routeToggle = false;
    enabled = false;
  }
}

export function makeArr() {
  if (Settings.macroSpot == 1)
    blockCoords = getBlockCoords().rDataCoords.custom;
  else blockCoords = getBlockCoords().rDataCoords.default;

  if (blockCoords.length != 0) {
    if (Settings.nukerType != 2) {
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
  } else if (Settings.nukerType == 1) {
    let numberOAir = 0;

    y1 = y1 + 1;

    //y1 = y1 + 1;
    y2 = y2 + 1;

    mineX.push(Math.floor(x1));
    mineNextX.push(Math.floor(x1));
    //blockposx.push(Math.floor(x1))

    mineY.push(Math.floor(y1));
    mineNextY.push(Math.floor(y1));
    //blockposy.push(Math.floor(y1))

    mineZ.push(Math.floor(z1));
    mineNextZ.push(Math.floor(z1));
    //blockposz.push(Math.floor(z1))

    mineX.push(Math.floor(x1));
    mineNextX.push(Math.floor(x1));
    //blockposx.push(Math.floor(x1))

    mineY.push(Math.floor(y1) + 1);
    mineNextY.push(Math.floor(y1) + 1);
    //blockposy.push(Math.floor(y1) + 1)

    mineZ.push(Math.floor(z1));
    mineNextZ.push(Math.floor(z1));
    //blockposz.push(Math.floor(z1))

    mineX.push(Math.floor(x1));
    mineNextX.push(Math.floor(x1));
    //blockposx.push(Math.floor(x1))

    mineY.push(Math.floor(y1) + 2);
    mineNextY.push(Math.floor(y1) + 2);
    //blockposy.push(Math.floor(y1) + 2)

    mineZ.push(Math.floor(z1));
    mineNextZ.push(Math.floor(z1));
    //blockposz.push(Math.floor(z1))

    x1 = x1 + 0.5;
    //y1 = y1 + 0.5;
    y1 = y1 + 2.62 - 3 / 32; //shifting apparently lowers eye level by 3/32 block, needs testing. **should be fixed need more tests
    z1 = z1 + 0.5;

    x2 = x2 + 0.5;
    y2 = y2 + 0.5; // either Y or Y + 0.5 depending on what 18's macro looks at. currently his macro looks at Y
    z2 = z2 + 0.5;

    var changeX = (x2 - x1) / 100; // if someone can find a better number based on math than this im all ears. I was just too lazy, 10k should be fine
    var changeY = (y2 - y1) / 100;
    var changeZ = (z2 - z1) / 100;
    var curX = x1;
    var curY = y1;
    var curZ = z1;
    var blockX = Math.floor(curX);
    var blockY = Math.floor(curY);
    var blockZ = Math.floor(curZ);

    for (var counter = 1; counter <= 100; counter++) {
      blockX = Math.floor(curX);
      blockY = Math.floor(curY);
      blockZ = Math.floor(curZ);
      curX += changeX;
      curY += changeY;
      curZ += changeZ;
      if (
        blockX != Math.floor(curX) ||
        blockY != Math.floor(curY) ||
        blockZ != Math.floor(curZ)
      ) {
        //console.log(blockX + ', ' + blockY + ', ' + blockZ )

        mineX.push(blockX);
        mineNextX.push(blockX);
        //mineX.push(blockX)

        mineY.push(blockY);
        mineNextY.push(blockY);
        //mineY.push(blockY - 1)
        //blockposy.push(blockY)

        mineZ.push(blockZ);
        mineNextZ.push(blockZ);
        //console.log('pushed ' + blockZ)
        //mineZ.push(blockZ)
        //blockposy.push(blockZ)

        if (blockX != Math.floor(curX - 0.1)) {
          mineX.push(blockX - 1);
          mineNextX.push(blockX - 1);
          mineX.push(blockX - 1);
          mineX.push(blockX - 2);
          mineX.push(blockX - 2);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 2);
          mineNextX.push(blockX - 2);
          //mineX.push(blockX - 1)
          //mineX.push(blockX - 2)
          //mineX.push(blockX - 2)
          //blockposx.push(blockX - 1)

          mineY.push(blockY);
          mineNextY.push(blockY);
          mineY.push(blockY + 1);
          mineY.push(blockY);
          mineY.push(blockY + 1);
          mineNextY.push(blockY + 1);
          mineNextY.push(blockY);
          mineNextY.push(blockY + 1);
          //mineY.push(blockY - 1)
          //mineY.push(blockY)
          //mineY.push(blockY - 1)
          //blockposy.push(blockY - 2)

          mineZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
          //console.log('pushed ' + blockZ)
          //mineZ.push(blockZ)
          //mineZ.push(blockZ)
          //mineZ.push(blockZ)
          //blockposy.push(blockZ)
        }

        if (blockX != Math.floor(curX + 0.1)) {
          mineX.push(blockX + 1);
          mineNextX.push(blockX + 1);
          mineX.push(blockX + 1);
          mineX.push(blockX + 0);
          mineX.push(blockX + 0);
          mineNextX.push(blockX + 1);
          mineNextX.push(blockX + 0);
          mineNextX.push(blockX + 0);
          //mineX.push(blockX + 1)
          //mineX.push(blockX + 0)
          //mineX.push(blockX + 0)
          //blockposx.push(blockX + 1)

          mineY.push(blockY);
          mineNextY.push(blockY);
          mineY.push(blockY + 1);
          mineY.push(blockY);
          mineY.push(blockY + 1);
          mineNextY.push(blockY + 1);
          mineNextY.push(blockY);
          mineNextY.push(blockY + 1);

          //mineY.push(blockY - 1)
          //mineY.push(blockY)
          //mineY.push(blockY - 1)
          //blockposy.push(blockY)

          mineZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);

          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);

          //console.log('pushed ' + blockZ)
          //mineZ.push(blockZ)
          //mineZ.push(blockZ)
          //mineZ.push(blockZ)
          //blockposy.push(blockZ)
        }

        if (blockY != Math.floor(curY - 0.1)) {
          mineX.push(blockX);
          mineNextX.push(blockX);
          mineX.push(blockX);
          mineX.push(blockX - 1);
          mineX.push(blockX - 1);

          mineNextX.push(blockX);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 1);

          //mineX.push(blockX)
          //mineX.push(blockX - 1)
          //mineX.push(blockX - 1)
          //blockposx.push(blockX)

          mineY.push(blockY - 1);
          mineNextY.push(blockY - 1);
          mineY.push(blockY - 0);
          mineY.push(blockY - 1);
          mineY.push(blockY - 0);

          mineNextY.push(blockY - 0);
          mineNextY.push(blockY - 1);
          mineNextY.push(blockY - 0);

          //mineY.push(blockY - 2)
          //mineY.push(blockY - 1)
          //mineY.push(blockY - 2)
          //blockposy.push(blockY - 1)

          mineZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);

          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);

          //console.log('pushed ' + blockZ)
          //mineZ.push(blockZ)
          //mineZ.push(blockZ)
          //mineZ.push(blockZ)
          //blockposy.push(blockZ)
        }

        if (blockY != Math.floor(curY + 0.1)) {
          mineX.push(blockX);
          mineNextX.push(blockX);
          mineX.push(blockX);
          mineX.push(blockX - 1);
          mineX.push(blockX - 1);

          mineNextX.push(blockX);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 1);

          //mineX.push(blockX)
          //mineX.push(blockX - 1)
          //mineX.push(blockX - 1)
          //blockposx.push(blockX)

          mineY.push(blockY + 1);
          mineNextY.push(blockY + 1);
          mineY.push(blockY + 2);
          mineY.push(blockY + 1);
          mineY.push(blockY + 2);

          mineNextY.push(blockY + 2);
          mineNextY.push(blockY + 1);
          mineNextY.push(blockY + 2);

          //mineY.push(blockY + 0)
          //mineY.push(blockY + 1)
          //mineY.push(blockY + 0)
          //blockposy.push(blockY + 1)

          mineZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);

          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);

          //console.log('pushed ' + blockZ)
          //mineZ.push(blockZ)
          //mineZ.push(blockZ)
          //mineZ.push(blockZ)
          //blockposy.push(blockZ)
        }

        if (blockZ != Math.floor(curZ - 0.1)) {
          mineX.push(blockX);
          mineNextX.push(blockX);
          mineX.push(blockX);
          mineX.push(blockX - 1);
          mineX.push(blockX - 1);

          mineNextX.push(blockX);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 1);

          //mineX.push(blockX)
          //mineX.push(blockX - 1)
          //mineX.push(blockX - 1)
          //blockposx.push(blockX)

          mineY.push(blockY);
          mineNextY.push(blockY);
          mineY.push(blockY + 1);
          mineY.push(blockY);
          mineY.push(blockY + 1);
          mineNextY.push(blockY + 1);
          mineNextY.push(blockY);
          mineNextY.push(blockY + 1);
          //mineY.push(blockY - 1)
          //mineY.push(blockY)
          //mineY.push(blockY - 1)
          //blockposy.push(blockY)

          mineZ.push(blockZ - 1);
          mineNextZ.push(blockZ - 1);

          mineZ.push(blockZ - 1);
          mineZ.push(blockZ - 1);
          mineZ.push(blockZ - 1);
          mineNextZ.push(blockZ - 1);
          mineNextZ.push(blockZ - 1);
          mineNextZ.push(blockZ - 1);

          //console.log('pushed ' + blockZ - 1)
          //mineZ.push(blockZ - 1)
          //mineZ.push(blockZ - 1)
          //mineZ.push(blockZ - 1)
          //blockposy.push(blockZ - 1)
        }

        if (blockZ != Math.floor(curZ + 0.1)) {
          mineX.push(blockX);
          mineNextX.push(blockX);
          mineX.push(blockX);
          mineX.push(blockX - 1);
          mineX.push(blockX - 1);

          mineNextX.push(blockX);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 1);

          //mineX.push(blockX)
          ///mineX.push(blockX - 1)
          //mineX.push(blockX - 1)
          //blockposx.push(blockX)

          mineY.push(blockY);
          mineNextY.push(blockY);
          mineY.push(blockY + 1);
          mineY.push(blockY);
          mineY.push(blockY + 1);

          mineNextY.push(blockY + 1);
          mineNextY.push(blockY);
          mineNextY.push(blockY + 1);

          //mineY.push(blockY - 1)
          //mineY.push(blockY)
          //mineY.push(blockY - 1)
          //blockposy.push(blockY)

          mineZ.push(blockZ + 1);
          mineNextZ.push(blockZ + 1);
          mineZ.push(blockZ + 1);
          mineZ.push(blockZ + 1);
          mineZ.push(blockZ + 1);

          mineNextZ.push(blockZ + 1);
          mineNextZ.push(blockZ + 1);
          mineNextZ.push(blockZ + 1);

          //console.log('pushed ' + blockZ + 1)
          //mineZ.push(blockZ + 1)
          //mineZ.push(blockZ + 1)
          //mineZ.push(blockZ + 1)
          //blockposy.push(blockZ + 1)
        }

        //console.log(coordsJ.length)
      }
    }

    for (let i = 0; i < mineX.length; i++) {
      let block = World.getBlockAt(mineX[i], mineY[i], mineZ[i]);

      blockMine.push(block);

      if (block.type.getRegistryName() == "minecraft:air") {
        numberOAir++;
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

    mineX = [];
    mineY = [];
    mineZ = [];
  }
}

function calcBlockCyl(longth, coords) {
  new Thread(() => {
    blockMine = [];
    let CYLINDER_RADIUS = 0.6;

    for (let l = 0; l < longth; l++) {
      let x1 = coords[l].x;
      let y1 = coords[l].y + 1.65;
      let z1 = coords[l].z;
      let x2 = coords[l + 1].x;
      let y2 = coords[l + 1].y;
      let z2 = coords[l + 1].z;

      let tempBlocks2 = [];
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

      for (let i = 0; i < length; i++) {
        for (let degree = 0; degree < 360; degree += 20) {
          let angle = degree * (Math.PI / 180);
          let dxP = dxN * Math.cos(angle) + dxM * Math.sin(angle);
          let dyP = dyN * Math.cos(angle) + dyM * Math.sin(angle);
          let dzP = dzN * Math.cos(angle) + dzM * Math.sin(angle);

          let newX = stepX * i + x1 + dxP * CYLINDER_RADIUS;
          let newY = stepY * i + y1 + dyP * CYLINDER_RADIUS;
          let newZ = stepZ * i + z1 + dzP * CYLINDER_RADIUS;

          let block = World.getBlockAt(newX, newY, newZ);

          let found = false;

          for (let j = 0; j < tempBlocks2.length - 1; j++) {
            if (
              tempBlocks2[j].getX() == block.getX() &&
              tempBlocks2[j].getY() == block.getY() &&
              tempBlocks2[j].getZ() == block.getZ()
            ) {
              found = true;
            }
          }

          if (found == false) {
            tempBlocks2.push(block);

            if (block.type.getRegistryName() == "minecraft:air") {
              numberOAir++;
            }
            //blocks.push(World.getBlockAt(x2, y2 + 2, z2));
          }
        }
      }

      for (let m = 0; m < tempBlocks2.length; m++) {
        blockMine.push(tempBlocks2[m]);
      }

      tempBlocks2 = [];
    }

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

    //ChatLib.chat(enabled);
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
      if (nukerTickCounter >= 5) {
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

            if (
              !stringVers.toString().includes("air") &&
              !stringVers.toString().includes("cobblestone") &&
              !stringVers.toString().includes("glass")
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
