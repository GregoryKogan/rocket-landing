class Camera{
  constructor(){
    this.PosX = 0;
    this.PosY = 0;
  }

  Follow(Object){
    this.GoTo(Object.PosX - windowWidth / 2, Object.PosY - windowHeight / 2);
  }

  GoTo(X, Y){
    this.PosX += (X - this.PosX);
    this.PosY += (Y - this.PosY);
  }
}

function AdaptScale(Object){
  if (Object){
    const ObjX = Object.PosX;
    const ObjY = Object.PosY;
    const DefaultDistance = (windowHeight - 150) / 2;
    const CurrentDistance = dist(ObjX, ObjY, PlatformX.Body.PosX, PlatformX.Body.PosY);
    GlobalScale = (DefaultDistance / (CurrentDistance + 100));
    if (GlobalScale < 0.5)
      GlobalScale = 0.5;
    if (GlobalScale > 1)
      GlobalScale = 1;
  }
  else {
    GlobalScale = 0.7;
  }
  GlobalScale *= 0.67;
}
