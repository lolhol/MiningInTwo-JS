export function lookAndJump(a, lookSpeed) {
  new Thread(() => {
    JUMP.setState(true);
    lookAtSlowly(a[0], a[1], [2], lookSpeed);
    Thread.sleep(10);
    JUMP.setState(false);
  }).start();
}
