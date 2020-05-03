class Rocket{
  constructor(Parent){
    this.Body = new Box(windowWidth / 2, 50, 30, 210);
    this.Body.SetMass(20);
    this.Drag = createVector(0, -6);
    this.Color = color(100, 100, 255);
    this.ScreenPosX = this.Body.PosX;
    this.ScreenPosY = this.Body.PosY;
    this.HasCrashed = false;
    this.HasLanded = false;
    this.IsAccelerating = false;
    this.Rotating = "False";
    this.StartDistance = dist(this.Body.PosX, this.Body.PosY, PlatformX.Body.PosX, PlatformX.Body.PosY);
    this.Score = 0;
    this.FixatedScore = false;
    this.Fitness = null;
    this.Timer = 1;
    this.Inputs = [];
    if (Parent)
      this.Brain = Parent.Brain.Copy();
    else{
      let BrainSpecs = new Specification;
      BrainSpecs.SetOptions(6, 3, 3, [12, 10, 8]);
      this.Brain = new NeuralNetwork(BrainSpecs);
    }
  }

  Update(TotalTime){
    this.Timer++;
    if (!this.HasLanded){
      if (!this.IsTouchingPlatform()){
        this.Body.ApplyGravity();
      }
      //this.Control(TotalTime);
      this.Body.Update();
      this.IsTouchingPlatform(TotalTime);
      this.UpdateScore(TotalTime);
      this.UpdateInputs();
      this.Think();
    }
  }

  Think(){
    let Output = this.Brain.Predict(this.Inputs);
    if (Output[0] > 0.5) this.Accelerate();
    if (!this.IsTouchingPlatform()){
      if (Output[1] < Output[2]){
        this.Rotate(-0.5);
      }
      else {
        this.Rotate(0.5);
      }
    }
  }

  UpdateInputs(){
    this.Inputs[0] = this.Body.Velocity.x;
    this.Inputs[1] = this.Body.Velocity.y;
    this.Inputs[2] = this.Body.RotationVelocity;
    this.Inputs[3] = this.Body.Angle;
    this.Inputs[4] = PlatformX.Body.PosY - this.Body.PosY;
    this.Inputs[5] = PlatformX.Body.PosX - this.Body.PosX;
  }

  UpdateScore(TotalTime){
    if (!this.HasLanded && !this.HasCrashed){
      this.Score = Math.round(this.StartDistance / dist(this.Body.PosX, this.Body.PosY, PlatformX.Body.PosX, PlatformX.Body.PosY) * 100);
      let TimerK = map(this.Timer, 0, TotalTime, 2, 1);
      this.Score *= TimerK;
      this.Score /= 10;
    }
  }

  Mutate(MutationRate){
    this.Brain.Mutate(MutationRate);
  }

  ChooseColor(){
    if (this.HasCrashed){
      this.Color = color(255, 0, 0);
    }
    else if (this.HasLanded){
      this.Color = color(0, 255, 0);
    }
  }

  RenderPointer(PlatformX){
    let Radius = windowHeight / 2 - 100;
    let Distance = dist(this.Body.PosX, this.Body.PosY, PlatformX.Body.PosX, PlatformX.Body.PosY);
    const K = Radius / Distance;
    const X = (PlatformX.Body.PosX - this.Body.PosX) * K;
    const Y = (PlatformX.Body.PosY - this.Body.PosY) * K;
    const PointerX = this.ScreenPosX + X;
    const PointerY = this.ScreenPosY + Y;
    angleMode(DEGREES);
    let Angle = acos(X / Radius);
    if (Y < 0)
      Angle = -Angle;
    push();
    fill(246, 202, 9);
    translate(PointerX, PointerY);
    rotate(Angle);
    triangle(0, 9 * 0.67, 0, -9 * 0.67, 30 * 0.67, 0);
    pop();
  }

  RenderSideThrusters(GlobalScale){
    if (this.Rotating == "Right" && !this.HasLanded){
      push();
      fill(200);
      noStroke();
      translate(this.ScreenPosX, this.ScreenPosY);
      rotate(this.Body.Angle);
      quad(-15 * GlobalScale, -22.5 * GlobalScale, -15 * GlobalScale, -37.5 * GlobalScale, -35 * GlobalScale, -44.5 * GlobalScale, -35 * GlobalScale, -17.5 * GlobalScale);
      pop();
    }
    else if (this.Rotating == "Left" && !this.HasLanded){
      push();
      fill(200);
      noStroke();
      translate(this.ScreenPosX, this.ScreenPosY);
      rotate(this.Body.Angle);
      quad(15 * GlobalScale, -22.5 * GlobalScale, 15 * GlobalScale, -37.5 * GlobalScale, 35 * GlobalScale, -44.5 * GlobalScale, 35 * GlobalScale, -17.5 * GlobalScale);
      pop();
    }
    push();
    translate(this.ScreenPosX, this.ScreenPosY);
    rotate(this.Body.Angle);
    fill(40);
    stroke(150);
    rectMode(CENTER);
    rect(15 * GlobalScale, -30 * GlobalScale, 10 * GlobalScale, 23 * GlobalScale);
    rect(-15 * GlobalScale, -30 * GlobalScale, 10 * GlobalScale, 23 * GlobalScale);
    pop();
  }

  RenderFlame(GlobalScale){
    if (this.IsAccelerating){
      let StartX;
      let StartY;
      let MidLeftX;
      let MidLeftY;
      let MidRightX;
      let MidRightY;
      let EndX;
      let EndY;

      const DrawX = this.ScreenPosX;
      const DrawY = this.ScreenPosY;
      StartX = DrawX + cos(this.Body.Angle + 90) * 65 * GlobalScale;
      StartY =  DrawY + sin(this.Body.Angle + 90) * 65 * GlobalScale;
      MidLeftX = StartX + cos(this.Body.Angle + 90) * 30 * GlobalScale + cos(this.Body.Angle) * -15 * GlobalScale;
      MidLeftY = StartY + sin(this.Body.Angle + 90) * 30 * GlobalScale + sin(this.Body.Angle) * -15 * GlobalScale;
      MidRightX = StartX + cos(this.Body.Angle + 90) * 30 * GlobalScale + cos(this.Body.Angle) * 15 * GlobalScale;
      MidRightY = StartY + sin(this.Body.Angle + 90) * 30 * GlobalScale + sin(this.Body.Angle) * 15 * GlobalScale;
      EndX = StartX + cos(this.Body.Angle + 90) * 70 * GlobalScale;
      EndY = StartY + sin(this.Body.Angle + 90) * 70 * GlobalScale;

      push();
      fill(255, 0, 0);
      stroke(255, 0, 0);
      strokeWeight(2);
      bezier(StartX, StartY, MidLeftX, MidLeftY, MidLeftX, MidLeftY, EndX, EndY);
      bezier(StartX, StartY, MidRightX, MidRightY, MidRightX, MidRightY, EndX, EndY);
      pop();
    }
    this.IsAccelerating = false;
  }

  RecalculateCoordinats(GlobalScale, GlobalCamera, PlatformX){
    let XDistance = PlatformX.Body.PosX - this.Body.PosX;
    let YDistance = PlatformX.Body.PosY - this.Body.PosY;
    XDistance *= GlobalScale;
    YDistance *= GlobalScale;
    this.ScreenPosX = PlatformX.Body.PosX - XDistance;
    this.ScreenPosY = PlatformX.Body.PosY - YDistance;
    this.ScreenPosX -= GlobalCamera.PosX;
    this.ScreenPosY -= GlobalCamera.PosY;
  }

  Render(GlobalCamera, GlobalScale, PlatformX, Type){
    this.ChooseColor();
    if (Type)
      this.RecalculateCoordinats(GlobalScale, GlobalCamera, PlatformX);
    else{
      this.ScreenPosX = this.Body.PosX - GlobalCamera.PosX;
      this.ScreenPosY = this.Body.PosY - GlobalCamera.PosY;
      this.RenderPointer(PlatformX);
    }
    this.RenderFlame(GlobalScale);
    this.RenderSideThrusters(GlobalScale);
    push();
    rectMode(CENTER)
    translate(this.ScreenPosX, this.ScreenPosY);
    rotate(this.Body.Angle);
    fill(200);
    rect(0, 7.5 * GlobalScale, 30 * GlobalScale, 135 * GlobalScale);
    fill(100);
    triangle(15 * GlobalScale, 45 * GlobalScale, 15 * GlobalScale, 75 * GlobalScale, 30 * GlobalScale, 105 * GlobalScale);
    triangle(-15 * GlobalScale, 45 * GlobalScale, -15 * GlobalScale, 75 * GlobalScale, -30 * GlobalScale, 105 * GlobalScale);
    stroke(100);
    stroke(1);
    fill(60);
    circle(0, -30 * GlobalScale, 25 * GlobalScale);
    fill(this.Color);
    circle(0, -30 * GlobalScale, 20 * GlobalScale);
    noStroke();
    quad(15 * GlobalScale, -7.5 * GlobalScale, 15 * GlobalScale, 7.5 * GlobalScale, -15 * GlobalScale, 37.5 * GlobalScale, -15 * GlobalScale, 22.5 * GlobalScale);
    quad(-15 * GlobalScale, -7.5 * GlobalScale, -15 * GlobalScale, 7.5 * GlobalScale, 15 * GlobalScale, 37.5 * GlobalScale, 15 * GlobalScale, 22.5 * GlobalScale);
    stroke(100);
    fill(100);
    triangle(0, -60 * GlobalScale, 15 * GlobalScale, -60 * GlobalScale, 0, -105 * GlobalScale);
    triangle(0, -60 * GlobalScale, -15 * GlobalScale, -60 * GlobalScale, 0, -105 * GlobalScale);
    pop();
  }

  StandingLogic(TotalTime){
    if (!this.HasLanded && !this.HasCrashed)
      this.CountLandingScore(TotalTime);
    this.Body.Velocity.x -=  this.Body.Velocity.x * 0.03;
    if (abs(this.Body.Angle) < 15 && abs(this.Body.Velocity.mag()) < 7 && abs(this.Body.PosX - PlatformX.Body.PosX) <= 145){
      if(abs(this.Body.Angle) >= 5){
        this.Body.RotationVelocity += this.Body.Angle * -0.1;
      }
      else{
        this.Body.RotationVelocity = 0;
        this.Body.Angle = 0;
        if (this.Body.PosY > PlatformX.Body.PosY - PlatformX.Body.Height / 2 - this.Body.Height / 2)
          this.Body.PosY = PlatformX.Body.PosY - PlatformX.Body.Height / 2 - this.Body.Height / 2;
      }
    }
    else{
      this.HasCrashed = true;
    }
    if (this.Body.Velocity.y > 0)
      this.Body.Velocity.y = 0;
    if (!this.HasCrashed){
      this.HasLanded = true;
    }

    this.CountFinalScore();
  }

  CountLandingScore(TotalTime){
    let BodyAngle = abs(this.Body.Angle);
    let AngleK = map(BodyAngle, 0, 30, 2, 1);
    let BodyVelocty = abs(this.Body.Velocity.mag())
    let VelocityK = map(BodyVelocty, 0, 20, 2, 1);
    if (dist(this.Body.PosX, this.Body.PosY, PlatformX.Body.PosX, PlatformX.Body.PosY) < 122.5){
      this.Score = this.StartDistance / 122.5 * 100;
      let TimerK = map(this.Timer, 0, TotalTime, 2, 1);
      this.Score *= TimerK;
      this.Score /= 10;
    }
    this.Score *= AngleK * VelocityK * 2;
  }

  CountFinalScore(){
    if (!this.FixatedScore){
      if (this.HasCrashed) this.Score *= 5;
      if (this.HasLanded) this.Score *= 10;
      this.FixatedScore = true;
    }
  }

  IsTouchingPlatform(TotalTime){
    let flag = false;
    for (let i = 0; i < this.Body.Edges.length; ++i){
     for (let j = 0; j < PlatformX.Body.Edges.length; ++j){
       if (this.Body.Edges[i].Cast(PlatformX.Body.Edges[j])){
         flag = true;
       }
     }
   }
   if (flag){
     this.StandingLogic(TotalTime);
     return true;
   }
   else{
     return false;
   }
  }

  Rotate(Force){
      this.Body.SumOfRotationalForces += Force;
      if (Force > 0)
        this.Rotating = "Right";
      else if (Force < 0)
        this.Rotating = "Left";
      else
        this.Rotating = "False";
  }

  Accelerate(){
    this.IsAccelerating = true;
    let XDrag;
    let YDrag;
    let FinalForce;
    XDrag = this.Drag.y * cos(this.Body.Angle + 90);
    YDrag = this.Drag.y * sin(this.Body.Angle + 90);
    FinalForce = createVector(XDrag, YDrag);
    this.Body.ApplyForce(FinalForce);
  }

  Control(TotalTime){
    if (keyIsDown(UP_ARROW)){
      this.Accelerate();
    }
    if (!this.IsTouchingPlatform(TotalTime)){
      if (keyIsDown(LEFT_ARROW)){
        this.Rotate(-0.5);
      }
      if (keyIsDown(RIGHT_ARROW)){
        this.Rotate(0.5);
      }
    }
  }

  static CrossOver(Parent1, Parent2){
    let Parent1Brain = Parent1.Brain.Copy();
    let Parent2Brain = Parent2.Brain.Copy();
    let ChildsBrain = NeuralNetwork.CrossOver(Parent1Brain, Parent2Brain);
    let Child = new Rocket;
    Child.Brain = ChildsBrain.Copy();
    return Child;
  }
}
