/** @format */

import { setState } from "../functions/Other/state";
import { lookAtSlowly } from "../functions/Looks/lookAtSlowly";
import { degreeToRadians } from "../functions/MathUtils/degreeToRadians";
import { throwRod } from "../functions/Items/throwRod";
import { getNearestBlocks } from "../functions/Blocks/getNearestBlocks";
import Settings from "../data/config/config";
import {
  renderToolBlock,
  renderToolAngle,
} from "../debug_testing_dont_mind/debug";
import { getAnglePlayerToBlock } from "../functions/MathUtils/getAnglePlayerToBlock";

const MC = Client.getMinecraft();
const JUMP = new KeyBind(MC.field_71474_y.field_74314_A);
const RIGHTCLICK = MC.getClass().getDeclaredMethod("func_147121_ag");
RIGHTCLICK.setAccessible(true);

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

let angle = 0;
let rodSlot;
let drillSlot;
let angleFinder = 0;

export function helperSpinDrive() {
  let lookUnder = true;
  let random = Math.random();
  angle += 7 * random + 25;
  if (angle > 360) {
    angle = 0;
  }

  let block = mainBlockChecksHelper();

  if (block) {
    let y = block.getY() - 0.5;

    let anglePlayerToBlock = getAnglePlayerToBlock(block);

    renderToolBlock(block.getX(), block.getY(), block.getZ());

    let angleTudaSuda = angle;

    if (anglePlayerToBlock !== null) {
      if (angleTudaSuda > Settings.rotationAnlge) {
        angleTudaSuda = 360 - angleTudaSuda;
      }
      angleTudaSuda += anglePlayerToBlock - 90;
    } else {
      lookUnder = false;
      y -= 13;
    }

    //renderToolAngle(angleTudaSuda);

    let radians = degreeToRadians(angleTudaSuda);
    let dx = Math.cos(radians) * 5;
    let dz = Math.sin(radians) * 5;

    let x = block.getX() + dx + 0.5;
    let z = block.getZ() + dz + 0.5;

    //ChatLib.chat(Player.getPlayer().field_70126_B);

    if (
      World.getBlockAt(Player.getX(), Player.getY() - 2, Player.getZ())
        .toString()
        .includes("stained_glass")
    ) {
      lookAtSlowly(x + 0.25, block.getY() - 13, z + 0.25, Settings.SPEED * 15);
    } else {
      if (lookUnder) {
        if (block.getY() > Player.getY()) {
          new Thread(() => {
            JUMP.setState(true);
            lookAtSlowly(
              x + 0.25,
              block.getY() - 5,
              z + 0.25,
              Settings.SPEED * 15
            );
            Thread.sleep(10);
            JUMP.setState(false);
          }).start();
        } else {
          lookAtSlowly(
            x + 0.25,
            block.getY() - 5,
            z + 0.25,
            Settings.SPEED * 15
          );
        }
      } else {
        if (block.getY() - 0.3 > Player.getY()) {
          new Thread(() => {
            JUMP.setState(true);
            lookAtSlowly(x + 0.25, y, z + 0.25, Settings.SPEED * 15);
            Thread.sleep(10);
            JUMP.setState(false);
          }).start();
        }

        lookAtSlowly(x + 0.25, y, z + 0.25, Settings.SPEED * 15);
      }
    }
  } else {
    throwRod();
    setState(null);
  }
}

