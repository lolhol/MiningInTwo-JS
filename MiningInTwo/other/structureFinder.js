// This code is not mine it is by "Ninjune#0670". Thank You Thank You my dude.

// AGAIN, THIS ISN'T MY CODE, CREDITS GOES TO Ninjune#0670

import Async from "../../Async";
import RenderLib from "../../RenderLib/index";
import PogObject from "../../PogData/index";
import Settings from "../data/config/config";

const Minecraft = Java.type("net.minecraft.client.Minecraft");
let renderBlocks = [],
  promise,
  time;

let data = new PogObject(
  "StructureFinder",
  {
    searching: false,
  },
  "config.json"
);
const PREFIX = "&7[&aSF&7] ",
  renderDistance = Minecraft.func_71410_x().field_71474_y.field_151451_c * 16;

function findStructures(fromTimeout = false) {
  if (promise != null && !promise.isFinished() && fromTimeout == false) {
    if (!fromTimeout) ChatLib.chat(`${PREFIX}&cAlready searching!`);
    return;
  } else if (promise != null && !promise.isFinished()) return;

  if (checkInHollows() == false) return;
  //ChatLib.chat(`${PREFIX}&bStarting search...`);
  time = Date.now();
  let x = xCalc(),
    y = yCalc(),
    z = zCalc();
  const xLimit = Math.round(Player.getX()) + 0.5 + renderDistance,
    zLimit = Math.round(Player.getZ()) + 0.5 + renderDistance;

  promise = Async.run(() => {
    while (true) {
      if (x <= xLimit && x < 824) {
        x++;
      } else if (z <= zLimit && z < 824) {
        x = xCalc();
        z++;
      } else if (y < 190) {
        x = xCalc();
        z = zCalc();
        y++;
      } else return;

      if (
        World.getBlockAt(x, y, z).type.getRegistryName() !==
        "minecraft:double_stone_slab"
      )
        continue;
      if (
        World.getBlockAt(x + 1, y, z).type.getRegistryName() !==
        "minecraft:double_stone_slab"
      )
        continue;
      if (
        World.getBlockAt(x + 1, y - 1, z).type.getRegistryName() !==
        "minecraft:stone"
      )
        continue;
      if (
        World.getBlockAt(x + 2, y, z).type.getRegistryName() !==
        "minecraft:double_stone_slab"
      )
        continue;
      if (
        World.getBlockAt(x + 2, y - 1, z).type.getRegistryName() !==
        "minecraft:double_stone_slab"
      )
        continue;
      if (
        World.getBlockAt(x + 3, y, z).type.getRegistryName() !== "minecraft:air"
      )
        continue;
      if (
        World.getBlockAt(x, y - 1, z).type.getRegistryName() !==
        "minecraft:stone_slab"
      )
        continue;
      if (
        !(
          World.getBlockAt(x + 2, y, z - 2).type.getRegistryName() ===
            "minecraft:stained_hardened_clay" ||
          World.getBlockAt(x, y + 3, z - 2).type.getRegistryName() ===
            "minecraft:double_stone_slab"
        )
      )
        continue;
      let continueOverall = false;
      for (let i = 0; i < renderBlocks.length; i++) {
        if (renderBlocks[i][0] != x) continue;
        if (renderBlocks[i][1] != y) continue;
        if (renderBlocks[i][2] != z) continue;
        continueOverall = true;
      }
      if (continueOverall) continue;
      ChatLib.chat("&l---------------------------------------------");
      ChatLib.chat(
        "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" +
          " &lFound Dillo structure at" +
          Math.round(x) +
          ", " +
          Math.round(y) +
          ", " +
          Math.round(z)
      );
      ChatLib.chat("&l---------------------------------------------");
      /*ChatLib.chat(
        `${PREFIX}&bFound structure at &a${Math.round(x)} ${Math.round(
          y
        )} ${Math.round(z)}`
      );*/
      renderBlocks.push([x, y, z]);
      return;
    }
  });
}

