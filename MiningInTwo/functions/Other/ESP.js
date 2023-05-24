/** @format */

import { getESPColor, getESPColorRed, getESPColorGreen } from "./getESPColor";
import { getBlockCoords } from "../Blocks/blockCoords";

import { checkentity } from "./checkEnti";
import Settings from "../../data/config/config";
import RenderLib from "../../../RenderLib/index";

let renderPoints = [];
let renderBlock = false;
let renderBlockPos;
let render = false;
let posESP;
let renderNextBlock = false;
let nextBlock;

export function renderOneBlock(block) {
	renderBlockPos = block;
	renderBlock = true;
}

export function stopRenderBlock() {
	renderBlock = false;
	renderNextBlock = false;
}

export function nextBlockRender(block) {
	nextBlock = block;
	renderNextBlock = true;
}

register("renderworld", () => {
	if (!World.isLoaded) return;
	if (Settings.ShowNearPlayers) {
		let points = getRenderPoints();
		for (let player = 0; player < points.length; player++) {
			RenderLib.drawEspBox(
				points[player].x,
				points[player].y,
				points[player].z,
				0.6,
				1.8,
				1,
				0.4,
				0.4,
				1,
				true
			);
		}
	}

	if (renderBlock) {
		try {
			RenderLib.drawEspBox(
				renderBlockPos.getX() + 0.5,
				renderBlockPos.getY(),
				renderBlockPos.getZ() + 0.5,
				1,
				1,
				1,
				1,
				1,
				1,
				true
			);
		} catch (e) {}
	}

	if (renderNextBlock) {
		try {
			RenderLib.drawEspBox(
				nextBlock.getX() + 0.5,
				nextBlock.getY(),
				nextBlock.getZ() + 0.5,
				1,
				1,
				1,
				1,
				1,
				1,
				true
			);
		} catch (e) {}
	}
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

function distanceToPlayer(x, y, z) {
	let dX = Player.getX() - x;
	let dZ = Player.getZ() - z;
	let dY = Player.getY() - y;
	let dis = Math.sqrt(dX * dX + dZ * dZ);
	let dis2 = Math.sqrt(dis * dis + dY * dY);
	return dis2;
}

function distanceToPlayerFlat(x, z) {
	let dX = Player.getX() - x;
	let dZ = Player.getZ() - z;
	let dis = Math.sqrt(dX * dX + dZ * dZ);
	return dis;
}

register("renderWorld", () => {
	if (Settings.render == true) {
		let blockCoords;

		if (Settings.macroSpot == 1) blockCoords = getBlockCoords().rAssist.custom;
		else blockCoords = getBlockCoords().rAssist.default;

		let { cobbleBlocks } = getBlockCoords();

		let posCobble = {
			xPosCobble: cobbleBlocks.xpos1,
			yPosCobble: cobbleBlocks.ypos1,
			zPosCobble: cobbleBlocks.zpos1,
		};

		let posESP = {
			xpos1: blockCoords.xpos1,
			block1: blockCoords.block1,
			zpos1: blockCoords.zpos1,
		};

		if (!World.isLoaded) return;
		for (let i = 0; i < posESP.xpos1.length; i++) {
			if (
				distanceToPlayer(
					posESP.xpos1[i],
					posESP.block1[i] + 1,
					posESP.zpos1[i]
				) < 20
			) {
				try {
					Tessellator.drawString(
						i + 1,
						posESP.xpos1[i],
						posESP.block1[i] + 1,
						posESP.zpos1[i]
					);

					RenderLib.drawEspBox(
						posESP.xpos1[i],
						posESP.block1[i] + 0.5,
						posESP.zpos1[i],
						1,
						1,
						getESPColorRed(),
						getESPColorGreen(),
						getESPColor(),
						1,
						true
					);
				} catch (e) {
					ChatLib.chat("b");
				}
			} else {
				if (i == 0) {
					Tessellator.drawString(
						"START",
						posESP.xpos1[i],
						posESP.block1[i] + 1,
						posESP.zpos1[i]
					);

					RenderLib.drawEspBox(
						posESP.xpos1[i],
						posESP.block1[i] + 0.5,
						posESP.zpos1[i],
						1,
						1,
						getESPColorRed(),
						getESPColorGreen(),
						getESPColor(),
						1,
						true
					);
				}
			}
		}
	}
});
