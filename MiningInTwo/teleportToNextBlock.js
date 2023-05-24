/** @format */

import {
  changeOfflineState,
  getOfflineState,
  getState,
  setState,
} from "./functions/Other/state";
import {
  getBlockCoordsAtPlayer,
  getBlockCoords,
} from "./functions/Blocks/blockCoords";
import Settings from "./data/config/config";
import { getAOTVSlot, getDrillSlot } from "./functions/Items/getInvItems";
import { throwRod } from "./functions/Items/throwRod";
import { getPlayerSightCollisionBlock } from "./functions/MathUtils/adjustLook";
import { lookAtSlowly } from "./functions/Looks/lookAtSlowly";
import { getCloseBlock } from "./functions/Blocks/getBlocksClose";
import { setCurrentBlock } from "./functions/Other/currentBlock";
import { getNearestBlocks } from "./functions/Blocks/checkBlocksAround";
import { bypassState } from "./functions/Blocks/getNearestBlocks";
export const mc = Client.getMinecraft();
export const EnumFacing = Java.type("net.minecraft.util.EnumFacing");
export const RightClick = new KeyBind(mc.field_71474_y.field_74313_G);
export const C08PacketPlayerBlockPlacement = Java.type(
  "net.minecraft.network.play.client.C08PacketPlayerBlockPlacement"
);
export const C0APacketAnimation = Java.type(
  "net.minecraft.network.play.client.C0APacketAnimation"
);
export const C09PacketHeldItemChange = Java.type(
  "net.minecraft.network.play.client.C09PacketHeldItemChange"
);
export const BP = Java.type("net.minecraft.util.BlockPos");
export const Jump = new KeyBind(mc.field_71474_y.field_74314_A);
export const Shift = new KeyBind(mc.field_71474_y.field_74311_E);
export const RightClickSingle = mc
  .getClass()
  .getDeclaredMethod("func_147121_ag");
RightClickSingle.setAccessible(true);

const MC = Client.getMinecraft();
const RIGHTCLICK = MC.getClass().getDeclaredMethod("func_147121_ag");
const SHIFT = new KeyBind(MC.field_71474_y.field_74311_E);
RIGHTCLICK.setAccessible(true);

let blockCords;
let canCheck = false;
let checkTickCounter = 0;
let retryCounter = 0;
let retryState = true;
let isOffTheDillo = false;
let playerYBe4;
let standingTickCounter = 0;
let pos;
let blockCoords;
let reSyncCounter = 0;

let tempCounter = 0;

export function teleport() {
  if (Settings.macroSpot == 1)
    blockCoords = getBlockCoords().rDataCoords.custom;
  else blockCoords = getBlockCoords().rDataCoords.default;

  pos = getBlockCoordsAtPlayer();

  if (getState()) {
    setState(null);

    if (blockCoords.length != 0) {
      playerYBe4 = Player.getY();

      SHIFT.setState(true);

      if (blockCoords.length == pos + 1) {
        blockCords = blockCoords[0];
      } else if (blockCoords.length > pos + 1) {
        blockCords = blockCoords[pos + 1];
      }

      throwRod();

      isOffTheDillo = true;
    }
  }
}

function checkIfOn() {
  if (
    Math.abs(Player.getX() - Math.floor(Player.getX())) - 0.5 < 0.001 &&
    Math.abs(Player.getZ() - Math.floor(Player.getZ())) - 0.5 < 0.001
  ) {
    return true;
  }

  return false;
}

function lookAtNextBlockSlow() {
  new Thread(() => {
    if (checkIfOn() == true) {
      reSyncCounter = 0;
      if (Settings.switchToAOTV) {
        Player.setHeldItemIndex(getAOTVSlot());
      }

      let block = getPlayerSightCollisionBlock(
        World.getBlockAt(blockCords.x, blockCords.y, blockCords.z)
      );

      //ChatLib.chat(block[0] + " " + block[1] + "" + block[2]);

      if (block) {
        lookAtSlowly(block[0], block[1], block[2], Settings.smoothLook);
        //lookAtBlockTP(Settings.smoothLook);

        Thread.sleep(Settings.smoothLook * 2.5);
        Thread.sleep(Settings.AOTVdelay);

        if (getOfflineState() != "offline") {
          nextBlock();
        }
      } else {
        let tf = false;
        ChatLib.chat("Found no tp able locations.");

        blocks = getNearestBlocks();
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].toString().includes("glass_pane")) {
            tf = true;
            bypassState(true);
            SHIFT.setState(false);
            setState("armadillo");
            return;
          }
        }

        setState(null);
      }
    } else {
      if (getOfflineState() != "offline") {
        reSync(pos);
      }
    }
  }).start();
}

