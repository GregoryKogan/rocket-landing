let PlatformPostionMemoryX;
let PlatformPostionMemoryY;

function Train(Eterations){
  for (let i = 0; i < Eterations; ++i){
    if (Rockets.length != Population){
      for (let k = 0; k < CurrentGroup.length; ++k){
        if (CurrentGroup[k].HasCrashed)
          SavedRockets.push(CurrentGroup.splice(k, 1)[0]);
      }
      if (CurrentGroup.length == 0){
        if (CurrentGroupNum <= Groups - 1){
          CurrentGroupNum++;
          HasLandedThisGen += HasLandedThisGroup;
          CountSuccesRate();
          if (Rockets.length != Population){
            CurrentGroup = Rockets.splice(0, RocketsPerGroup);
          }
        }
        else{
          HasLandedThisGen += HasLandedThisGroup;
          CountSuccesRate();
          HasLandedThisGen = 0;
          CreateNextGeneration();
          CurrentGroupNum = 1;
          CurrentGroup = Rockets.splice(0, RocketsPerGroup);
        }
      }

      for (let i = 0; i < CurrentGroup.length; ++i){
        CurrentGroup[i].Update(LifeSpan);
        if (CurrentGroup[i].Timer > LifeSpan)
          SavedRockets.push(CurrentGroup.splice(i, 1)[0]);
      }
    }
  }
}

function CalculatePlatformScatter(){
  if (AverageSuccesPrecentage >= 10 && PlatformScatter < windowWidth / 2 - 150){
    PlatformScatter += 5;
  }
  else if (AverageSuccesPrecentage <= 2 && AverageSuccesPrecentage > 0)
    if (PlatformScatter > 30)
      PlatformScatter -= 15;
    else
      PlatformScatter = 0;
  else if (AverageSuccesPrecentage == 0)
    PlatformScatter = 0;
}

let TenLastSuccesRates = [];

function PutSuccess(X){
  TenLastSuccesRates.push(X);
  if (TenLastSuccesRates.length > 10)
    TenLastSuccesRates.splice(0, 1);
  let Sum = 0;
  for (let i = 0; i < TenLastSuccesRates.length; ++i){
    Sum += TenLastSuccesRates[i];
  }
  AverageSuccesPrecentage = Math.floor(Sum / TenLastSuccesRates.length);
}

function CountSuccesRate(){
  let Sum = 0;
  for (let i = 0; i < CurrentGroup.length; ++i){
    if (CurrentGroup[i].HasLanded == true)
      Sum++;
  }
  HasLandedThisGroup = Sum;
  SuccesPercentage = Math.floor((HasLandedThisGen + HasLandedThisGroup) / Population * 100);
}

function IsAnyBodyAlive(){
  let Flag = false;
  for (let i = 0; i < Population; ++i){
    if (!Rockets[i].HasCrashed)
      Flag = true;
  }
  return Flag;
}

let ShouldSave = false;
function keyPressed(){
  if (key == "s"){
    ShouldSave = true;
  }
}

function LoadPretrainedModel(){
  let PreTrainedModelBrain = NeuralNetwork.Deserialize(PreTrainedModelBrainData);
  PreTrainedModel = new Rocket;
  PreTrainedModel.Brain = PreTrainedModelBrain;
}
