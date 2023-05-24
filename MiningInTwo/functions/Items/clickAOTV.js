/** @format */

import Settings from "../../data/config/config";
import { getAOTVSlot } from "./getInvItems";

const MC = Client.getMinecraft();
export const C08PacketPlayerBlockPlacement = Java.type(
	"net.minecraft.network.play.client.C08PacketPlayerBlockPlacement"
);
export const C09PacketHeldItemChange = Java.type(
	"net.minecraft.network.play.client.C09PacketHeldItemChange"
);
export const BP = Java.type("net.minecraft.util.BlockPos");

export function clickAOTV() {
	let currentSlot = Player.getHeldItemIndex();

	MC.field_71439_g.field_71174_a.func_147297_a(
		new C09PacketHeldItemChange(getAOTVSlot())
	);

	MC.field_71439_g.field_71174_a.func_147297_a(
		new C08PacketPlayerBlockPlacement(
			new BP(-1, -1, -1),
			255,
			Player.getInventory().getStackInSlot(getAOTVSlot()).getItemStack(),
			0,
			0,
			0
		)
	);

	MC.field_71439_g.field_71174_a.func_147297_a(
		new C09PacketHeldItemChange(currentSlot)
	);
}
