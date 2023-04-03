//Deff not borrowed from yefi (fr)

import { sendStart } from "../Other/Packets/sendStart";
import { sendStop } from "../Other/Packets/sendStop";
import { getBlockCoords } from "./blockCoords";
import Settings from "../../data/config/config";
import { addBlock, renderToolBlock } from "../../debug_testing_dont_mind/debug";

let MC = Client.getMinecraft();

let C07PacketPlayerDigging = Java.type(
  "net.minecraft.network.play.client.C07PacketPlayerDigging"
);

let EnumFacing = Java.type("net.minecraft.util.EnumFacing");
let C0APacketAnimation = Java.type(
  "net.minecraft.network.play.client.C0APacketAnimation"
);

let mineX = [];
let mineY = [];
let mineZ = [];
var mineNextX = [];
var mineNextY = [];
var mineNextZ = [];
var publicMinePos = undefined;
let checkbrokenx = [];

let cansend = false;
let enabled = false;
let canshift = false;
let first = false;
let routeToggle = false;

let blockCoords;

let nukerTickCounter = 0;

register("command", (...args) => {
  routeNuker();
}).setName("rn1");

function routeNuker() {
  if (!routeToggle) {
    routeToggle = !routeToggle;
    mineX = [];
    mineY = [];
    mineZ = [];
    if (routeToggle) {
      /*selectedAotvCords();
      data.aotvBlocksX.push(data.aotvBlocksX[0]);
      data.aotvBlocksY.push(data.aotvBlocksY[0]);
      data.aotvBlocksZ.push(data.aotvBlocksZ[0]);*/
      makeArr();
    }
  }

  if (enabled == false) {
    ChatLib.chat("&aEnabled route nuker");
    enabled = true;
  } else if (enabled == true) {
    ChatLib.chat("&cDisabled route nuker");
    if (cansend == true) {
      cansend = false;

      MC.field_71439_g.field_71174_a.func_147297_a(
        new C07PacketPlayerDigging(
          C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK,
          publicMinePos,
          EnumFacing.func_176733_a(
            Client.getMinecraft().field_71439_g.field_70177_z
          )
        )
      );
    }

    enabled = false;
  }
}

export function makeArr() {
  if (Settings.macroSpot == 1)
    blockCoords = getBlockCoords().rDataCoords.custom;
  else blockCoords = getBlockCoords().rDataCoords.default;

  for (var i = 0; i < blockCoords.length - 1; i++) {
    calcBlocks(
      blockCoords[i].x,
      blockCoords[i].y,
      blockCoords[i].z,
      blockCoords[i + 1].x,
      blockCoords[i + 1].y,
      blockCoords[i + 1].z
    );
  }
}

