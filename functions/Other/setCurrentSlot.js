export const C09PacketHeldItemChange = Java.type(
  "net.minecraft.network.play.client.C09PacketHeldItemChange"
);

let MC = Client.getMinecraft();

export function setCurrentSlot(slot, type) {
  MC.field_71439_g.field_71174_a.func_147297_a(
    new C09PacketHeldItemChange(slot)
  );

  if (type == 1) {
    Player.setHeldItemIndex(slot);
  }
}
