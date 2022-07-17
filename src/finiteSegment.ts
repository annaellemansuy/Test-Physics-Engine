import { coordinate } from "./coordinate";

export class finiteSegment {
  s1: coordinate;
  s2: coordinate;
  colour: string = 'blue';
  constructor(a: coordinate, b: coordinate) {
    this.s1 = a;
    this.s2 = b;
  }

  changeColour(colour: string) {
    this.colour = colour;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.colour;
    ctx.beginPath();
    ctx.moveTo(this.s1.x, this.s1.y);
    ctx.lineTo(this.s2.x, this.s2.y);
    ctx.stroke();
  }
  //result of a function is either coordiante or null
  checkForIntersectingPoints(s: finiteSegment): coordinate | null {
    const x1 = this.s1.x;
    const y1 = this.s1.y;
    const x2 = this.s2.x;
    const y2 = this.s2.y;
    const x3 = s.s1.x;
    const y3 = s.s1.y;
    const x4 = s.s2.x;
    const y4 = s.s2.y;
    //ternary operator ? = if and : else
    //order matters
    // 2 line vertical adn same position, if the same x for both x1,x2 and x3,x4, then return one of the point
    if (x1 == x2 && x3 == x4) {
      if (x1 == x3)
        return new coordinate(x1, y1);
      return null;
    }

    //if one line is vertical.. 
    //forgot the this.contains so it always thinks it's colliding because the segments are infinite
    if (x2 == x1) {
      const x = x1;
      const gradC = (y3 - y4) / (x3 - x4);
      const d = y3 - (gradC) * x3;
      const y = gradC * x1 + d;
      const interesctingPoint = new coordinate(x, y);
      if (this.contains(interesctingPoint) && s.contains(interesctingPoint)) {
        console.log(`Point: x=${x},y=${y}`);
        return interesctingPoint;
      }
      return null;
    }

    if (x3 == x4) {
      const x = x3;
      const gradA = (y2 - y1) / (x1 - x2);
      const b = y2 - (gradA) * x3;
      const y = gradA * x3 + b;
      const interesctingPoint = new coordinate(x, y);
      if (this.contains(interesctingPoint) && s.contains(interesctingPoint)) {
        console.log(`Point: x=${x},y=${y}`);
        return interesctingPoint;
      }
      return null;
    }
    //if two lines verticals 
    const gradA = (y2 - y1) / (x2 - x1);
    const gradC = (y3 - y4) / (x3 - x4);
    const b = y1 - (gradA) * x1;
    const d = y3 - (gradC) * x3;

    // parallel
    if (gradA == gradC) {
      if (b == d) {
        const interesctingPoint = new coordinate(x1, x2);
        if (this.contains(interesctingPoint) && s.contains(interesctingPoint)) {
          console.log(`Point: x=${x1},y=${x2}`);
          return interesctingPoint;
        }
        return null;
      }
      return null;
    }

    //find coordinate point where they interesect
    const x = (d - b) / (gradA - gradC);
    const y = (gradA * x + b);
    const interesctingPoint = new coordinate(x, y);

    //verify that the point belong to segment
    if (this.contains(interesctingPoint) && s.contains(interesctingPoint)) {
      console.log(`Point: x=${x},y=${y}`);
      return interesctingPoint;
    }
    //console.log("null")
    return null;
  }

  contains(p: coordinate): boolean {
    let x1 = this.s1.x;
    let y1 = this.s1.y;
    let x2 = this.s2.x;
    let y2 = this.s2.y;
    let x = p.x;
    let y = p.y;
    //checks if the collision point is between the limit of segments, if you multiply the difference, and are negative it is within bounds
    console.log("calculated");
    return (x - x1) * (x - x2) <= 0 && (y - y1) * (y - y2) <= 0;
  }
}
