function CreateNextGeneration(){
  AdaptScale();
  GenCounter++;
  PutSuccess(SuccesPercentage);
  CalculatePlatformScatter();
  PlatformX = new Platform(random(windowWidth / 2 - PlatformScatter, windowWidth / 2 + PlatformScatter), random(0, PlatformScatter));
  CalculateFitness();
  for (let i = 0; i < Population; ++i){
    if (Math.random() > 0.5)
      Rockets[i] = MakeOne();
    else
      Rockets[i] = PickOne();
    Rockets[i].Mutate(0.01);
  }

  Rockets[0] = new Rocket(SavedRockets[FindBest()]);
  for (let i = 1; i < Groups; ++i){
    for (let j = 0; j < 8; j++){
      Rockets[RocketsPerGroup * i + j] = new Rocket(SavedRockets[FindBest()]);
      Rockets[RocketsPerGroup * i + j].Mutate(0.005);
    }
    Rockets[RocketsPerGroup * i].Color = color(246, 202, 9);
  }

  if (ShouldSave){
     let Rocket = SavedRockets[FindBest()];
     saveJSON(Rocket.Brain, "Rocket.json");
     ShouldSave = false;
  }

  SavedRockets = [];
}

function FindBest(){
  let MaxScore = 0;
  let BestIndex = 0;
  for (let i = 0; i < SavedRockets.length; ++i){
    if (SavedRockets[i].Score > MaxScore){
      MaxScore = SavedRockets[i].Score;
      BestIndex = i;
    }
  }
  BestScoreEver = MaxScore;
  return BestIndex;
}

function MakeOne(){
  let Parent1 = PickOne();
  let Parent2 = PickOne();
  let Child = new Rocket(Rocket.CrossOver(Parent1, Parent2));
  return Child;
}

function PickOne(){
  let AncestorIndex = 0;
  let WheelOfFortune = Math.random();
  while (WheelOfFortune > 0) {
    WheelOfFortune -= SavedRockets[AncestorIndex].Fitness;
    AncestorIndex++;
  }
  AncestorIndex--;

  let NiceRocket = SavedRockets[AncestorIndex];
  let Child = new Rocket(NiceRocket);
  return Child;
}

function CalculateFitness(){
  let Sum = 0;
  for (let i = 0; i < SavedRockets.length; ++i){
    Sum += (SavedRockets[i].Score * SavedRockets[i].Score);
  }
  for (let i = 0; i < SavedRockets.length; ++i){
    SavedRockets[i].Fitness = (SavedRockets[i].Score * SavedRockets[i].Score) / Sum;
  }
}
