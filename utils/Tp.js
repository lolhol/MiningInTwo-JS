/** @format */

import { lookAtSlowly } from "../functions/lookAtSlowly";
import { blockList } from "./setBlockCords";

let state = null;

export function checkBlock() {
  if (blockList().get(1) != "hi") {
    for (let i = 0; i <= blockList().size; i++) {
      if (blockList().get(i).getY() == Player.getY() - 1) {
        ChatLib.chat("You Are On Block In List");
        state = "startMacro";
      } else {
        state == null;
      }
    }
  } else {
    ChatLib.chat("Stand on the block that is in the list");
    state = null;
  }

  return state;
}
