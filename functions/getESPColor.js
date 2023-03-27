import Settings from "../data/config/config";

export function getESPColor() {
  if (Settings.ESPBlueColor == 0) {
    ESPBColor = 0;
  }
  if (Settings.ESPBlueColor == 1) {
    ESPBColor = 0.1;
  } else if (Settings.ESPBlueColor == 2) {
    ESPBColor = 0.2;
  } else if (Settings.ESPBlueColor == 3) {
    ESPBColor = 0.3;
  } else if (Settings.ESPBlueColor == 4) {
    ESPBColor = 0.4;
  } else if (Settings.ESPBlueColor == 5) {
    ESPBColor = 0.5;
  } else if (Settings.ESPBlueColor == 6) {
    ESPBColor = 0.6;
  } else if (Settings.ESPBlueColor == 7) {
    ESPBColor = 0.7;
  } else if (Settings.ESPBlueColor == 8) {
    ESPBColor = 0.8;
  } else if (Settings.ESPBlueColor == 9) {
    ESPBColor = 0.9;
  } else if (Settings.ESPBlueColor == 10) {
    ESPBColor = 1;
  }

  return ESPBColor;
}

export function getESPColorRed() {
  let ESPRedColor = Settings.ESPRedColor;
  if (ESPRedColor == 0) {
    ESPYColor = 0;
  } else if (ESPRedColor == 1) {
    ESPYColor = 0.1;
  } else if (ESPRedColor == 2) {
    ESPYColor = 0.2;
  } else if (ESPRedColor == 3) {
    ESPYColor = 0.3;
  } else if (ESPRedColor == 4) {
    ESPYColor = 0.4;
  } else if (ESPRedColor == 5) {
    ESPYColor = 0.5;
  } else if (ESPRedColor == 6) {
    ESPYColor = 0.6;
  } else if (ESPRedColor == 7) {
    ESPYColor = 0.7;
  } else if (ESPRedColor == 8) {
    ESPYColor = 0.8;
  } else if (ESPRedColor == 9) {
    ESPYColor = 0.9;
  } else if (ESPRedColor == 10) {
    ESPYColor = 1;
  }

  return ESPYColor;
}

export function getESPColorGreen() {
  let ESPGreenColor = Settings.ESPGreenColor;

  if (ESPGreenColor == 0) {
    ESPGColor = 0;
  } else if (ESPGreenColor == 1) {
    ESPGColor = 0.1;
  } else if (ESPGreenColor == 2) {
    ESPGColor = 0.2;
  } else if (ESPGreenColor == 3) {
    ESPGColor = 0.3;
  } else if (ESPGreenColor == 4) {
    ESPGColor = 0.4;
  } else if (ESPGreenColor == 5) {
    ESPGColor = 0.5;
  } else if (ESPGreenColor == 6) {
    ESPGColor = 0.6;
  } else if (ESPGreenColor == 7) {
    ESPGColor = 0.7;
  } else if (ESPGreenColor == 8) {
    ESPGColor = 0.8;
  } else if (ESPGreenColor == 9) {
    ESPGColor = 0.9;
  } else if (ESPGreenColor == 10) {
    ESPGColor = 1;
  }

  return ESPGColor;
}
