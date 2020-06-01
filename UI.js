let Device = "Laptop";
let Os = "Win";

let Orientation = undefined;

let TimeScaleSlider;
let DemonstrationScatterSlider;
let ShowAllButton;
let ShowPreTrainedModelButton;

let GenCounter = 1;
let SuccesPercentage = 0;
let TestCounter = 0;
let LandsCounter = 0;
let AverageSuccesPrecentage = 0;
let HasLandedThisGen = 0;
let HasLandedThisGroup = 0;

let ShowEveryone = false;

function SetUpUI(){
  DetectDevice();
  DetectOrientation();

  TimeScaleSlider = createSlider(1, 30, 1, 1);
  TimeScaleSlider.position(13, 13);
  TimeScaleSlider.style("width", "120px");

  if (Device != "Phone"){
    DemonstrationScatterSlider = createSlider(0, windowWidth / 2 - 150, windowWidth / 2 - 150, 1);
    DemonstrationScatterSlider.position(13, 50);
    DemonstrationScatterSlider.style("width", "120px");
    DemonstrationScatterSlider.hide();

    ButtonColor = color(18);

    ShowAllButton = createButton("Show All");
    ShowAllButton.position(13, 47);
    ShowAllButton.size(120, 25);
    ShowAllButton.style('font-size', '12px');
    ShowAllButton.style('background-color', ButtonColor);
    ShowAllButton.style('color', 'white');
    ShowAllButton.style('font-family', 'Roboto-Regular');
    ShowAllButton.mousePressed(ShowAll);

    ShowPreTrainedModelButton = createButton("Run Pretrained Model");
    ShowPreTrainedModelButton.position(windowWidth / 2 - 67, 13);
    ShowPreTrainedModelButton.size(134, 25);
    ShowPreTrainedModelButton.style('font-size', '12px');
    ShowPreTrainedModelButton.style('background-color', ButtonColor);
    ShowPreTrainedModelButton.style('color', 'white');
    ShowPreTrainedModelButton.style('font-family', 'Roboto-Regular');
    ShowPreTrainedModelButton.mousePressed(GoToDemonstrationMode);
  }

  if (Device == "Phone")
    GoToDemonstrationMode();
}

function ApplyUI(){
  fill(255);
  if (Mode == "Learning"){
    textSize(15);
    textFont(RegularFont);
    text(TimeScaleSlider.value() + "X - TimeScale", 143, 30);
    text(Math.round(frameRate()) + "FPS", 7, windowHeight - 20);
    text(GenCounter + " Generation", windowWidth - 201, 27);
    text(CurrentGroupNum + " Group", windowWidth - 201, 47);
    CountSuccesRate();
    text(SuccesPercentage + "% This Gen Success Rate ", windowWidth - 201, 67);
    text(AverageSuccesPrecentage + "% Average Success Rate", windowWidth - 201, 87);
    text(Math.round(PlatformScatter / (windowWidth / 2 - 150) * 100) + "% Platform Dispersion", windowWidth - 201, 107);
    push();
    textAlign(RIGHT);
    textFont(RegularFont);
    text("G.Koganovskiy 2020", windowWidth - 15, windowHeight - 10);
    text("v1.4", windowWidth - 15, windowHeight - 25);
    pop();
  }
  if (Mode == "Demonstration"){
    if (Device == "Laptop"){
      textSize(15);
      textFont(RegularFont);
      text(TimeScaleSlider.value() + "X - TimeScale", 143, 30);
      text(Math.round(frameRate()) + "FPS", 10, windowHeight - 20);
      text(TestCounter + " Tests", windowWidth - 201, 100);
      text(LandsCounter + " Successful Landings", windowWidth - 201, 120);
      if (TestCounter != 0)
        text((Math.round(LandsCounter / TestCounter * 100000)) / 1000 + "% Success Rate", windowWidth - 201, 140);
      else
      text("0% Success Rate", windowWidth - 201, 140);
      text(Math.round(DemonstrationScatterSlider.value() / (windowWidth / 2 - 150) * 100) + "% Platform Dispersion", 143, 67);
      push();
      textAlign(CENTER);
      text("This rocket was produced on:", windowWidth - 120, 27);
      text("6375 Generation", windowWidth - 120, 47);
      pop();
      push();
      textAlign(RIGHT);
      textFont(RegularFont);
      text("G.Koganovskiy 2020", windowWidth - 15, windowHeight - 10);
      text("v1.4", windowWidth - 15, windowHeight - 25);
      pop();
    }
    else{
      textSize(11);
      textFont(RegularFont);
      text(TimeScaleSlider.value() + "X - TimeScale", 143, 30);
      text(Math.round(frameRate()) + "FPS", 10, windowHeight - 10);
      text(TestCounter + " Tests", 10, 100);
      text(LandsCounter + " Successful Landings", 10, 115);
      if (TestCounter != 0)
        text((Math.round(LandsCounter / TestCounter * 100000)) / 1000 + "% Success Rate", 10, 130);
      else
        text("0% Success Rate", 10, 130);
      text("This rocket was produced on:", 10, 60);
      text("6375 Generation", 10, 75);

      push();
      textAlign(RIGHT);
      textFont(RegularFont);
      text("Full version available", windowWidth - 10, 30);
      text("only on PC", windowWidth - 10, 45);
      text("G.Koganovskiy 2020", windowWidth - 10, windowHeight - 10);
      text("v1.4", windowWidth - 10, windowHeight - 25);
      pop();
    }
  }
}


