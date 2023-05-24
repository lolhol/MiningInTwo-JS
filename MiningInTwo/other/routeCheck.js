/** @format */

import Settings from "../data/config/config";
import { getBlockCoords } from "../functions/Blocks/blockCoords";
import { getBlocksAround } from "../functions/Blocks/getBlocksAround";
import { distanceToPlayerHead } from "../functions/MathUtils/distanceToPlayerHead";

register("worldLoad", () => {
  try {
    const scoreboard = Scoreboard.getLines();

    if (Settings.checkRoute) {
      for (let lineIndex = 0; lineIndex < scoreboard.length; lineIndex++) {
        if (scoreboard[lineIndex].toString().includes("Goblin")) {
          ChatLib.chat;
          check = true;
          break;
        }

        check = false;
      }
    } else {
      check = false;
    }

    ammountChecked++;
  } catch (e) {}
});

export function turnOnCheck() {
  check = true;
}

let ticks = 0;
let check = true;

register("Tick", () => {
  if (!World.isLoaded) return;

  if (ticks >= 2 && check == true) {
    let blockCoords = getBlockCoords().rDataCoords.default;

    if (
      distanceToPlayerHead(
        blockCoords[0].x,
        blockCoords[0].y,
        blockCoords[0].z
      ) <= 184
    ) {
      for (let i = 0; i < blockCoords.length - 1; i++) {
        let blockCheck = getBlocksAround(
          World.getBlockAt(
            blockCoords[i].x,
            blockCoords[i].y,
            blockCoords[i].z
          )
        );

        if (blockCheck == false) {
          check = false;
          ChatLib.chat(
            "&cTHERE IS A HIGH CHANCE THAT THE ROUTE HAS A STRUCTURE ON IT'S WAY!"
          );

          check = false;
          return;
        }
      }

      ChatLib.chat(
        "&aThe route likely does not have a structure on it's way!"
      );
      check = false;
    }

    ticks = 0;
  }

  if (check) ticks++;
});
