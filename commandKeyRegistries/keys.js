/** @format */

import { routeHelper } from "../other/routeHelper";
import { checkBlock } from "../utils/checkLocation";
import { addBlockRoute } from "../utils/blockCoords";
import { getState, setState } from "../functions/state";

import Settings from "../data/config/config";

import { helperArmadillo } from "../other/helperMode";
import { addBlock } from "../functions/blocks";
import { getDrillSlot } from "../functions/getInvItems";
import { throwRod } from "../functions/throwRod";
import { checkInv } from "../functions/checkIfItemsInInv";

register("Tick", () => {
  if (menuKeybind.isPressed() == true) {
    Settings.openGUI();
  }

  if (helperKeybind.isPressed() == true) {
    if (getState()) {
      throwRod();
      setState(null);
    } else {
      throwRod();
      helperArmadillo();
    }
  }

  if (AddBlockKeyBind.isPressed() == true) {
    addBlockRoute();
    addBlock();

    ChatLib.chat("&l---------------------------------------");
    ChatLib.chat(
      "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" + " &lBlock Set!"
    );
    ChatLib.chat("&l---------------------------------------");
  }

  if (routeHelperBind.isPressed() == true) {
    routeHelper();
  }

  if (jKeyBind.isPressed()) {
    if (getState()) {
      setState(null);
    } else {
      if (checkInv()) {
        playerPosition = Player.getY();
        Player.setHeldItemIndex(getDrillSlot());

        if (checkBlock("getBlock") == "startMacro") {
          ChatLib.chat("&l---------------------------------------------");
          ChatLib.chat(
            "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" +
              " &lStarting macro!"
          );
          ChatLib.chat("&l---------------------------------------------");

          setState("armadillo");
        } else {
          ChatLib.chat("&l---------------------------------------------");
          ChatLib.chat(
            "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" +
              " &lYou are not on the right block!"
          );
          ChatLib.chat("&l---------------------------------------------");
        }
      } else {
        ChatLib.chat(
          "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l] &lCould not find some items! (u need -> 1 Rod, 1 Drill / Gauntlet, 1 AOTV)"
        );
      }
    }
  }
});

let menuKeybind = new KeyBind(
  "Open MiningInTwo Menu",
  Keyboard.KEY_NONE,
  "MiningInTwo"
);

let routeHelperBind = new KeyBind(
  "Turn on Route Helper",
  Keyboard.KEY_NONE,
  "MiningInTwo"
);

let AddBlockKeyBind = new KeyBind(
  "Add Block To Route",
  Keyboard.KEY_NONE,
  "MiningInTwo"
);

let helperKeybind = new KeyBind(
  "Helper Mode Trigger",
  Keyboard.KEY_NONE,
  "MiningInTwo"
);

let jKeyBind = new KeyBind(
  "Start Automatic Maco",
  Keyboard.KEY_NONE,
  "MiningInTwo"
);