export function nextBlock() {
  new Thread(() => {
    let currentSlot = Player.getHeldItemIndex();

    if (!Settings.switchToAOTV) {
      mc.field_71439_g.field_71174_a.func_147297_a(
        new C09PacketHeldItemChange(getAOTVSlot())
      );
    }

    mc.field_71439_g.field_71174_a.func_147297_a(
      new C08PacketPlayerBlockPlacement(
        new BP(-1, -1, -1),
        255,
        Player.getInventory().getStackInSlot(getAOTVSlot()).getItemStack(),
        0,
        0,
        0
      )
    );

    Thread.sleep(Settings.ping);

    mc.field_71439_g.field_71174_a.func_147297_a(
      new C09PacketHeldItemChange(currentSlot)
    );

    Shift.setState(false);

    canCheck = true;
    retryState = true;
  }).start();
}

function reSync() {
  new Thread(() => {
    let blockCoords;

    if (Settings.macroSpot == 1)
      blockCoords = getBlockCoords().rDataCoords.custom;
    else blockCoords = getBlockCoords().rDataCoords.default;

    let currBlockPos;

    for (let i = 0; i < blockCoords.length - 1; i++) {
      if (
        Math.abs(blockCoords[i].x - blockCords.x) < 0.0001 &&
        Math.abs(blockCoords[i].z - blockCords.z) < 0.0001 &&
        Math.abs(blockCoords[i].y - blockCords.y) < 0.0001
      ) {
        if (i != 0) {
          currBlockPos = i - 1;
        } else {
          currBlockPos = i;
        }

        break;
      }
    }

    if (reSyncCounter < 3) {
      ChatLib.chat("OUT OF SYNC with the armadillo! Re-Syncing.");
      let currentSlot = Player.getHeldItemIndex();

      Shift.setState(true);
      lookAtSlowly(
        blockCoords[currBlockPos].x,
        blockCoords[currBlockPos].y,
        blockCoords[currBlockPos].z,
        200
      );

      Thread.sleep(600);

      mc.field_71439_g.field_71174_a.func_147297_a(
        new C09PacketHeldItemChange(getAOTVSlot())
      );

      mc.field_71439_g.field_71174_a.func_147297_a(
        new C08PacketPlayerBlockPlacement(
          new BP(-1, -1, -1),
          255,
          Player.getInventory().getStackInSlot(getAOTVSlot()).getItemStack(),
          0,
          0,
          0
        )
      );

      mc.field_71439_g.field_71174_a.func_147297_a(
        new C09PacketHeldItemChange(currentSlot)
      );

      throwRod();

      Thread.sleep(600);

      lookAtNextBlockSlow();

      reSyncCounter++;
    }
  }).start();
}

register("Tick", () => {
  if (canCheck) {
    if (getState() == null) {
      if (checkTickCounter < 50) {
        if (
          Math.abs(Player.getX() - blockCords.x) <= 0.000001 &&
          Math.abs(Player.getZ() - blockCords.z) <= 0.000001
        ) {
          Shift.setState(false);

          MC.field_71439_g.field_71174_a.func_147297_a(
            new C09PacketHeldItemChange(getDrillSlot())
          );
          Player.setHeldItemIndex(getDrillSlot());

          canCheck = false;
          checkTickCounter = 0;
          playerYBe4 = Player.getY();

          retryCounter = 0;

          //Player.getPlayer().field_70177_z = 3;
          Player.getPlayer().field_70125_A = 4;

          setCurrentBlock(
            World.getBlockAt(blockCords.x, blockCords.y, blockCords.z)
          );

          bypassState(false);

          if (getOfflineState() != "offline") {
            setState("armadillo");
          }
        }
      } else {
        checkTickCounter = 0;
        canCheck = false;

        if (retryCounter != Settings.reTpTimes && retryState && Settings.reTp) {
          ChatLib.chat("Can't TP LLL (re-Tping tho).");
          Player.getPlayer().field_70177_z =
            Player.getPlayer().field_70177_z + 40;

          if (getOfflineState() != "offline") {
            setState("re-Teleport");
            teleport();
          }

          retryCounter++;
        } else {
          retryState = false;
          retryCounter = 0;
        }
      }
    }

    checkTickCounter++;
  }

  if (isOffTheDillo) {
    if (checkTickCounter < 50) {
      if (Math.abs(Player.getY() - Math.floor(Player.getY()) < 0.0001)) {
        standingTickCounter++;
      } else {
        standingTickCounter = 0;
        SHIFT.setState(true);
      }

      if (standingTickCounter) {
        if (getOfflineState() != "offline") {
          throwRod();
          isOffTheDillo = false;
          checkTickCounter = 0;
          SHIFT.setState(true);

          new Thread(() => {
            if (Settings.regenWait == true) {
              if (pos == 0) Thread.sleep(Settings.regenWaitTime);
            }

            Thread.sleep(50);

            lookAtNextBlockSlow();
          }).start();
        }
      }
    } else {
      ChatLib.chat("Cant get off the dillo :/");

      checkTickCounter = 0;
      isOffTheDillo = false;

      SHIFT.setState(false);
    }

    checkTickCounter++;
  }
});
