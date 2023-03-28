/** @format */

import { lookAtBlockTP } from "./functions/lookAtBlockTP";
import { getState, getTickSinceStateChange, setState } from "./functions/state";
import { getBlockCoordsAtPlayer, getBlockCoords } from "./utils/blockCoords";
import Settings from "./data/config/config";
import { getAOTVSlot, getRodSlot, getDrillSlot } from "./functions/getInvItems";
import { throwRod } from "./functions/throwRod";
import { adjustLook } from "./functions/adjustLook";
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

export function teleport() {
  let blockCoords;

  if (Settings.macroSpot == 1)
    blockCoords = getBlockCoords().rDataCoords.custom;
  else blockCoords = getBlockCoords().rDataCoords.default;

  let pos = getBlockCoordsAtPlayer();

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

function lookAtNextBlockSlow() {
  new Thread(() => {
    Thread.sleep(Settings.AOTVdelay);

    if (Settings.switchToAOTV) {
      Player.setHeldItemIndex(getAOTVSlot());
    }

    /*lookAtBlockTP(
      blockCords.x,
      blockCords.y - 1,
      blockCords.z,
      Settings.smoothLook
    );*/

    let block = adjustLook(
      World.getBlockAt(blockCords.x, blockCords.y - 1, blockCords.z)
    );

    if (block) {
      lookAtBlockTP(
        block.getX(),
        block.getY(),
        block.getZ(),
        Settings.smoothLook
      );

      Thread.sleep(Settings.smoothLook + Settings.AOTVdelay);

      nextBlock();
    } else {
      ChatLib.chat("Found no tp able locations.");
      setState(null);
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

          setState("armadillo");
        }
      } else {
        checkTickCounter = 0;
        canCheck = false;

        if (retryCounter != Settings.reTpTimes && retryState && Settings.reTp) {
          ChatLib.chat("Can't TP LLL (re-Tping tho).");
          setState("re-Teleport");
          teleport();

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
      if (Math.abs(Player.getY() - playerYBe4) >= 0.048) {
        playerYBe4 = playerYBe4 - 0.5;
      }

      if (
        (Math.abs(playerYBe4 - Player.getY()) <= 0.0001 ||
          Math.abs(playerYBe4 - Player.getY()) >= 1.11245) &&
        checkTickCounter == 10
      ) {
        isOffTheDillo = false;
        checkTickCounter = 0;
        SHIFT.setState(true);

        new Thread(() => {
          if (Settings.regenWait == true) {
            if (pos == 0) Thread.sleep(Settings.regenWaitTime);
          }

          lookAtNextBlockSlow();
        }).start();
      } else {
        SHIFT.setState(true);
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
