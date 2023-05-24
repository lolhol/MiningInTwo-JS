/** @format */

import { radiansToDegree } from "../MathUtils/radiansToDegree";

import Settings from "../../data/config/config";

let lookSPEED;

export function lookAtSlowly(x, y, z, speed) {
	canaotv = false;
	let hoekPitch;
	let hoekYaw;
	let AngleYaw;
	let msLookVelo = speed; //Settings.SPEED * 15;

	if (Settings.SPEED == 1) {
		msLookVelo = 2;
	}

	if (x === undefined || y === undefined || z === undefined) {
		ChatLib.chat(" ");
	} else {
		let PlayerAngleYaw = Player.getPlayer().field_70177_z;
		PlayerAngleYaw %= 360;
		let dX = Player.getX() - x + 0.000001;
		let dZ = Player.getZ() - z + 0.000001;
		let dY = Player.getY() + 1.54 - y;

		let dis = Math.sqrt(dX * dX + dZ * dZ);
		if (dX < 0.0 && dZ < 0.0) {
			AngleYaw = radiansToDegree(Math.atan(dZ / dX)) + 180;
		} else if (dZ < 0.0 && dX > 0.0) {
			AngleYaw = radiansToDegree(Math.atan(dZ / dX)) + 360;
		} else if (dZ > 0.0 && dX < 0.0) {
			AngleYaw = radiansToDegree(Math.atan(dZ / dX)) + 180;
		} else if (dZ > 0.0 && dX > 0.0) {
			AngleYaw = radiansToDegree(Math.atan(dZ / dX));
		}

		hoekYaw = AngleYaw - PlayerAngleYaw + 90;

		if (hoekYaw > 180) {
			hoekYaw -= 360;
		}

		if (hoekYaw < -180) {
			hoekYaw += 360;
		}

		hoekPitch =
			radiansToDegree(Math.atan(dY / dis)) - Player.getPlayer().field_70125_A;

		new Thread(() => {
			for (let i = 0; i < msLookVelo; i++) {
				Player.getPlayer().field_70177_z += hoekYaw / msLookVelo;
				Player.getPlayer().field_70125_A += hoekPitch / msLookVelo;
				Thread.sleep(1);
			}
		}).start();
	}
}
