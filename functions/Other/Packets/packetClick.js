export const C08PacketPlayerBlockPlacement = Java.type(
  "net.minecraft.network.play.client.C08PacketPlayerBlockPlacement"
);

export const BP = Java.type("net.minecraft.util.BlockPos");

export function packetClick(slot) {
  mc.field_71439_g.field_71174_a.func_147297_a(
    new C08PacketPlayerBlockPlacement(
      new BP(-1, -1, -1),
      255,
      Player.getInventory().getStackInSlot(slot).getItemStack(),
      0,
      0,
      0
    )
  );
}
