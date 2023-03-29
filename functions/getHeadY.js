export function getHeadY() {
  if (Player.isSneaking()) {
    return 1.54;
  }

  return 1.62;
}
