import { clickAOTV } from "../Items/clickAOTV";
import { lookAtSlowly } from "./lookAtSlowly";

const MC = Client.getMinecraft();
const SHIFT = new KeyBind(MC.field_71474_y.field_74311_E);

export function teleportToBlock(block, lookTime, waitTime) {
  new Thread(() => {
    Thread.sleep(waitTime);

    lookAtSlowly(block.getX(), block.getY(), block.getZ(), lookTime);

    Thread.sleep(Math.floor(lookTime * 2.5));

    SHIFT.setState(true);
    clickAOTV();
    SHIFT.setState(false);
  });
}
