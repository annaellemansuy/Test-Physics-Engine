import { coordinate } from "./coordinate";
import {Vector} from "./vector"
import {Polygon} from "./Polygon"

class Circle {
  colour: string = 'black';
  constructor(public centre: coordinate, public radius: number) {
    this.centre = centre;
    this.radius = radius;
  }
  changeColour(colour: string) {
    this.colour = colour;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.colour;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.centre.x, this.centre.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  //detect collision with another circle
  collideWith(anotherCircle: Circle) {
    const minDistance = Math.sqrt((anotherCircle.centre.x - this.centre.x)^2 + (anotherCircle.centre.y - this.centre.y)^2);
    const distance = this.radius + anotherCircle.radius;
    if (distance < minDistance) {
      return true;
    }
    return false;
  }
  /*
  //detect collisoin with another rectangle
  collideRectwith(polygon: Polygon){
    const polygoncentre = polygon.calculateCentre()
    const minDist = Math.sqrt((polygoncentre.x - this.centre.x)^2 + (polygoncentre.y - this.centre.y)^2)
    const maxRadius = 
    const dist = this.radius + 
    */
  }
}
