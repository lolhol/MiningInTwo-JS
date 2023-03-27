/** @format */

import { getRodSlot } from "./getInvItems";

const mc = Client.getMinecraft();

export const C08PacketPlayerBlockPlacement = Java.type(
	"net.minecraft.network.play.client.C08PacketPlayerBlockPlacement"
);
export const C0APacketAnimation = Java.type(
	"net.minecraft.network.play.client.C0APacketAnimation"
);
export const C09PacketHeldItemChange = Java.type(
	"net.minecraft.network.play.client.C09PacketHeldItemChange"
);
export const BP = Java.type("net.minecraft.util.BlockPos");

export function throwRod() {
	Player.setHeldItemIndex(getRodSlot());
	if (getRodSlot() != undefined) {
		let currentSlot = Player.getHeldItemIndex();
		mc.field_71439_g.field_71174_a.func_147297_a(
			new C09PacketHeldItemChange(getRodSlot())
		);
		mc.field_71439_g.field_71174_a.func_147297_a(
			new C08PacketPlayerBlockPlacement(
				new BP(-1, -1, -1),
				255,
				Player.getInventory().getStackInSlot(getRodSlot()).getItemStack(),
				0,
				0,
				0
			)
		);
		mc.field_71439_g.field_71174_a.func_147297_a(
			new C09PacketHeldItemChange(currentSlot)
		);
	}
}
