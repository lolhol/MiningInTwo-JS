/** @format */

import {
  addBlockDeffRoute,
  addBlockRoute,
  clearBlockCoords,
  clearDeffRoute,
  cloneDefaultRoute,
  getBlockCoords,
  placeInMid,
  removePoint,
  reWriteLocalData,
} from "../functions/Blocks/blockCoords";
import {
  checkIfCobbleUnder,
  writeCobbleCoords,
} from "../functions/Blocks/underGemstone";

import Settings from "../data/config/config";

//HelperMode
import { helperArmadillo } from "../other/helperMode";
import { addBlock } from "../functions/Blocks/blocks";
import { throwRod } from "../functions/Items/throwRod";
import { replaceBlockCoord } from "../functions/Blocks/replaceBlock";
import { getCollisionBlock } from "../functions/MathUtils/blocksOnLine";
import {
  renderToolBlock,
  renderToolLine,
  renderToolPoint,
} from "../debug_testing_dont_mind/debug";
import RenderLib from "../../RenderLib";
import { lookAtSlowly } from "../functions/Looks/lookAtSlowly";
import { getPlayerSightCollisionBlock } from "../functions/MathUtils/adjustLook";
import { turnOnCheck } from "../other/routeCheck";
import { checkNuker, routeNuker } from "../other/pathNuker";
import { setupRule } from "../other/autoRule";

const MC = Client.getMinecraft();

let prefix = "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]";

register("command", (...args) => {
  routeNuker();
}).setName("routenuker");

register("command", (...args) => {
  checkNuker();
}).setName("checknuker");

register("command", (...args) => {
  if (args[0] == null) {
    ChatLib.chat("&l---------------------------------------");
    ChatLib.chat("&l         Mining In Two help ");

    ChatLib.chat(" ");
    ChatLib.chat("&l  To open menu, run /mit or /MiningInTwo");

    ChatLib.chat(" ");
    ChatLib.chat("&l  To see help for route nuker, run /helpnuker");

    ChatLib.chat(" ");
    ChatLib.chat("&l  To help with the dillo setup run /setuphelp");

    ChatLib.chat(" ");
    ChatLib.chat("&l  To help with the macro settings run /helpsetting");

    ChatLib.chat("&l         Mining In Two help ");
    ChatLib.chat("&l---------------------------------------");
  } else if (args[0] == "helpnuker") {
    ChatLib.chat("&l---------------------------------------");
    ChatLib.chat("&l         Mining In Two help ");

    ChatLib.chat(" ");
    ChatLib.chat("&l Asked questions...");

    ChatLib.chat(" ");
    ChatLib.chat("&l  1) ");

    ChatLib.chat(" ");
    ChatLib.chat("&l  To turn on nuker run /routenuker");

    ChatLib.chat("&l         Mining In Two help ");
    ChatLib.chat("&l---------------------------------------");
  }
}).setName("mithelp");

register("command", (...args) => {
  if (writeCobbleCoords() != false) {
    if (Settings.macroSpot == 1) {
      addBlockRoute();
      addBlock();

      ChatLib.chat("&l---------------------------------------");
      ChatLib.chat(prefix + " &lBlock Set!");
      ChatLib.chat("&l---------------------------------------");
    } else {
      ChatLib.chat("&l---------------------------------------");
      ChatLib.chat(prefix + " &lTurn on custom route in settings RN!!!");
      ChatLib.chat("&l---------------------------------------");
    }
  } else {
    ChatLib.chat("&l---------------------------------------");
    ChatLib.chat(
      prefix +
        " &lCould not find cobble block under vein! Place it and run /block again!"
    );
    ChatLib.chat("&l---------------------------------------");
  }
}).setName("block");

register("command", (...args) => {
  if (Settings.macroSpot == 1) {
    ChatLib.chat("&l---------------------------------------");
    ChatLib.chat(prefix + " &lRoute Cleared!");
    ChatLib.chat("&l---------------------------------------");

    clearBlockCoords();
  } else {
    ChatLib.chat("&l---------------------------------------");
    ChatLib.chat(prefix + " &lCan't clear default route...");
    ChatLib.chat("&l---------------------------------------");
  }
}).setName(Settings.clearCommand);

register("command", (...args) => {
  addBlockDeffRoute();
  ChatLib.chat("Done.");
}).setName("blockd");

