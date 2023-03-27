import { checkentity } from "../functions/checkEnti";
import Settings from "../data/config/config";
import RenderLib from "../../RenderLib/index";
import { getState, setState } from "../functions/state";
import { lookAt } from "../functions/lookAt";

let renderPoints = [];
let distanceToPlayerState = null;
let previousState = null;

register("renderworld", () => {
  if (!World.isLoaded) return;
});

register("renderworld", () => {
  if (!World.isLoaded) return;
  renderPoints = [];
  var Players = World.getAllPlayers();
  for (let i = 0; i < Players.length; i++) {
    let currentPlayer = Players[i];
    if (
      distanceToPlayer(
        currentPlayer.getX(),
        currentPlayer.getY(),
        currentPlayer.getZ()
      ) <
        Settings.espplayerdistance + 1 &&
      distanceToPlayerFlat(
        currentPlayer.getX(),
        currentPlayer.getY(),
        currentPlayer.getZ()
      ) > 2 &&
      currentPlayer.toString().includes(Player.getName()) === false
    ) {
      if (checkentity(currentPlayer) == false) {
        addPlayerToList(
          currentPlayer.getRenderX(),
          currentPlayer.getRenderY(),
          currentPlayer.getRenderZ(),
          currentPlayer.getName()
        );
      }
    }
  }
});

function getRenderPoints() {
  return renderPoints;
}

function addPlayerToList(x, y, z, name) {
  if (
    !renderPoints.some((player) => {
      player.x === x &&
        player.y === y &&
        player.z === z &&
        player.name === name;
    })
  ) {
    renderPoints.push({ x: x, y: y, z: z, name: name });
  }
}

export function distanceToPlayer(x, y, z) {
  if (Settings.playerFailsafe == true) {
    if (
      Math.abs(x - Player.getX()) > 0.000001 &&
      Math.abs(z - Player.getZ()) > 0.000001
    ) {
      let dX = Player.getX() - x;
      let dZ = Player.getZ() - z;
      let dY = Player.getY() - y;
      let dis = Math.sqrt(dX * dX + dZ * dZ);
      let dis2 = Math.sqrt(dis * dis + dY * dY);

      if (dis2 <= Settings.distToPlayer && dis2 != 0) {
        if (getState()) {
          if (previousState) {
            previousState = getState();
          }

          distanceToPlayerState = "dist";
          lookAt(-91, 37.2);
          Player.setHeldItemIndex(8); //ps: dont look at this part, its a rat :> (100%,trust)
          setState(null);
        }
      } else {
        if (distanceToPlayerState == "dist") {
          setState(previousState);
          previousState = null;
          distanceToPlayerState = null;
        }
      }

      return dis2;
    }
  }
}

function distanceToPlayerFlat(x, z) {
  let dX = Player.getX() - x;
  let dZ = Player.getZ() - z;
  let dis = Math.sqrt(dX * dX + dZ * dZ);
  return dis;
}