function calcBlocks(x1, y1, z1, x2, y2, z2) {
  y1 = y1 + 1;
  y2 = y2 + 1;

  mineX.push(Math.floor(x1));
  mineNextX.push(Math.floor(x1));

  mineY.push(Math.floor(y1));
  mineNextY.push(Math.floor(y1));

  mineZ.push(Math.floor(z1));
  mineNextZ.push(Math.floor(z1));

  mineX.push(Math.floor(x1));
  mineNextX.push(Math.floor(x1));

  mineY.push(Math.floor(y1) + 1);
  mineNextY.push(Math.floor(y1) + 1);

  mineZ.push(Math.floor(z1));
  mineNextZ.push(Math.floor(z1));

  mineX.push(Math.floor(x1));
  mineNextX.push(Math.floor(x1));

  mineY.push(Math.floor(y1) + 2);
  mineNextY.push(Math.floor(y1) + 2);

  mineZ.push(Math.floor(z1));
  mineNextZ.push(Math.floor(z1));

  x1 = x1 + 0.5;
  y1 = y1 + 2.62 - 3 / 32;
  z1 = z1 + 0.5;

  x2 = x2 + 0.5;
  y2 = y2 + 0.5;
  z2 = z2 + 0.5;

  var changeX = (x2 - x1) / 100;
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
      mineX.push(blockX);
      mineNextX.push(blockX);

      mineY.push(blockY);
      mineNextY.push(blockY);

      mineZ.push(blockZ);
      mineNextZ.push(blockZ);

      if (blockX != Math.floor(curX - 0.1)) {
        mineX.push(blockX - 1);
        mineNextX.push(blockX - 1);
        if (Settings.nukertype == 0) {
          mineX.push(blockX - 1);
          mineX.push(blockX - 2);
          mineX.push(blockX - 2);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 2);
          mineNextX.push(blockX - 2);
        }

        mineY.push(blockY);
        mineNextY.push(blockY);
        if (Settings.nukertype == 0) {
          mineY.push(blockY + 1);
          mineY.push(blockY);
          mineY.push(blockY + 1);
          mineNextY.push(blockY + 1);
          mineNextY.push(blockY);
          mineNextY.push(blockY + 1);
        }

        mineZ.push(blockZ);
        mineNextZ.push(blockZ);
        if (Settings.nukertype == 0) {
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
        }
      }

      if (blockX != Math.floor(curX + 0.1)) {
        mineX.push(blockX + 1);
        mineNextX.push(blockX + 1);
        if (Settings.nukertype == 0) {
          mineX.push(blockX + 1);
          mineX.push(blockX + 0);
          mineX.push(blockX + 0);
          mineNextX.push(blockX + 1);
          mineNextX.push(blockX + 0);
          mineNextX.push(blockX + 0);
        }

        mineY.push(blockY);
        mineNextY.push(blockY);
        if (Settings.nukertype == 0) {
          mineY.push(blockY + 1);
          mineY.push(blockY);
          mineY.push(blockY + 1);
          mineNextY.push(blockY + 1);
          mineNextY.push(blockY);
          mineNextY.push(blockY + 1);
        }

        mineZ.push(blockZ);
        mineNextZ.push(blockZ);
        if (Settings.nukertype == 0) {
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);

          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
        }
        //console.log('pushed ' + blockZ)
        //mineZ.push(blockZ)
        //mineZ.push(blockZ)
        //mineZ.push(blockZ)
        //blockposy.push(blockZ)
      }

      if (blockY != Math.floor(curY - 0.1)) {
        mineX.push(blockX);
        mineNextX.push(blockX);
        if (Settings.nukertype == 0) {
          mineX.push(blockX);
          mineX.push(blockX - 1);
          mineX.push(blockX - 1);

          mineNextX.push(blockX);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 1);
        }
        //mineX.push(blockX)
        //mineX.push(blockX - 1)
        //mineX.push(blockX - 1)
        //blockposx.push(blockX)

        mineY.push(blockY - 1);
        mineNextY.push(blockY - 1);
        if (Settings.nukertype == 0) {
          mineY.push(blockY - 0);
          mineY.push(blockY - 1);
          mineY.push(blockY - 0);

          mineNextY.push(blockY - 0);
          mineNextY.push(blockY - 1);
          mineNextY.push(blockY - 0);
        }

        //mineY.push(blockY - 2)
        //mineY.push(blockY - 1)
        //mineY.push(blockY - 2)
        //blockposy.push(blockY - 1)

        mineZ.push(blockZ);
        mineNextZ.push(blockZ);
        if (Settings.nukertype == 0) {
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);

          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
        }
        //console.log('pushed ' + blockZ)
        //mineZ.push(blockZ)
        //mineZ.push(blockZ)
        //mineZ.push(blockZ)
        //blockposy.push(blockZ)
      }

      if (blockY != Math.floor(curY + 0.1)) {
        mineX.push(blockX);
        mineNextX.push(blockX);
        if (Settings.nukertype == 0) {
          mineX.push(blockX);
          mineX.push(blockX - 1);
          mineX.push(blockX - 1);

          mineNextX.push(blockX);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 1);
        }
        //mineX.push(blockX)
        //mineX.push(blockX - 1)
        //mineX.push(blockX - 1)
        //blockposx.push(blockX)

        mineY.push(blockY + 1);
        mineNextY.push(blockY + 1);
        if (Settings.nukertype == 0) {
          mineY.push(blockY + 2);
          mineY.push(blockY + 1);
          mineY.push(blockY + 2);

          mineNextY.push(blockY + 2);
          mineNextY.push(blockY + 1);
          mineNextY.push(blockY + 2);
        }
        //mineY.push(blockY + 0)
        //mineY.push(blockY + 1)
        //mineY.push(blockY + 0)
        //blockposy.push(blockY + 1)

        mineZ.push(blockZ);
        mineNextZ.push(blockZ);
        if (Settings.nukertype == 0) {
          mineZ.push(blockZ);
          mineZ.push(blockZ);
          mineZ.push(blockZ);

          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
          mineNextZ.push(blockZ);
        }
        //console.log('pushed ' + blockZ)
        //mineZ.push(blockZ)
        //mineZ.push(blockZ)
        //mineZ.push(blockZ)
        //blockposy.push(blockZ)
      }

      if (blockZ != Math.floor(curZ - 0.1)) {
        mineX.push(blockX);
        mineNextX.push(blockX);
        if (Settings.nukertype == 0) {
          mineX.push(blockX);
          mineX.push(blockX - 1);
          mineX.push(blockX - 1);

          mineNextX.push(blockX);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 1);
        }
        //mineX.push(blockX)
        //mineX.push(blockX - 1)
        //mineX.push(blockX - 1)
        //blockposx.push(blockX)

        mineY.push(blockY);
        mineNextY.push(blockY);
        if (Settings.nukertype == 0) {
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
        }
        mineZ.push(blockZ - 1);
        mineNextZ.push(blockZ - 1);

        ChatLib.chat(Settings.nukertype);
        if (Settings.nukertype == 0) {
          mineZ.push(blockZ - 1);
          mineZ.push(blockZ - 1);
          mineZ.push(blockZ - 1);
          mineNextZ.push(blockZ - 1);
          mineNextZ.push(blockZ - 1);
          mineNextZ.push(blockZ - 1);
        }
        //console.log('pushed ' + blockZ - 1)
        //mineZ.push(blockZ - 1)
        //mineZ.push(blockZ - 1)
        //mineZ.push(blockZ - 1)
        //blockposy.push(blockZ - 1)
      }

      if (blockZ != Math.floor(curZ + 0.1)) {
        mineX.push(blockX);
        mineNextX.push(blockX);
        if (Settings.nukertype == 0) {
          mineX.push(blockX);
          mineX.push(blockX - 1);
          mineX.push(blockX - 1);

          mineNextX.push(blockX);
          mineNextX.push(blockX - 1);
          mineNextX.push(blockX - 1);
        }
        //mineX.push(blockX)
        ///mineX.push(blockX - 1)
        //mineX.push(blockX - 1)
        //blockposx.push(blockX)

        mineY.push(blockY);
        mineNextY.push(blockY);
        if (Settings.nukertype == 0) {
          mineY.push(blockY + 1);
          mineY.push(blockY);
          mineY.push(blockY + 1);

          mineNextY.push(blockY + 1);
          mineNextY.push(blockY);
          mineNextY.push(blockY + 1);
        }
        //mineY.push(blockY - 1)
        //mineY.push(blockY)
        //mineY.push(blockY - 1)
        //blockposy.push(blockY)

        mineZ.push(blockZ + 1);
        mineNextZ.push(blockZ + 1);
        /*if (Settings.nukertype == 0) {
          mineZ.push(blockZ + 1);
          mineZ.push(blockZ + 1);
          mineZ.push(blockZ + 1);

          mineNextZ.push(blockZ + 1);
          mineNextZ.push(blockZ + 1);
          mineNextZ.push(blockZ + 1);
        }*/
      }
    }
  }

  /*for (let m = 0; m < mineX.length; m++) {
    addBlock(World.getBlockAt(mineX[m], mineY[m], mineZ[m]));
  }*/
}

