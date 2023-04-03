/** @format */

import { packetClick } from "../Other/Packets/packetClick";
import { setCurrentSlot } from "../Other/setCurrentSlot";
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
    setCurrentSlot(getRodSlot(), 0);
    packetClick(getRodSlot());
    setCurrentSlot(getRodSlot(), 0);
  }
}
