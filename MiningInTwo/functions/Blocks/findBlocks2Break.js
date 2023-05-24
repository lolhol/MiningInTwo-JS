/** @format */

import { addLine } from "../../debug_testing_dont_mind/debug";

export function findBlocks(x1, y1, z1, x2, y2, z2, cylRadius) {
	let blocks = [];
	let dx = x2 - x1;
	let dy = y2 - y1;
	let dz = z2 - z1;
	let blockOAir = 0;

	blocks.push(World.getBlockAt(x1, y1, z1));
	blocks.push(World.getBlockAt(x1, y1 + 1, z1));

	if (Math.abs(dz) < 0.000001) {
		dz = 0.000001;
	}

	let length = Math.sqrt(dx * dx + dy * dy + dz * dz);
	let stepX = dx / length;
	let stepY = dy / length;
	let stepZ = dz / length;

	let planeCoef = x1 * dx + y1 * dy + z1 * dz;

	let xN = 0;
	let yN = 0;
	let zN = planeCoef / dz;
	let dxN = xN - x1;
	let dyN = yN - y1;
	let dzN = zN - z1;
	let lenN = Math.sqrt(dxN * dxN + dyN * dyN + dzN * dzN);
	dxN = dxN / lenN;
	dyN = dyN / lenN;
	dzN = dzN / lenN;

	let dxM = dy * dzN - dz * dyN;
	let dyM = dz * dxN - dx * dzN;
	let dzM = dx * dyN - dy * dxN;
	let cLen = Math.sqrt(dxM * dxM + dyM * dyM + dzM * dzM);
	dxM = dxM / cLen;
	dyM = dyM / cLen;
	dzM = dzM / cLen;

	for (let i = 0; i < length; i++) {
		for (let degree = 0; degree < 360; degree += 20) {
			let angle = degree * (Math.PI / 180);
			let dxP = dxN * Math.cos(angle) + dxM * Math.sin(angle);
			let dyP = dyN * Math.cos(angle) + dyM * Math.sin(angle);
			let dzP = dzN * Math.cos(angle) + dzM * Math.sin(angle);

			let newX = stepX * i + x1 + dxP * cylRadius;
			let newY = stepY * i + y1 + dyP * cylRadius;
			let newZ = stepZ * i + z1 + dzP * cylRadius;

			let block = World.getBlockAt(newX, newY, newZ);

			let found = false;

			for (let j = 0; j < blocks.length - 1; j++) {
				if (
					blocks[j].getX() == block.getX() &&
					blocks[j].getY() == block.getY() &&
					blocks[j].getZ() == block.getZ()
				) {
					found = true;
				}
			}

			if (found == false) {
				blocks.push(block);

				if (block.type.getRegistryName() == "minecraft:air") {
					blockOAir++;
				}
				//blocks.push(World.getBlockAt(x2, y2 + 2, z2));
			}
		}
	}

	blocks.push(World.getBlockAt(x2, y2 + 1, z2));
	blocks.push(World.getBlockAt(x2, y2, z2));

	return { blocks, blockOAir };
}
