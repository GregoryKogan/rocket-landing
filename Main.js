let Rockets = [];
let SavedRockets = [];
let PlatformX;
let PlatformScatter = 0;
let DemonstrationScatter;

let PreTrainedModel;
let PreTrainedModelBrainData;

let Mode = "Learning";

let Population = 1500;
let Groups = 10;
const RocketsPerGroup = Population / Groups;
let CurrentGroupNum = 1;
let CurrentGroup = [];
let LifeSpan = 600;

let TimeScale = 1;
let GlobalCamera;
let GlobalScale = 1;

function preload(){
  PreTrainedModelBrainData = loadJSON("PreTrainedModel.json");
}

function setup() {
  DetectDevice();
  PlatformX = new Platform;
  LoadPretrainedModel();
  for (let i = 0; i < Population; ++i){
    Rockets[i] = new Rocket;
  }
  GlobalCamera = new Camera;
  CurrentGroup = Rockets.splice(0, RocketsPerGroup);
  if (Device == "Laptop")
    createCanvas(windowWidth - 5, windowHeight - 5);
  else
    createCanvas(windowWidth + 1, windowHeight + 1);
  SetUpUI();
  frameRate(60);
}

function draw() {
  background(18);
  TimeScale = TimeScaleSlider.value();
  ApplyUI();
  if (Mode == "Learning" && Device != "Phone"){
    TestCounter = 0;
    LandsCounter = 0;

    Train(TimeScale);

    if (ShowEveryone){
      for (let i = 0; i < CurrentGroup.length; ++i){
        CurrentGroup[i].Render(GlobalCamera, GlobalScale, PlatformX, "UnFollowing");
      }
      AdaptScale();
      GlobalCamera.GoTo(PlatformX.Body.PosX - (windowWidth / 2), PlatformX.Body.PosY - (windowHeight - 100));
      PlatformX.Render(GlobalScale, GlobalCamera);
      DrawSpawnPoint();
    }
    else{
      if (CurrentGroup.length > 0){
        if (TimeScale < 2){
          GlobalCamera.Follow(CurrentGroup[0].Body);
          AdaptScale(CurrentGroup[0].Body);
          CurrentGroup[0].Render(GlobalCamera, GlobalScale, PlatformX);
          PlatformX.Render(GlobalScale, GlobalCamera, CurrentGroup[0]);
        }
        else{
          GlobalCamera.GoTo(PlatformX.Body.PosX - (windowWidth / 2), PlatformX.Body.PosY - (windowHeight - 100));
          AdaptScale();
          CurrentGroup[0].Render(GlobalCamera, GlobalScale, PlatformX, "UnFollowing");
          PlatformX.Render(GlobalScale, GlobalCamera);
          DrawSpawnPoint();
        }
      }
    }
  }
  else if (Mode == "Demonstration" || Device == "Phone"){
    if (Device != "Phone")
      DemonstrationScatter = DemonstrationScatterSlider.value();
    else
      DemonstrationScatter = windowHeight / 1.5;
    for (let i = 0; i < TimeScale; ++i){
      if (PreTrainedModel.HasCrashed){
        TestCounter++;
        PreTrainedModel = new Rocket(PreTrainedModel);
        PlatformX = new Platform(random(windowWidth / 2 - DemonstrationScatter, windowWidth / 2 + DemonstrationScatter), random(0, DemonstrationScatter));
      }

      PreTrainedModel.Update(LifeSpan);
      if (PreTrainedModel.Timer > LifeSpan){
        if (PreTrainedModel.HasLanded)
          LandsCounter++;
        PreTrainedModel.HasCrashed = true;
      }
    }

    if (TimeScale <= 1){
      GlobalCamera.Follow(PreTrainedModel.Body);
      AdaptScale(PreTrainedModel.Body);
      PreTrainedModel.Render(GlobalCamera, GlobalScale, PlatformX);
      PlatformX.Render(GlobalScale, GlobalCamera, PreTrainedModel);
    }
    else{
      GlobalCamera.GoTo(PlatformX.Body.PosX - (windowWidth / 2), PlatformX.Body.PosY - (windowHeight - 100));
      AdaptScale();
      PreTrainedModel.Render(GlobalCamera, GlobalScale, PlatformX, "UnFollowing");
      PlatformX.Render(GlobalScale, GlobalCamera);
      DrawSpawnPoint();
    }
  }
}
