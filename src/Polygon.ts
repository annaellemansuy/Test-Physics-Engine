import { coordinate } from "./coordinate";
import { finiteSegment } from "./finiteSegment";
import { Vector } from "./vector";
export const gravity = new Vector(0,9.81/10000)
//frame rate is very important only 60 frames per second, if the shape is moving too fast
//the frame rate cannot keep up iwth an object
//we need to caluclate when exactly they collide in between frame rates where they can't detect collisions
//create polygon
export class Polygon {
  mass: number;
  colour: string = 'pink';
  points: coordinate[];
  //I'm replacing dx and dy with veloccity
  //dx: number;
 // dy: number;
  angularRotation: number;
   velocity: Vector
   acceleration: Vector
   immobile: boolean
   friction: number
  

  //... puts array (Variadic Parameter) 
  constructor(...points: coordinate[]) {
    this.points = points;
    this.mass = 1;
    this.angularRotation = 0;
    this.velocity = new Vector(0,0)
    this.acceleration = gravity
    this.immobile = false
    this.friction = 1
  }
  changeColour(colour: string) {
    this.colour = colour;
  }
    //need to calucate minimum y of the vertex of the shape (coordinate in the array)
  //map function applies a function on each element in an array and return result
  // arrow in typescript declares the funciton more concise
  minY(): number{
    return Math.min(...this.points.map((point)=> point.y))
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
  //putting acceleration and fixed position
  update(time: number) {
    if (this.immobile == true){
      return
    }
    //velocity is velocity vector add acceleration 
    this.velocity = this.velocity.add(this.acceleration.ScalarMultiplication(time))
    const dx = this.velocity.x * time;
    const dy = this.velocity.y * time;
    this.rotateCentre(this.angularRotation);
    this.translate(dx, dy);
  }

  //calculating velocity between two objects after collision
  CalculateVelocityAfterCollision(p: Polygon) {
    const mass1 = this.mass
    const mass2 = p.mass
    const centre = this.calculateCentre()
    const otherCentre = p.calculateCentre()
    //calculate angle between the vector from the centres to the x axis
    const angle = Math.atan2(otherCentre.x - centre.x,otherCentre.y - centre.y)
    const velocity1 = this.velocity.rotate(angle)
    const velocity2 = p.velocity.rotate(angle)
    //conservation of momentum
    const speed1 = velocity1.ScalarMultiplication((mass1 - mass2) / (mass1 + mass2)).add(velocity2.ScalarMultiplication((2 * mass2) / (mass1 + mass2)))
    const velocity1Final = speed1.rotate(-angle)

    if(!this.immobile) {
       this.velocity = velocity1Final.ScalarMultiplication(this.friction)
    }
    const speed2 = velocity2.ScalarMultiplication((mass2 - mass1) / (mass1 + mass2)).add(velocity1.ScalarMultiplication((2 * mass1) / (mass1 + mass2)))
    const velocity2Final = speed2.rotate(-angle)

    if(!p.immobile) {
       p.velocity = velocity2Final.ScalarMultiplication(p.friction)
    }
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
    this.velocity = new Vector(-this.velocity.x, -this.velocity.y)
  }
}
