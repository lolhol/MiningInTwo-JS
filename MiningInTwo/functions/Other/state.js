let state = null;
let offlineState = "offline";
let tickSinceStateChange = 0;

export function setState(newState) {
  if (
    newState == "tickCount" ||
    newState == "armadilloTicks" ||
    newState == "armadilloClickTicks"
  ) {
    state = newState;
  } else {
    state = newState;
    tickSinceStateChange = 0;
  }
  return state;
}

export function getState() {
  return state;
}

export function getTickSinceStateChange() {
  return tickSinceStateChange;
}

export function changeOfflineState(newState) {
  offlineState = newState;
}

export function getOfflineState() {
  return offlineState;
}

register("Tick", () => {
  tickSinceStateChange++;
});