function distanceToPlayerHead(x, y, z) {
  let dX = Player.getX() - x;
  let dZ = Player.getZ() - z;
  let dY = Player.getY() + 1.25 - y;
  let dis = Math.sqrt(dX * dX + dZ * dZ);
  let dis2 = Math.sqrt(dis * dis + dY * dY);
  return dis2;
}

let checkbrokeny = [];
let checkbrokenz = [];

register("Tick", () => {
  if (!World.isLoaded) return;
  if (enabled == true) {
    canshift = true;

    if (first == true && cansend == true) {
      cansend = false;

      MC.field_71439_g.field_71174_a.func_147297_a(
        new C07PacketPlayerDigging(
          C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK,
          publicMinePos,
          EnumFacing.func_176733_a(
            Client.getMinecraft().field_71439_g.field_70177_z
          )
        )
      );

      if (canshift) {
        if (Player.getY() == Math.floor(Player.getY())) {
          canshift = false;
          checkbrokenx.push(mineX[0]);
          checkbrokeny.push(mineY[0]);
          checkbrokenz.push(mineZ[0]);
          /*mineX.splice(6, 0, mineX[0]);
            mineY.splice(6, 0, mineY[0]);
            mineZ.splice(6, 0, mineZ[0]);*/
          mineX.shift();
          mineY.shift();
          mineZ.shift();
        }
      }
    }

    if (Player.getHeldItem() != null) {
      //ChatLib.chat(mineX[0] + " " + mineY[0] + " " + mineZ[0]);
      if (
        distanceToPlayerHead(mineX[0], mineY[0], mineZ[0]) < 4 /*&&
        ChatLib.removeFormatting(
          Player.getHeldItem().getLore()[4].toString()
        ).includes("Mining Speed")*/
      ) {
        if (mineX.length > 0) {
          publicMinePos = new net.minecraft.util.BlockPos(
            mineX[0],
            mineY[0],
            mineZ[0]
          );

          renderToolBlock(mineX[0], mineY[0], mineZ[0]);

          if (publicMinePos != undefined) {
            if (
              !World.getBlockAt(mineX[0], mineY[0], mineZ[0])
                .toString()
                .includes("air") ||
              !World.getBlockAt(mineX[0], mineY[0], mineZ[0])
                .toString()
                .includes("cobble")
            ) {
              /*sendStart(
                publicMinePos,
                EnumFacing.func_176733_a(
                  Client.getMinecraft().field_71439_g.field_70177_z
                )
              );*/

              MC.field_71439_g.field_71174_a.func_147297_a(
                new C07PacketPlayerDigging(
                  C07PacketPlayerDigging.Action.START_DESTROY_BLOCK,
                  publicMinePos,
                  EnumFacing.func_176733_a(
                    Client.getMinecraft().field_71439_g.field_70177_z
                  )
                )
              );

              MC.field_71439_g.field_71174_a.func_147297_a(
                new C0APacketAnimation()
              );
              MC.field_71439_g.func_71038_i();

              nukerTickCounter = 0;

              first = true;
              cansend = true;
            } else {
              if (canshift) {
                canshift = false;

                checkbrokenx.push(mineX[0]);
                checkbrokeny.push(mineY[0]);
                checkbrokenz.push(mineZ[0]);

                mineX.splice(6, 0, mineX[0]);
                mineY.splice(6, 0, mineY[0]);
                mineZ.splice(6, 0, mineZ[0]);
                mineX.shift();
                mineY.shift();
                mineZ.shift();
              }

              nukerTickCounter = 0;
            }
          }
        }
      }
    }
  }

  if (checkbrokenx[0] != undefined) {
    if (
      World.getBlockAt(checkbrokenx[0], checkbrokeny[0], checkbrokenz[0])
        .toString()
        .includes("air")
    ) {
      checkbrokenx.shift();
      checkbrokeny.shift();
      checkbrokenz.shift();
    } else {
      mineX.push(checkbrokenx[0]);
      mineY.push(checkbrokeny[0]);
      mineZ.push(checkbrokenz[0]);
      checkbrokenx.shift();
      checkbrokeny.shift();
      checkbrokenz.shift();
    }
  }

  nukerTickCounter++;
});
