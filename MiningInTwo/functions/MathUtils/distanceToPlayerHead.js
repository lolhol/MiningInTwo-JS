/** @format */

export function distanceToPlayerHead(x, y, z) {
	let dX = Player.getX() - x;
	let dZ = Player.getZ() - z;
	let dY = Player.getY() + 1.25 - y;
	let dis = Math.sqrt(dX * dX + dZ * dZ);
	let dis2 = Math.sqrt(dis * dis + dY * dY);
	return dis2;
}
