/** @format */

import {
  addBlockDeffRoute,
  addBlockRoute,
  clearBlockCoords,
  clearDeffRoute,
  reWriteLocalData,
} from "../utils/blockCoords";
import { checkIfCobbleUnder, writeCobbleCoords } from "../utils/underGemstone";

import Settings from "../data/config/config";

//HelperMode
import { helperArmadillo } from "../other/helperMode";
import { addBlock } from "../functions/blocks";
import { throwRod } from "../functions/throwRod";
import { replaceBlockCoord } from "../utils/replaceBlock";
import { getCollisionBlock } from "../functions/blocksOnLine";
import {
  renderToolBlock,
  renderToolLine,
  renderToolPoint,
} from "../debug_testing_dont_mind/debug";
import RenderLib from "../../RenderLib";
import { lookAtSlowly } from "../functions/lookAtSlowly";
import { adjustLook } from "../functions/adjustLook";

const MC = Client.getMinecraft();

register("command", (...args) => {
  if (writeCobbleCoords() != false) {
    if (Settings.macroSpot == 1) {
      addBlockRoute();
      addBlock();

      ChatLib.chat("&l---------------------------------------");
      ChatLib.chat(
        "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" + " &lBlock Set!"
      );
      ChatLib.chat("&l---------------------------------------");
    } else {
      ChatLib.chat("&l---------------------------------------");
      ChatLib.chat(
        "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" +
          " &lTurn on custom route in settings RN!!!"
      );
      ChatLib.chat("&l---------------------------------------");
    }
  } else {
    ChatLib.chat("&l---------------------------------------");
    ChatLib.chat(
      "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" +
        " &lCould not find cobble block under vein! Place it and run /block again!"
    );
    ChatLib.chat("&l---------------------------------------");
  }
}).setName("block");

register("command", (...args) => {
  if (Settings.macroSpot == 1) {
    ChatLib.chat("&l---------------------------------------");
    ChatLib.chat(
      "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" + " &lRoute Cleared!"
    );
    ChatLib.chat("&l---------------------------------------");

    clearBlockCoords();
  } else {
    ChatLib.chat("&l---------------------------------------");
    ChatLib.chat(
      "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" +
        " &lCan't clear default route..."
    );
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
  ChatLib.chat("Turn this on in settings!");
}).setName("render");

register("command", (...args) => {
  Settings.openGUI();
}).setName("mit");

register("command", (...args) => {
  Settings.openGUI();
}).setName("MiningInTwo");

register("command", (...args) => {
  let point = adjustLook(World.getBlockAt(871.5, 62.5, 389.5));
  if (point) {
    lookAtSlowly(point[0], point[1], point[2]);
  }
}).setName("x");

register("command", (...args) => {
  if (args[0] > 0) {
    if (checkIfCobbleUnder() != false) {
      if (replaceBlockCoord(args[0] - 1) == null) {
        ChatLib.chat("&l---------------------------------------------");
        ChatLib.chat(
          "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" +
            " Could not replace block :<"
        );
        ChatLib.chat("&l---------------------------------------------");
      } else {
        ChatLib.chat("&l---------------------------------------------");
        ChatLib.chat(
          "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" + " Block replaced!"
        );
        ChatLib.chat("&l---------------------------------------------");
      }
    } else {
      ChatLib.chat("&l---------------------------------------------");
      ChatLib.chat(
        "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" +
          " NO cobble under u found! place it and run again!!"
      );
      ChatLib.chat("&l---------------------------------------------");
    }
  } else {
    ChatLib.chat("&l---------------------------------------------");
    ChatLib.chat(
      "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" +
        " Could not replace block!"
    );
    ChatLib.chat("&l---------------------------------------------");
  }
}).setName(Settings.replaceBlock);

register("command", (...args) => {
  Settings.openGUI();
}).setName("miningintwo");

/*register("renderWorld", () => {
  let vec = [237.5, 100.5, 409.5];

  let block = getCollisionBlock(
    Player.getX(),
    Player.getY() + 1.54,
    Player.getZ(),
    vec[0],
    vec[1],
    vec[2]
  );

  renderToolLine(
    Player.getX(),
    Player.getY() + 1.54,
    Player.getZ(),
    vec[0],
    vec[1],
    vec[2]
  );

  if (block) {
    renderToolBlock(block.getX(), block.getY(), block.getZ());
  } else {
    renderToolBlock(0, 0, 0);
  }
});*/
