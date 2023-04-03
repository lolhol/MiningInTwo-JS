export function fromXYZToHY(block) {
  let x = block.getX();
  let y = block.getY();
  let z = block.getZ();

  let hoekYaw;
  let AngleYaw;

  if (x !== undefined || y !== undefined || z !== undefined) {
    let PlayerAngleYaw = Player.getPlayer().field_70177_z;
    PlayerAngleYaw %= 360;
    let dX = Player.getX() - x + 0.000001;
    let dZ = Player.getZ() - z + 0.000001;
    let dY = Player.getY() + 1.54 - y;

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

    return [hoekYaw, hoekPitch];
  }

  return null;
}
