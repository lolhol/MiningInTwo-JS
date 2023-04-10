export function getBlocksAround(block) {
  for (let y = block.getY(); y < block.getY() + 6; y++) {
    for (let x = block.getX() - 2; x < block.getX() + 2; x++) {
      for (let z = block.getZ() - 2; z < block.getZ() + 2; z++) {
        let currBlock = World.getBlockAt(x, y, z);

        if (
          currBlock.type.getRegistryName() == "minecraft:stained_glass_pane" ||
          currBlock.type.getRegistryName() == "minecraft:stained_glass"
        ) {
          return true;
        }
      }
    }
  }

  return false;
}
