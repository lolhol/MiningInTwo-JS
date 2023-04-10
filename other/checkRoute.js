import Settings from "../data/config/config";
import { getBlockCoords } from "../functions/Blocks/blockCoords";
import { distanceToPlayerHead } from "../functions/Blocks/calculateBlocks";
import { getBlocksAround } from "../functions/Blocks/getBlocksAround";
import { distanceFromTo } from "./routeHelper";

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
    if (Settings.macroSpot == 0) {
      let blockCoords = getBlockCoords().rDataCoords.default;

      if (
        distanceToPlayerHead(
          blockCoords[0].x,
          blockCoords[0].y,
          blockCoords[0].z
        ) <= 50
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
            ChatLib.chat(i);
            ChatLib.chat(
              "&cTHERE IS A HIGH CHANCE THAT THE ROUTE HAS A STRUCTURE ON IT'S WAY!"
            );
            break;
          }
        }

        ChatLib.chat(
          "&aThe route likely does not have a structure on it's way!"
        );
        check = false;
      }
    } else {
      check = false;
    }

    ticks = 0;
  }

  if (check) ticks++;
});
