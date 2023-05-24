/** @format */

import {
	getBlockCoords,
	reWriteLocalData,
} from "../../functions/Blocks/blockCoords";
import Settings from "../../data/config/config";

/** @format */
let xpos1 = [];
let head1 = [];
let block1 = [];
let zpos1 = [];
let routeAssistFilePath =
	"./config/ChatTriggers/modules/MiningInTwo/data/routeAssist.json";

export function addBlock() {
	let blockCoords = getBlockCoords().rAssist;

	let block = World.getBlockAt(Player.getX(), Player.getY() - 1, Player.getZ());
	let xpos = block.getX();
	let zpos = block.getZ();
	let ypos = block.getY();

	let xposfinal = xpos - (xpos % 1) + 0.5;
	let zposfinal = zpos - (zpos % 1) + 0.5;
	let yposhead = ypos - (ypos % 1) + 1.6;
	let yposblock = ypos - (ypos % 1) - 0.5;

	if (Settings.macroSpot == 1) {
		blockCoords.custom.xpos1.push(xposfinal);
		blockCoords.custom.head1.push(yposhead);
		blockCoords.custom.block1.push(yposblock);
		blockCoords.custom.zpos1.push(zposfinal);
	} else {
	}

	reWriteLocalData(blockCoords, "rAssist");
}

export function clearBlocks() {
	xpos1.splice(0);
	head1.splice(0);
	block1.splice(0);
	zpos1.splice(0);

	FileLib.write(
		routeAssistFilePath,
		JSON.stringify({ xpos1, head1, block1, zpos1 }, undefined, 2),
		true
	);
}
