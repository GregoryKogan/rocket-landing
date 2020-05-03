class Platform{
  constructor(Xpos, Ypos){
    if (Xpos && Ypos)
      this.Body = new Box(Xpos, windowHeight + Ypos - 100, 300, 35);
    else
      this.Body = new Box(windowWidth / 2, windowHeight - 100, 300, 35);
    this.Body.UpdateEdges();
    this.Body.UpdateEdges();
    this.ScreenPosX = this.Body.PosX;
    this.ScreenPosY = this.Body.PosY;
  }

  RecalculateCoordinats(GlobalScale, GlobalCamera, BestRocket){
    let XDistance = BestRocket.Body.PosX - this.Body.PosX;
    let YDistance = BestRocket.Body.PosY - this.Body.PosY;
    XDistance *= GlobalScale;
    YDistance *= GlobalScale;
    this.ScreenPosX = BestRocket.Body.PosX - XDistance;
    this.ScreenPosY = BestRocket.Body.PosY - YDistance;
    this.ScreenPosX -= GlobalCamera.PosX;
    this.ScreenPosY -= GlobalCamera.PosY;
  }

  Render(GlobalScale, GlobalCamera, BestRocket){
    push();
    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = -5;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'black';
    if (GlobalCamera && GlobalScale && BestRocket){
      this.RecalculateCoordinats(GlobalScale, GlobalCamera, BestRocket);
      translate(this.ScreenPosX, this.ScreenPosY);
    }
    else{
      translate(this.Body.PosX - GlobalCamera.PosX, this.Body.PosY - GlobalCamera.PosY);
    }

    rectMode(CENTER);
    fill(10);
    stroke(80);
    strokeWeight(5);
    rect(0, 0, 300 * GlobalScale, 35 * GlobalScale);
    fill(246, 202, 9);
    noStroke();
    quad(-145 * GlobalScale, 17.5 * GlobalScale, -125 * GlobalScale, 17.5 * GlobalScale, -95 * GlobalScale, -17.5 * GlobalScale, -115 * GlobalScale, -17.5 * GlobalScale);
    quad(-105 * GlobalScale, 17.5 * GlobalScale, -85 * GlobalScale, 17.5 * GlobalScale, -55 * GlobalScale, -17.5 * GlobalScale, -75 * GlobalScale, -17.5 * GlobalScale);
    quad(-65 * GlobalScale, 17.5 * GlobalScale, -45 * GlobalScale, 17.5 * GlobalScale, -15 * GlobalScale, -17.5 * GlobalScale, -35 * GlobalScale, -17.5 * GlobalScale);
    quad(-25 * GlobalScale, 17.5 * GlobalScale, -5 * GlobalScale, 17.5 * GlobalScale, 25 * GlobalScale, -17.5 * GlobalScale, 5 * GlobalScale, -17.5 * GlobalScale);
    quad(15 * GlobalScale, 17.5 * GlobalScale, 35 * GlobalScale, 17.5 * GlobalScale, 65 * GlobalScale, -17.5 * GlobalScale, 45 * GlobalScale, -17.5 * GlobalScale);
    quad(55 * GlobalScale, 17.5 * GlobalScale, 75 * GlobalScale, 17.5 * GlobalScale, 105 * GlobalScale, -17.5 * GlobalScale, 85 * GlobalScale, -17.5 * GlobalScale);
    quad(95 * GlobalScale, 17.5 * GlobalScale, 115 * GlobalScale, 17.5 * GlobalScale, 145 * GlobalScale, -17.5 * GlobalScale, 125 * GlobalScale, -17.5 * GlobalScale);
    fill(150);
    rect(0, 10021 * GlobalScale, 100 * GlobalScale, 20000 * GlobalScale);
    fill(90);
    stroke(0);
    strokeWeight(1);
    triangle(51 * GlobalScale, 21 * GlobalScale, 51 * GlobalScale, 52 * GlobalScale, 120 * GlobalScale, 22 * GlobalScale);
    triangle(-51 * GlobalScale, 21 * GlobalScale, -51 * GlobalScale, 52 * GlobalScale, -120 * GlobalScale, 22 * GlobalScale);
    pop();
  }
}