register("command", (...args) => {
  clearDeffRoute();
  ChatLib.chat("Cleared!");
}).setName("cleard");

register("command", (...args) => {
  setupRule(args[0]);
}).setName("setupRule");

register("command", (...args) => {
  turnOnCheck();
}).setName("checkRoute");

register("command", (...args) => {
  if (Settings.macroSpot == 1) {
    if (args[0] == "True") {
      cloneDefaultRoute();

      ChatLib.chat("ROUTE CLONED!");
    } else {
      ChatLib.chat(
        "THIS WILL CLEAR YOUR DEFAULT ROUTE, YOU WON'T BE ABLE TO GET IT BACK! (run the command with - True - at the end eg. /cloneRoute True)"
      );
    }
  } else {
    ChatLib.chat("PLEASE SELECT THE DEFAULT ROUTE TO CLONE!");
  }
}).setName("cloneDefault");

register("command", (...args) => {
  if (Settings.macroSpot == 1) {
    let rData = getBlockCoords().rDataCoords.custom;

    if (args[0] - 1 <= rData.length) {
      removePoint(args[0]);
    } else {
      ChatLib.chat("PLEASE PROVIDE A VALID POINT!");
    }
  } else {
    ChatLib.chat("PLEASE SELECT THE DEFAULT ROUTE TO REMOVE POINTS!");
  }
}).setName("removePoint");

register("command", (...args) => {
  let point = getPlayerSightCollisionBlock(
    World.getBlockAt(871.5, 62.5, 389.5)
  );
  if (point) {
    lookAtSlowly(point[0], point[1], point[2], Settings.SPEED * 15);
  }
}).setName("x");

register("command", (...args) => {
  if (args[0] > 0) {
    if (checkIfCobbleUnder() != false) {
      if (replaceBlockCoord(args[0] - 1) == null) {
        ChatLib.chat("&l---------------------------------------------");
        ChatLib.chat(prefix + " Could not replace block :<");
        ChatLib.chat("&l---------------------------------------------");
      } else {
        ChatLib.chat("&l---------------------------------------------");
        ChatLib.chat(prefix + " Block replaced!");
        ChatLib.chat("&l---------------------------------------------");
      }
    } else {
      ChatLib.chat("&l---------------------------------------------");
      ChatLib.chat(
        prefix + " NO cobble under u found! place it and run again!!"
      );
      ChatLib.chat("&l---------------------------------------------");
    }
  } else {
    ChatLib.chat("&l---------------------------------------------");
    ChatLib.chat(prefix + " Could not replace block!");
    ChatLib.chat("&l---------------------------------------------");
  }
}).setName(Settings.replaceBlock);

register("command", (...args) => {
  if (Settings.guiText) {
    new Thread(() => {
      const clickableMessage = new Message(
        new TextComponent(
          "Click here to open the set of commands and their description."
        )
          .setClick(
            "open_url",
            "https://docs.google.com/document/d/18Lc9N7NxF8XNqUsuK2lrYIYfBPQTPXTNB7T1YM1ZBaE/edit?usp=sharing"
          )
          .setHoverAction("show_text")
      );

      ChatLib.chat(clickableMessage);
      ChatLib.chat("");
      ChatLib.chat(
        "THE MENU WILL OPEN IN 4 SEC! (turn this messege off in settings)"
      );

      Thread.sleep(4000);

      Settings.openGUI();
    }).start();
  } else {
    Settings.openGUI();
  }
}).setName("mit");

register("command", (...args) => {
  if (Settings.macroSpot == 1) {
    if (args[0] != null) {
      let rData = getBlockCoords().rDataCoords.custom;

      if (args[0] - 1 < rData.length) {
        if (
          World.getBlockAt(Player.getX(), Player.getY() - 1, Player.getZ())
            .toString()
            .includes("cobblestone")
        ) {
          placeInMid(args[0]);
        } else {
          ChatLib.chat("Please stand on a COBBLESTONE");
        }
      } else {
        ChatLib.chat("Please select a valid point!");
      }
    } else {
      ChatLib.chat(
        "Please write the format correctly! -- /addInMid <block number> --"
      );
    }
  } else {
    ChatLib.chat("Please select the 'custom' route!");
  }
}).setName("insertPoint");
