import { coordinate } from "./coordinate";
import { finiteSegment } from "./finiteSegment";

//create polygon
export class Polygon {
  mass: number;
  colour: string = 'pink';
  points: coordinate[];
  dx: number;
  dy: number;
  angularRotation: number;
  //... puts array (Variadic Parameter) 
  constructor(...points: coordinate[]) {
    this.points = points;
    this.dx = 0;
    this.dy = 0;
    this.mass = 1;
    this.angularRotation = 0;
  }
  changeColour(colour: string) {
    this.colour = colour;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    //use iteration
    ctx.moveTo(this.points[0].x, this.points[0].y);
    //length for array
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = this.colour;
    ctx.fill();

  }

  //calculate the barycentre (centre of gravity) coordinate using averages
  calculateCentre(): coordinate {
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.points.length; i++) {
      x += this.points[i].x;
      y += this.points[i].y;
    }
    return new coordinate(x / this.points.length, y / this.points.length);
  }
  //calculate centre and apply the angle so you don't need to type two lines of code
  rotateCentre(angle: number) {
    const centre = this.calculateCentre();
    this.rotate(centre, angle);
  }

  //create rotation function
  rotate(centre: coordinate, angle: number) {
    //centre = this.calculateCentre()
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].rotate(centre, angle);
    }
  }

  // create a translate function
  translate(dx: number, dy: number) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].translate(dx, dy);
    }
  }
  //how much the x and y change by millisecond
  update(time: number) {
    const dx = this.dx * time;
    const dy = this.dy * time;
    console.log(`dx=${dx},dy=${dy}`);
    this.rotateCentre(this.angularRotation);
    this.translate(dx, dy);
  }

  //method in polygon class detecting collisions
  collideWith(p: Polygon): coordinate[] {
    const collisions: coordinate[] = [];
    const l1 = p.listSegments();
    const l2 = this.listSegments();
    for (let i = 0; i < l1.length; i++) {
      for (let j = 0; j < l2.length; j++) {
        const c = l1[i].checkForIntersectingPoints(l2[j]);
        //there is intersection
        if (c != null) {
          //add interesction point in the array
          console.log(`segment ${i} and ${j} intersect at x=${c.x},y=${c.y}`);
          collisions.push(c);
        }

      }
    }

    return collisions;
  }

  //list the segments of the polygon
  listSegments(): finiteSegment[] {
    const segments: finiteSegment[] = [];
    for (let i = 0; i < this.points.length; i++) {
      //the modulo is because we loop back to zero when we finish drawing the shape, the modulo limits the sequence into modulo, i cannot be greater than the modulo
      //modulo creates sequences that repeat
      const s = new finiteSegment(this.points[i], this.points[(i + 1) % this.points.length]);
      segments.push(s);
    }
    return segments;
  }
  //resolving collisions: collision works but shape becomes trapped to avoid this I need to seperate the shape when they collide
  //collision solve displacement
  resolveCollision(p: Polygon) {
    this.dx = -this.dx;
    this.dy = -this.dy;
  }
}
