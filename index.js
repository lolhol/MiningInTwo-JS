/** @format */
/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { renderToolBlock } from "./debug_testing_dont_mind/debug";
import { lookAtSlowly } from "./functions/Looks/lookAtSlowly";
import { degreeToRadians } from "./functions/MathUtils/degreeToRadians";
import { mainBlockChecks } from "./functions/Blocks/getNearestBlocks";
import { getAnglePlayerToBlock } from "./functions/MathUtils/getAnglePlayerToBlock";
import "./commandKeyRegistries/keys";
import "./functions/Other/ESP";
import "./other/routeHelper";
import "./other/structureFinder";
import "./debug_testing_dont_mind/debug";
import "./other/renderLinesQOL";
import "./functions/Blocks/calculateBlocks";
import "./commandKeyRegistries/commands";
import "./functions/Other/playerFailsafe";
import { teleport } from "./teleportToNextBlock";
import { getState, setState } from "./functions/Other/state";

import Settings from "./data/config/config";

//HelperMode
import { helperSpinDrive } from "./other/helperMode";
import { getDrillSlot, getRodSlot } from "./functions/Items/getInvItems";
import { throwRod } from "./functions/Items/throwRod";
import { checkBlocksAround } from "./functions/Blocks/checkBlocksAround";
import { lookAndJump } from "./functions/Looks/lookAndJump";
import { setCurrentSlot } from "./functions/Other/setCurrentSlot";

export const C09PacketHeldItemChange = Java.type(
  "net.minecraft.network.play.client.C09PacketHeldItemChange"
);
const MC = Client.getMinecraft();
const JUMP = new KeyBind(MC.field_71474_y.field_74314_A);
const RIGHTCLICK = MC.getClass().getDeclaredMethod("func_147121_ag");

let angle = 0;
let playerYbe4;
let canCheckIfOnDillo = false;
let tickDilloCheckCount = 0;
let checkedNumber = 0;
let currentBlock;
let breakBlockCounter = 0;
let block;

RIGHTCLICK.setAccessible(true);

export function checkentity(entityname) {
  entityping = World.getPlayerByName(entityname.name).getPing();
  if (entityping == 1.0) {
    return false;
  } else {
    return true;
  }
}

function onStateSpinDrive() {
  let lookUnder = true;
  let random = Math.random();

  angle += 7 * random + 25;
  if (angle > 360) {
    angle = 0;
  }

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
      y -= 5;
    }

    let radians = degreeToRadians(angleTudaSuda);
    let dx = Math.cos(radians) * 5;
    let dz = Math.sin(radians) * 5;

    let x = block.getX() + dx + 0.5;
    let z = block.getZ() + dz + 0.5;

    if (
      currentBlock == null ||
      (currentBlock.getX() != block.getX() &&
        currentBlock.getY() != block.getY() &&
        currentBlock.getZ() != block.getZ())
    ) {
      breakBlockCounter = 0;
      currentBlock = block;
    } else {
      breakBlockCounter++;
    }

    if (breakBlockCounter == 60) {
      new Thread(() => {
        JUMP.setState(true);
        Thread.sleep(10);
        JUMP.setState(false);
      }).start();
    } else if (breakBlockCounter == 200) {
      ChatLib.chat("Could not break gemstone LLL");
      setState(null);
    }

    if (
      World.getBlockAt(Player.getX(), Player.getY() - 2, Player.getZ())
        .toString()
        .includes("stained_glass")
    ) {
      lookAtSlowly(x + 0.25, block.getY() - 13, z + 0.25, Settings.SPEED * 15);
    } else {
      if (lookUnder) {
        if (block.getY() > Player.getY()) {
          lookAndJump(
            [x + 0.25, block.getY() - 5, z + 0.25],
            Settings.SPEED * 15
          );
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
          lookAndJump([x + 0.25, y, z + 0.25], Settings.SPEED * 15);
        }

        lookAtSlowly(x + 0.25, y, z + 0.25, Settings.SPEED * 15);
      }
    }
  } else {
    setState("Teleporting");
  }
}

export function getBlockFromAngle(angle, dist) {
  let playerX = Player.getX();
  let playerZ = Player.getZ();

  angleFinder = angle;

  let dz = dist * Math.sin(degreeToRadians(angleFinder));
  let dx = dist * Math.cos(degreeToRadians(angleFinder));

  if (
    World.getBlockAt(playerX + dx, Player.getY() - 2.1125, playerZ + dz)
      .toString()
      .includes("stained_glass")
  ) {
    return World.getBlockAt(playerX + dx, Player.getY() - 2.1125, playerZ + dz);
  }
}

function onStateArmadillo() {
  if (checkBlocksAround()) {
    setState(null);
    throwRod();

    Player.setHeldItemIndex(getDrillSlot());

    playerYbe4 = Player.getY();
    RIGHTCLICK.invoke(MC);
    canCheckIfOnDillo = true;
  } else {
    setState("Teleporting");
  }
}

/*\[Lvl \d+\] \w+! VIEW RULE*/

register("Tick", () => {
  if (getState() == "helperSpinDrive") {
    helperSpinDrive();
  }

  if (getState() == "spinDrive") {
    onStateSpinDrive();
  }

  if (getState() == "armadillo") {
    onStateArmadillo();
  }

  if (getState() == "Teleporting") {
    teleport();
  }

  if (canCheckIfOnDillo) {
    if (tickDilloCheckCount == 5) {
      if (playerYbe4 + 0.7 < Player.getY()) {
        checkedNumber = 0;
        tickDilloCheckCount = 0;
        canCheckIfOnDillo = false;
        block = mainBlockChecks();

        setCurrentSlot(getDrillSlot(), 1);

        setState("spinDrive");
      } else {
        RIGHTCLICK.invoke(MC);
      }
    } else if (tickDilloCheckCount > 5) {
      tickDilloCheckCount = 0;
    }

    if (checkedNumber > 30) {
      checkedNumber = 0;
      tickDilloCheckCount = 0;
      canCheckIfOnDillo = false;
    } else {
      tickDilloCheckCount++;
      checkedNumber++;
    }
  }
});
