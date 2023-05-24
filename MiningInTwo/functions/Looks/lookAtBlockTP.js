/** @format */

import { radiansToDegree } from "../MathUtils/radiansToDegree";
import { setState } from "../Other/state";

let canaotv = false;

export function lookAtBlockTP(x, y, z, ms) {
  canaotv = false;
  let hoekPitch;
  let hoekYaw;
  let AngleYaw;
  let msLookVelo = ms;

  if (x === undefined || y === undefined || z === undefined) {
    ChatLib.chat(" ");
  } else {
    let PlayerAngleYaw = Player.getPlayer().field_70177_z;
    PlayerAngleYaw %= 360;
    let dX = Player.getX() - x + 0.000001;
    let dZ = Player.getZ() - z + 0.000001;
    let dY = Player.getY() - y;

    let dis = Math.sqrt(dX * dX + dZ * dZ);
    if (dX < 0.0 && dZ < 0.0) {
      AngleYaw = radiansToDegree(Math.atan(dZ / dX)) + 180;
    } else if (dZ < 0.0 && dX > 0.0) {
      AngleYaw = radiansToDegree(Math.atan(dZ / dX)) + 360;
    } else if (dZ > 0.0 && dX < 0.0) {
      AngleYaw = radiansToDegree(Math.atan(dZ / dX)) + 180;
    } else if (dZ > 0.0 && dX > 0.0) {
      AngleYaw = radiansToDegree(Math.atan(dZ / dX));
    }

    hoekYaw = AngleYaw - PlayerAngleYaw + 90;

    if (hoekYaw > 180) {
      hoekYaw -= 360;
    }

    if (hoekYaw < -180) {
      hoekYaw += 360;
    }

    hoekPitch =
      radiansToDegree(Math.atan(dY / dis)) - Player.getPlayer().field_70125_A;

    new Thread(() => {
      for (let i = 0; i < msLookVelo; i++) {
        if (getOfflineState() != "offline") {
          Player.getPlayer().field_70177_z += hoekYaw / msLookVelo;
          Player.getPlayer().field_70125_A += hoekPitch / msLookVelo;

          try {
            Thread.sleep(1);
          } catch (e) {
            Player.getPlayer().field_70177_z += hoekYaw / msLookVelo;
            Player.getPlayer().field_70125_A += hoekPitch / msLookVelo;
          }
        } else {
          setState(null);
          break;
        }
      }
    }).start();
  }
}

module.export = { canaotv };
