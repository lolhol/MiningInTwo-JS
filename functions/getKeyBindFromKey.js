/** @format */

export function getKeyBindFromKey(key, description) {
  var mcKeyBind = Client.getKeyBindFromKey(key);

  if (mcKeyBind == null || mcKeyBind == undefined) {
    mcKeyBind = new KeyBind(description, key, "MiningInTwo");
  }

  return mcKeyBind;
}

export function getKeyBindFromKeyHelper(key, description) {
  var mcKeyBindHelper = Client.getKeyBindFromKey(key);

  if (mcKeyBindHelper == null || mcKeyBindHelper == undefined) {
    mcKeyBindHelper = new KeyBind(description, key, "MiningInTwo");
  }

  return mcKeyBindHelper;
}
