class Vector{
  constructor(x, y){
    this.x = null;
    this.y = null;
    if (x && y){
      this.x = x;
      this.y = y;
    }
  }

  Multiply(X){
    this.x *= X;
    this.y *= X;
  }

  static Multiply(V, X){
    V.x *= X;
    V.y *= X;
  }

  Add(V){
    this.x += V.x;
    this.y += V.y;
  }

  static Add(V1, V2){
    let Result = new Vector;
    Result.x = V1.x + V2.x;
    Result.y = V1.y + V2.y;
    return Result;
  }

  Substract(V){
    V.Multiply(-1);
    this.Add(V);
  }

  static Substract(V1, V2){
    let Result = new Vector;
    V2.Multiply(-1);
    Result = Vector.Add(V1, V2);
  }

  Set(x, y){
    this.x = x;
    this.y = y;
  }

  Magnitude(){
    const M = Math.sqrt(this.x * this.x + this.y * this.y);
    return M;
  }
}
