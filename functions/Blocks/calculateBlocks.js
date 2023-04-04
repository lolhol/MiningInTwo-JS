import { getBlockCoords } from "./blockCoords";
import Settings from "../../data/config/config";
import { renderToolBlock } from "../../debug_testing_dont_mind/debug";
import { distanceFromTo } from "../../other/routeHelper";

let MC = Client.getMinecraft();

let C07PacketPlayerDigging = Java.type(
  "net.minecraft.network.play.client.C07PacketPlayerDigging"
);

let EnumFacing = Java.type("net.minecraft.util.EnumFacing");

let C0APacketAnimation = Java.type(
  "net.minecraft.network.play.client.C0APacketAnimation"
);

let blockMine = [];
var publicMinePos = undefined;
let brokenBlox = [];

let cansend = false;
let enabled = false;
let routeToggle = false;

let blockCoords;

let nukerTickCounter = 0;

register("command", (...args) => {
  routeNuker();
}).setName("routenuker");

function routeNuker() {
  if (!routeToggle) {
    routeToggle = !routeToggle;
    blockMine = [];
    if (routeToggle) {
      makeArr();
    }
  }

  if (enabled == false) {
    ChatLib.chat("&aEnabled route nuker");
    enabled = true;
  } else if (enabled == true) {
    ChatLib.chat("&cDisabled route nuker");
    if (cansend == true) {
      cansend = false;

      MC.field_71439_g.field_71174_a.func_147297_a(
        new C07PacketPlayerDigging(
          C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK,
          publicMinePos,
          EnumFacing.func_176733_a(
            Client.getMinecraft().field_71439_g.field_70177_z
          )
        )
      );
    }

    enabled = false;
  }
}

export function makeArr() {
  if (Settings.macroSpot == 1)
    blockCoords = getBlockCoords().rDataCoords.custom;
  else blockCoords = getBlockCoords().rDataCoords.default;

  for (let i = 0; i < blockCoords.length - 1; i++) {
    calcBlocks(
      blockCoords[i].x,
      blockCoords[i].y + 1.54,
      blockCoords[i].z,
      blockCoords[i + 1].x,
      blockCoords[i + 1].y,
      blockCoords[i + 1].z
    );
  }

  if (Settings.nukerType == 1) {
    blockMine.sort((a, b) => {
      return distanceFromTo(
        b.getX(),
        b.getY(),
        b.getZ(),
        Player.getX(),
        Player.getY(),
        Player.getZ()
      ) >
        distanceFromTo(
          a.getX(),
          a.getY(),
          a.getZ(),
          Player.getX(),
          Player.getY(),
          Player.getZ()
        )
        ? 1
        : -1;
    });
  }
}

