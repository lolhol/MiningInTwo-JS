let entityping;

export function checkentity(entityname) {
  entityping = World.getPlayerByName(entityname.name).getPing();
  if (entityping == 1.0) {
    return false;
  } else {
    return true;
  }
}
