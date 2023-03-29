import { getAOTVSlot, getDrillSlot, getRodSlot } from "./getInvItems";

export function checkInv() {
  if (
    getDrillSlot() !== null &&
    getRodSlot() !== null &&
    getAOTVSlot() !== null
  ) {
    return true;
  } else {
    return false;
  }
}
