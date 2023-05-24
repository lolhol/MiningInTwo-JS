/** @format */

import { distanceToPlayerHead } from "../MathUtils/distanceToPlayerHead";

export function getClosestBlockFromList(list) {
	let currSmallest = distanceToPlayerHead(list[0].x, list[0].y, list[0].z);
	let returnBlock;

	for (let i = 0; i < list.length - 1; i++) {
		//ChatLib.chat(list[i].x);
		let distToBlock = distanceToPlayerHead(list[i].x, list[i].y, list[i].z);

		if (distToBlock <= currSmallest) {
			currSmallest = distToBlock;
			returnBlock = list[i];
		}
	}

	//ChatLib.chat(returnBlock);

	return returnBlock;
}
