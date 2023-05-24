export function getAOTVSlot() {
  for (let i = 0; i < 8; i++) {
    if (
      ChatLib.removeFormatting(
        Player.getInventory().getStackInSlot(i)?.getName()
      ).includes("Aspect of the Void") ||
      ChatLib.removeFormatting(
        Player.getInventory().getStackInSlot(i)?.getName()
      ).includes("Aspect of the End")
    ) {
      let AOTV = i;
      return AOTV;
    }
  }

  return null;
}

export function getRodSlot() {
  for (let i = 0; i < 8; i++) {
    if (
      ChatLib.removeFormatting(
        Player.getInventory().getStackInSlot(i)?.getName()
      ).includes("Rod")
    ) {
      let rodSlot = i;
      return rodSlot;
    }
  }

  return null;
}

export function getDrillSlot() {
  for (let i = 0; i < 8; i++) {
    if (Player.getInventory().getStackInSlot(i) != null) {
      let itemPos = Player.getInventory().getStackInSlot(i).getName();
      let itemLore = Player.getInventory().getStackInSlot(i).getLore();
      for (let j = 0; j < itemLore.length; j++) {
        if (
          itemPos.toString().includes("Drill") ||
          itemPos.toString().includes("Gauntlet")
        ) {
          let drillSlot = i;
          return drillSlot;
        }
      }
    }
  }

  return null;
}