function GoToDemonstrationMode(){
  if (Mode != "Demonstration"){
    if (Device == "Laptop"){
      ShowPreTrainedModelButton.html("Continue Learning");
      ShowAllButton.hide();
      DemonstrationScatterSlider.show();
    }
    PlatformPostionMemoryX = PlatformX.Body.PosX;
    PlatformPostionMemoryY = PlatformX.Body.PosY - windowHeight + 100;
    Mode = "Demonstration";
  }
  else{
    ShowPreTrainedModelButton.html("Run Pretrained Model");
    PlatformX = new Platform(PlatformPostionMemoryX, PlatformPostionMemoryY);
    Mode = "Learning";
    ShowAllButton.show();
    DemonstrationScatterSlider.hide();
  }
}

function ShowAll(){
  if (ShowEveryone == true){
    ShowAllButton.html("Show All");
    ShowEveryone = false;
  }
  else{
    ShowAllButton.html("Show Random");
    ShowEveryone = true;
  }
}

function DrawSpawnPoint(){
  let XDistance = PlatformX.Body.PosX - windowWidth / 2;
  let YDistance = PlatformX.Body.PosY - 50;
  XDistance *= GlobalScale;
  YDistance *= GlobalScale;
  let ScreenPosX = PlatformX.Body.PosX - XDistance;
  let ScreenPosY = PlatformX.Body.PosY - YDistance;
  ScreenPosX -= GlobalCamera.PosX;
  ScreenPosY -= GlobalCamera.PosY;
  push();
  fill(246, 202, 9);
  circle(ScreenPosX, ScreenPosY, 22);
  fill(18);
  circle(ScreenPosX, ScreenPosY, 17);
  fill(246, 202, 9);
  circle(ScreenPosX, ScreenPosY, 7);
  textAlign(CENTER);
  textSize(14);
  textFont(RegularFont);
  text("Spawn", ScreenPosX, ScreenPosY + 35 * 0.67);
  pop();
}

function DetectDevice(){
  if (min(displayWidth / 4.29, displayHeight / 4.29) >= 150) Device = "Laptop";
  else Device = "Phone";
  if (navigator.userAgent.indexOf("like Mac") != -1){
    Os = "IOS";
    Device = "Phone";
  }
}

function mousePressed(){
  if (Os != "IOS"){
    fullscreen(true);
    GoingFullScreen = 60;
  }
}

function windowResized(){
  if (Device == "Laptop")
    resizeCanvas(windowWidth - 5, windowHeight - 5);
  else if (HasTurned())
    window.location.reload(false);
  else
    resizeCanvas(windowWidth + 1, windowHeight + 1);
}

function HasTurned(){
  if (Orientation == "Landscape" && windowWidth < windowHeight){
    DetectOrientation();
    return true;
  }
  if (Orientation == "Portait" && windowWidth > windowHeight){
    DetectOrientation();
    return true;
  }
  return false;
}

function DetectOrientation(){
  if (windowWidth > windowHeight)
    Orientation = "Landscape";
  else
    Orientation = "Portait";
}
