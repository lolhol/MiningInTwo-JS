/** @format */

import Settings from "../../data/config/config";

export function currSelected() {
	let rDataCoords;

	if (Settings.macroSpot == 1)
		rDataCoords = getBlockCoords().rDataCoords.custom;
	else rDataCoords = getBlockCoords().rDataCoords.default;

	return rDataCoords;
}
