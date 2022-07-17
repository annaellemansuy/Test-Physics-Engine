import { Polygon } from "./Polygon";

//... as many parameter as you like
export class GameEngine {
  shapes: Polygon[];
  currentTime: Date;
  constructor(...shapes: Polygon[]) {
    console.log('constructor game');
    this.shapes = shapes;
    this.currentTime = new Date(); //creates new date out of the timer
  }
  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].draw(ctx);
    }
  }

  addShape(shape: Polygon) {
    this.shapes.push(shape); //add shape to array
  }
  //clears the screen
  clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  animationLoop(time: Date, ctx: CanvasRenderingContext2D) {
    //getTime gets the time value in milliseconds since the 1 janvier 1970
    const dt = time.getTime() - this.currentTime.getTime();
    this.currentTime = time;
    //update for circles
    //update the position of all the shapes
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].update(dt);
      // request animation frame asks to call function next time the computer draws the matrix of the screen (web browser screen) call function animation loop with the date 
    }
    //change colour of the shape if it's colliding
    for (let i = 0; i < this.shapes.length; i++) {
      for (let j = 0; j < this.shapes.length; j++) {
        if (i != j) {
          const c = this.shapes[i].collideWith(this.shapes[j]);
          if (c.length > 0) {
            this.shapes[i].resolveCollision(this.shapes[j]);
          }
        }
      }
    }

    //clear the screen
    this.clear(ctx);
    //draw the shapes again
    this.draw(ctx);
    //next time u redraw the matrix of the screen you call animation loop again
    //arow function => (return)
    window.requestAnimationFrame(() => this.animationLoop(new Date(), ctx));

  }
}