register("command", (...args) => {
  switch (args[0]) {
    case "help":
      ChatLib.chat(
        `/sf find - Finds structure.\n/sf toggle - Toggles structure visibility and finding automatically of structures.\n`
      );
      break;
    case "find":
      if (!checkInHollows())
        return ChatLib.chat(`${PREFIX}&cNot in the Crystal Hollows.`);
      if (!data.searching) {
        data.searching = true;
        data.save();
        ChatLib.chat(
          `${PREFIX}&aStructures set to being shown. /sf toggle to hide.`
        );
      }
      findStructures();
      break;
    case "toggle":
      if (!data.searching) {
        data.searching = true;
        ChatLib.chat(`${PREFIX}&aStructures set to being shown.`);
      } else {
        data.searching = false;
        ChatLib.chat(`${PREFIX}&aStructures set to being hidden.`);
      }
      data.save();
      break;
    case "showing":
      ChatLib.chat(data.searching);
      break;
    default:
      ChatLib.chat(`${PREFIX}&cUnkown command. /sf help for help.`);
  }
})
  .setTabCompletions((args) => {
    let output = [],
      commands = ["help", "find", "toggle"];

    if (args[0] == undefined) output = commands;
    else {
      commands.forEach((command) => {
        for (let char = 0; char < args[0].length; char++) {
          if (command[char] != args[0][char]) break;
          else if (char == args[0].length - 1) output.push(command);
        }
      });
    }
    return output;
  })
  .setCommandName("sf")
  .setAliases(["structurefinder", "sfinder"]);

/*
register("command", () => { // debug command
    ChatLib.chat(Player.lookingAt().type.getRegistryName())
}).setCommandName("blockfind")


register("command", () => { // debug command
    let tempTime = Date.now()
    ChatLib.chat(Date.now() - tempTime)
}).setCommandName("timetest")*/

let structStart = false;
register("tick", () => {
  if (promise != null) {
    if (promise.isFinished()) {
      /*ChatLib.chat(
        `${PREFIX}&bFinished searching. Took ${(Date.now() - time) / 1000}s`
      );*/
      promise = null;
    }
  }

  if (structStart == false) {
    if (Settings.findStructure == true) {
      ChatLib.chat("&l---------------------------------------------");
      ChatLib.chat(
        "&l[&4&lMi&e&lni&2&lng &d&lIn &5&lTw&b&lo&f&l]" + " &lStarted Search!"
      );
      ChatLib.chat("&l---------------------------------------------");

      structStart = true;
    }
  }

  if (Settings.findStructure == true) {
    if (
      checkInHollows() == true &&
      renderBlocks.length < 1 &&
      (promise == null || promise.isFinished())
    ) {
      data.searching = true;
      findStructures(true);
    }
  } else {
    data.searching = false;
  }
});

register("worldLoad", () => {
  renderBlocks = [];
  setTimeout(() => {}, 3000);
});

register("renderWorld", () => {
  if (renderBlocks.length < 1 || !data.searching) return;
  for (let i = 0; i < renderBlocks.length; i++) {
    RenderLib.drawEspBox(
      renderBlocks[i][0],
      renderBlocks[i][1],
      renderBlocks[i][2],
      1,
      1,
      0,
      1,
      1,
      1,
      true
    );

    trace(
      renderBlocks[i][0],
      renderBlocks[i][1],
      renderBlocks[i][2],
      0,
      1,
      1,
      1
    );
  }
});

const locations = [
  "Goblin",
  "Jungle",
  "Mithril",
  "Precursor",
  "Magma",
  "Crystal",
  "Khazad",
  "Divan",
  "City",
];

function checkInHollows() {
  const scoreboard = Scoreboard.getLines();

  for (let lineIndex = 0; lineIndex < scoreboard.length; lineIndex++) {
    for (
      let locationsIndex = 0;
      locationsIndex < locations.length;
      locationsIndex++
    ) {
      if (scoreboard[lineIndex].toString().includes(locations[locationsIndex]))
        return true;
    }
  }

  return false;
}

function xCalc() {
  if (Math.round(Player.getX()) + 0.5 - renderDistance >= 512)
    return Math.round(Player.getX()) + 0.5 - renderDistance;
  else return 512.5;
}

function yCalc() {
  return 32.5;
}

function zCalc() {
  if (Math.round(Player.getY()) + 0.5 - renderDistance >= 512)
    return Math.round(Player.getY()) + 0.5 - renderDistance;
  else return 512.5;
}

function trace(x, y, z, red, green, blue, alpha) {
  GL11.glLineWidth(2.0);
  GlStateManager.func_179090_x(); // disableTexture2D

  Tessellator.begin(1).colorize(red, green, blue, alpha);
  if (Player.isSneaking())
    Tessellator.pos(
      Player.getRenderX(),
      Player.getRenderY() + 1.54,
      Player.getRenderZ()
    ).tex(0, 0);
  else
    Tessellator.pos(
      Player.getRenderX(),
      Player.getRenderY() + 1.6203,
      Player.getRenderZ()
    ).tex(0, 0);
  Tessellator.pos(x, y, z).tex(0, 0);
  Tessellator.draw();

  GlStateManager.func_179098_w(); // enableTexture2D
}
