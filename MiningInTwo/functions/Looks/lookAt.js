export function lookAt(rotationYaw, rotationPitch) {
  if (rotationYaw === undefined || rotationPitch === undefined) {
    //I love when yeffi puts the if statement with nothing in it :) (sarcasm)
  } else {
    Player.getPlayer().field_70177_z = rotationYaw;
    Player.getPlayer().field_70125_A = rotationPitch;
  }
}
