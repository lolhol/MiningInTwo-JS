export function getHeadY() {
  if (Player.isSneaking()) {
    return Player.getY() + 1.54;
  }

  return Player.getY() + 2;
}
