/** @format */

import config from "../data/config/config";
import { degreeToRadians } from "../functions/degreeToRadians";
import { getBlockCoords } from "../utils/blockCoords";
import Settings from "../data/config/config";

let routeAssistFilePath =
	"./config/ChatTriggers/modules/MiningInTwo/data/routeAssist.json";

let rgbAngle = 0;

function addAngle(number) {
	rgbAngle += number;
}

function angleToColor(angle) {
	return {
		r: Math.cos(degreeToRadians(angle)),
		g: Math.cos(degreeToRadians(angle) + 120),
		b: Math.cos(degreeToRadians(angle) - 120),
	};
}

register("renderWorld", () => {
	if (config.renderBlockLines) {
		if (!World.isLoaded) return;

		if (Settings.macroSpot == 1) rAssist = getBlockCoords().rAssist.custom;
		else rAssist = getBlockCoords().rAssist.default;

		let xpos1 = rAssist.xpos1;
		let block1 = rAssist.block1;
		let zpos1 = rAssist.zpos1;

		if (xpos1.length > 1) {
			Tessellator.disableTexture2D();
			Tessellator.scale(1, 1, 1);
			//Tessellator.enableLighting();

			for (let i = 0; i < xpos1.length; i++) {
				Tessellator.begin(GL11.GL_LINES, false);

				if (config.chromaMode) {
					addAngle(0.1);
					let rgb = angleToColor(rgbAngle);
					Tessellator.colorize(rgb.r, rgb.g, rgb.b);
				}

				if (xpos1.length > 1) {
					try {
						Tessellator.pos(
							xpos1[i] + 0.0001,
							block1[i] + 1.7001,
							zpos1[i] + 0.0001
						).pos(
							xpos1[i + 1] + 0.0001,
							block1[i + 1] + 1.7001,
							zpos1[i + 1] + 0.0001
						);
					} catch (e) {
						ChatLib.chat(e);
					}

					Tessellator.draw();
				}
			}

			Tessellator.enableTexture2D();
		}
	}
});
