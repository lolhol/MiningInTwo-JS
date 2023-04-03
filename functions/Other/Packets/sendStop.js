export const C07PacketPlayerDigging = Java.type(
  net.minecraft.network.play.client.C07PacketPlayerDigging
);

export function sendStop(block, enumFacing) {
  mc.field_71439_g.field_71174_a.func_147297_a(
    new C07PacketPlayerDigging(
      C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK,
      block,
      enumFacing
    )
  );
}
