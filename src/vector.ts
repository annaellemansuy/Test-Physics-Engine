export class Vector {
  constructor(public x: number, public y: number){}
  Smultipy(s: number){
    //scalar blah blah blah quantity
    return new Vector(this.x * s, this.y*s)
  }
  add(v:Vector){
    return new Vector(this.x + v.x, this.y +v.y ) 
  }
  subtract(v:Vector){
    return new Vector(this.x - v.x, this.y - v.y ) 
  }
  multiply(v:Vector){
    return new Vector(this.x*v.x, this.y*v.y ) 
  }
  dotProduct(v: Vector) {
    return this.x * v.x + this.y*v.y
  }
  directionOfVector(): number {
    //returns angle in radians from x axis to a point
    return Math.atan2(this.y, this.x)
  }
}