function mainBlockChecksHelper() {
  let checks = false;
  let block;
  let radius = 0;
  let blockReturnList = getNearestBlocks();
  let blockMax = [];
  let turnBlockList = [];

  if (Settings.topToBottom) {
    blockReturnList = blockReturnList.sort((a, b) => {
      return b.getY() < a.getY() ? -1 : b.getY() > a.getY() ? 1 : 0;
    });
  }

  if (blockReturnList.length != 0) {
    for (let x = -radius; x <= radius; x++) {
      for (let y = -2; y <= 0; y++) {
        for (let z = -radius; z <= radius; z++) {
          let cobbleBlock = World.getBlockAt(
            Player.getX() + x,
            Player.getY() + y,
            Player.getZ() + z
          );

          if (cobbleBlock.toString().includes("cobblestone")) {
            checks = true;
          }
        }
      }
    }

    getBlockFromAngle(Player.getPlayer().field_70126_B, 1);

    for (let i = 0; i < blockReturnList.length; i++) {
      if (
        Math.abs(blockReturnList[i].getX() - Player.getX()) < 0.0001 &&
        Math.abs(blockReturnList[i].getZ() - Player.getZ())
      ) {
        if (blockReturnList.length > 1) {
          blockReturnList.splice(i, 1);
          i--;
        } else {
          setState(null);
        }
      }
    }

    if (checks == true) {
      for (let k = 0; k < blockReturnList.length; k++) {
        if (blockReturnList[k].getY() + 1.3 <= Player.getY()) {
          //ChatLib.chat(blockReturnList[k].getY() + 1.3 + " " + Player.getY());
          blockReturnList.splice(k, 1);
          k--;
        }
      }

      if (blockReturnList.length != 0) {
        block = blockReturnList.shift();
      } else {
        setState(null);
      }
    } else {
      if (Settings.blockReturnList != true) {
        if (blockReturnList.length != 0) {
          block = blockReturnList.shift();
        }
      } else {
        for (let i = 0; i < blockReturnList.length; i++) {
          blockMax.push(blockReturnList[i].getY());
        }

        block = blockMax.max();
        blockMax.splice(block);
      }
    }
    //ChatLib.chat(block.getY());

    if (block) {
      return block;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function getBlockFromAngle(angle, dist) {
  //let angleFinder = Player.getPlayer().field_70126_B;
  let random = Math.random();
  let playerX = Player.getX();
  let playerZ = Player.getZ();

  //angleFinder += 25;

  angleFinder = angle;
  //if (angleFinder == 360) {
  //angleFinder = 0;
  //}

  let dz = dist * Math.sin(degreeToRadians(angleFinder));
  let dx = dist * Math.cos(degreeToRadians(angleFinder));

  //renderToolBlock(playerX + dx, Player.getY() - 2.1125, playerZ + dz);

  if (
    World.getBlockAt(playerX + dx, Player.getY() - 2.1125, playerZ + dz)
      .toString()
      .includes("stained_glass")
  ) {
    //ChatLib.chat(angleFinder);
    return World.getBlockAt(playerX + dx, Player.getY() - 2.1125, playerZ + dz);
  }
}

export function helperArmadillo() {
  for (let i = 0; i < 8; i++) {
    if (
      ChatLib.removeFormatting(
        Player.getInventory().getStackInSlot(i)?.getName()
      ).includes("Rod")
    ) {
      rodSlot = i;
    }
  }

  for (let i = 0; i < 8; i++) {
    if (Player.getInventory().getStackInSlot(i) != null) {
      let itemPos = Player.getInventory().getStackInSlot(i).getName();
      let itemLore = Player.getInventory().getStackInSlot(i).getLore();
      for (let j = 0; j < itemLore.length; j++) {
        if (
          itemPos.toString().includes("Drill") ||
          itemPos.toString().includes("Gauntlet")
        ) {
          drillSlot = i;
        }
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    if (Player.getInventory().getStackInSlot(i) != null) {
      let itemPos = Player.getInventory().getStackInSlot(i).getName();
      let itemLore = Player.getInventory().getStackInSlot(i).getLore();
      for (let j = 0; j < itemLore.length; j++) {
        if (
          itemPos.toString().includes("Drill") ||
          itemPos.toString().includes("SkyBlock Menu")
        ) {
          SBMenuSlot = i;
        }
      }
    }
  }

  new Thread(() => {
    Thread.sleep(200 + Settings.ping);
    RIGHTCLICK.invoke(MC);
    Player.setHeldItemIndex(drillSlot);
    setState("helperSpinDrive");
  }).start();
}