function calcBlocks(x1, y1, z1, x2, y2, z2) {
  if (Settings.nukerType == 0) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dz = z2 - z1;

    if (Math.abs(dz) < 0.000001) {
      dz = 0.000001;
    }

    let length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    let stepX = dx / length;
    let stepY = dy / length;
    let stepZ = dz / length;

    for (let i = 0; i < length; i++) {
      let newX = stepX * i + x1;
      let newY = stepY * i + y1;
      let newZ = stepZ * i + z1;

      for (let m = -1; m <= 1; m++) {
        for (let k = -1; k <= 1; k++) {
          for (let j = -1; j <= 1; j++) {
            let block = World.getBlockAt(newX + m, newY + j, newZ + k);
            blockMine.push(block);
          }
        }
      }
    }
  } else if (Settings.nukerType == 1) {
    let CYLINDER_RADIUS = 0.7;

    let dx = x2 - x1;
    let dy = y2 - y1;
    let dz = z2 - z1;

    if (Math.abs(dz) < 0.000001) {
      dz = 0.000001;
    }

    let length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    let stepX = dx / length;
    let stepY = dy / length;
    let stepZ = dz / length;

    let planeCoef = x1 * dx + y1 * dy + z1 * dz;

    let xN = 0;
    let yN = 0;
    let zN = planeCoef / dz;
    let dxN = xN - x1;
    let dyN = yN - y1;
    let dzN = zN - z1;
    let lenN = Math.sqrt(dxN * dxN + dyN * dyN + dzN * dzN);
    dxN = dxN / lenN;
    dyN = dyN / lenN;
    dzN = dzN / lenN;

    let dxM = dy * dzN - dz * dyN;
    let dyM = dz * dxN - dx * dzN;
    let dzM = dx * dyN - dy * dxN;
    let cLen = Math.sqrt(dxM * dxM + dyM * dyM + dzM * dzM);
    dxM = dxM / cLen;
    dyM = dyM / cLen;
    dzM = dzM / cLen;

    for (let degree = 0; degree < 360; degree += 20) {
      let angle = degree * (Math.PI / 180);
      let dxP = dxN * Math.cos(angle) + dxM * Math.sin(angle);
      let dyP = dyN * Math.cos(angle) + dyM * Math.sin(angle);
      let dzP = dzN * Math.cos(angle) + dzM * Math.sin(angle);

      for (let i = 0; i < length; i++) {
        let newX = stepX * i + x1 + dxP * CYLINDER_RADIUS;
        let newY = stepY * i + y1 + dyP * CYLINDER_RADIUS;
        let newZ = stepZ * i + z1 + dzP * CYLINDER_RADIUS;

        let block = World.getBlockAt(newX, newY, newZ);

        let found = false;

        for (let j = 0; j < blockMine.length; j++) {
          if (
            blockMine[j].getX() == block.getX() &&
            blockMine[j].getY() == block.getY() &&
            blockMine[j].getZ() == block.getZ()
          ) {
            found = true;
          }
        }

        if (found == false) {
          blockMine.push(block);
          blockMine.push(World.getBlockAt(x2, y2 + 2, z2));
        }
      }
    }
  }
}

function distanceToPlayerHead(x, y, z) {
  let dX = Player.getX() - x;
  let dZ = Player.getZ() - z;
  let dY = Player.getY() + 1.25 - y;
  let dis = Math.sqrt(dX * dX + dZ * dZ);
  let dis2 = Math.sqrt(dis * dis + dY * dY);
  return dis2;
}

let send = true;
let currentBlock;

export function shiftList() {
  return blockMine.shift();
}

register("Tick", () => {
  if (!World.isLoaded) return;
  if (enabled == true) {
    if (nukerTickCounter >= 5) {
      try {
        currentBlock = blockMine[0];
        let currentBlockPos = new net.minecraft.util.BlockPos(
          currentBlock.getX(),
          currentBlock.getY(),
          currentBlock.getZ()
        );

        let stringVers = World.getBlockAt(
          currentBlock.getX(),
          currentBlock.getY(),
          currentBlock.getZ()
        );

        renderToolBlock(
          currentBlock.getX(),
          currentBlock.getY(),
          currentBlock.getZ()
        );

        if (
          !stringVers.toString().includes("air") &&
          !stringVers.toString().includes("cobblestone") &&
          !stringVers.toString().includes("glass")
        ) {
          if (
            distanceToPlayerHead(
              currentBlock.getX(),
              currentBlock.getY(),
              currentBlock.getZ()
            ) < 4
          ) {
            if (send) {
              send = false;

              MC.field_71439_g.field_71174_a.func_147297_a(
                new C07PacketPlayerDigging(
                  C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK,
                  currentBlockPos,
                  EnumFacing.func_176733_a(
                    Client.getMinecraft().field_71439_g.field_70177_z
                  )
                )
              );

              //currentBlock = shiftList();
              brokenBlox.push(currentBlock);
            }

            MC.field_71439_g.field_71174_a.func_147297_a(
              new C07PacketPlayerDigging(
                C07PacketPlayerDigging.Action.START_DESTROY_BLOCK,
                currentBlockPos,
                EnumFacing.func_176733_a(
                  Client.getMinecraft().field_71439_g.field_70177_z
                )
              )
            );

            MC.field_71439_g.field_71174_a.func_147297_a(
              new C0APacketAnimation()
            );
            MC.field_71439_g.func_71038_i();

            send = true;
          }
        } else {
          currentBlock = shiftList();
        }
      } catch (e) {
        ChatLib.chat(e.toString());
        enabled = false;
      }
    }

    nukerTickCounter++;
  }
});
