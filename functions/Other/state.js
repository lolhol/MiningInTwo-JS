let state = null;
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

register("Tick", () => {
  tickSinceStateChange++;
});
