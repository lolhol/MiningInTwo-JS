import RenderLib from "../../RenderLib/";
import { degreeToRadians } from "../functions/MathUtils/degreeToRadians";

let tx = null;
let ty = null;
let tz = null;
let angle1 = null;

let px = null;
let py = null;
let pz = null;

let la = null;
let lb = null;

let lines = [];
let blocks = [];
let points = [];

export function addLine(x1, y1, z1, x2, y2, z2) {
  lines.push([x1, y1, z1, x2, y2, z2]);
}

export function renderToolBlock(x, y, z) {
  tx = Math.floor(x);
  ty = Math.floor(y);
  tz = Math.floor(z);
}

export function addPoint(x, y, z) {
  points.push([x, y, z]);
}

export function renderToolPoint(x, y, z) {
  px = x;
  py = y;
  pz = z;
}

export function addBlock(block) {
  blocks.push(block);
}

export function resetBlocks() {
  blocks = [];
}

export function resetLines() {
  lines = [];
}

export function renderToolLine(x1, y1, z1, x2, y2, z2) {
  la = [x1, y1, z1];
  lb = [x2, y2, z2];
}

export function renderToolAngle(angle) {
  angle1 = angle;
}

register("renderWorld", () => {
  if (!World.isLoaded) return;

  if (tx !== null) {
    RenderLib.drawEspBox(tx + 0.5, ty, tz + 0.5, 1, 1, 0, 1, 0, 1, true);
  }

  if (la !== null) {
    Tessellator.disableTexture2D();
    Tessellator.begin(GL11.GL_LINES, false);

    try {
      Tessellator.pos(la[0], la[1], la[2]).pos(lb[0], lb[1], lb[2]);
    } catch (e) {
      ChatLib.chat("e");
    }

    Tessellator.draw();
    Tessellator.enableTexture2D();
  }

  if (px !== null) {
    drawPoint(px, py, pz);
  }

  for (let i = 0; i < points.length; i++) {
    drawPoint(points[i][0], points[i][1], points[i][2]);
  }

  if (blocks.length > 0) {
    for (let i = 0; i < blocks.length; i++) {
      RenderLib.drawEspBox(
        blocks[i].getX() + 0.5,
        blocks[i].getY(),
        blocks[i].getZ() + 0.5,
        1,
        1,
        0,
        1,
        0,
        1,
        true
      );
    }
  }

  if (angle1 !== null) {
    Tessellator.disableTexture2D();
    Tessellator.begin(GL11.GL_LINES, false);

    let radians = degreeToRadians(angle1);
    let dx = Math.cos(radians);
    let dz = Math.sin(radians);
    let length = 5;

    try {
      Tessellator.pos(Player.getX(), Player.getY(), Player.getZ()).pos(
        Player.getX() + dx * length,
        Player.getY(),
        Player.getZ() + dz * length
      );
    } catch (e) {
      ChatLib.chat("e");
    }

    Tessellator.draw();
    Tessellator.enableTexture2D();
  }

  for (i = 0; i < lines.length; i++) {
    Tessellator.disableTexture2D();
    Tessellator.begin(GL11.GL_LINES, false);

    let line = lines[i];
    try {
      Tessellator.pos(line[0], line[1], line[2]).pos(line[3], line[4], line[5]);
    } catch (e) {
      ChatLib.chat("e");
    }

    Tessellator.draw();
    Tessellator.enableTexture2D();
  }
});

function drawPoint(px, py, pz) {
  Tessellator.disableTexture2D();
  Tessellator.begin(GL11.GL_LINES, false);

  try {
    Tessellator.pos(px, py, pz).pos(px + 0.1, py, pz + 0.1);
    Tessellator.pos(px, py, pz).pos(px - 0.1, py, pz - 0.1);
    Tessellator.pos(px, py, pz).pos(px + 0.1, py, pz - 0.1);
    Tessellator.pos(px, py, pz).pos(px - 0.1, py, pz + 0.1);
    Tessellator.pos(px, py, pz).pos(px, py + 0.1, pz);
    Tessellator.pos(px, py, pz).pos(px, py - 0.1, pz);
  } catch (e) {
    ChatLib.chat("e");
  }

  Tessellator.draw();
  Tessellator.enableTexture2D();
}
