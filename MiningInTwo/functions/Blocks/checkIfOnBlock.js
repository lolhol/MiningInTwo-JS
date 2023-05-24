import { isSameXZ } from "../MathUtils/checkIfSameXZ";
import { changeOfflineState, setState } from "../Other/state";

let callToFunc;
let newState;
let startChecking = false;
let checkedBlock;
let checkForTicks = 0;
let ticks = 0;

export function checkIfOnBlock(block, stateChange, callOn, ammountOfTicks) {
  if (stateChange) {
    newState = stateChange;
  } else if (callOn) {
    callToFunc = callOn;
  }

  startChecking = true;
  checkedBlock = block;
  checkForTicks = ammountOfTicks;
}

register("Tick", () => {
  if (startChecking) {
    if (ticks <= checkForTicks) {
      if (isSameXZ(checkedBlock, Player)) {
        if (newState) {
          setState(newState);
        } else if (callToFunc != null) {
          callToFunc();
        }

        startChecking = false;
        ticks = 0;
      }
    } else {
      changeOfflineState("offline");
    }
  }

  if (startChecking) ticks++;
});
