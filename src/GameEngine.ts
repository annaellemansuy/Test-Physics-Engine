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
  //sort the vertices according to the minimum Y
  //sort every pair in the array 
  sortDaShapeByY(){
    const compare = (a: Polygon, b: Polygon) =>{
      const aminY = a.minY()
      const BminY = b.minY()
      // comparion using the difference zerio if two elements are the same, positive if b > a, and negative if b<a
      return (aminY - BminY)
    }
    //sort for all array in javascript; sort sorts all the elements of the array but you need to give a comparison function
    this.shapes.sort(compare)
  }


  ApproximationOfCollisonTimeAndPosition(timespan: number, a: Polygon, b:Polygon){
    //unit of time you go in the past
    const timeStep = 0.1
    let updateInterval = timespan
    //while is report forever if
    while(updateInterval>0){
      a.update(-timeStep)
      b.update(-timeStep)
      const areTheyColliding = a.collideWith(b)
      if(areTheyColliding.length == 0){
        return updateInterval
      }
      updateInterval = updateInterval - timeStep
    }
    //if we don't find a solution we don't find a solution, if it's negative we stop 
    return -1
  }

  animationLoop(time: Date, ctx: CanvasRenderingContext2D) {
    //sort the array of the shapes
    this.sortDaShapeByY()
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
    //i is the iteration for all the array of shapes
    //j is also the iteration for all the array of shapes
    //if we have i and j it's a matrix of all the possible combinations
    //however, we only need half of the matrix because if not we will apply the force two times 
    for (let i = 0; i < this.shapes.length; i++) {
      const currentShape = this.shapes[i]
      for (let j = i+1; j < this.shapes.length; j++) {
        if (i != j) {
          const otherShape = this.shapes[j]
          //continue allows you to skip the steps below if it meets the condition 
          if(currentShape.immobile && otherShape.immobile){
            continue
          }
          const c = currentShape.collideWith(otherShape);
          if (c.length > 0) {
            this.ApproximationOfCollisonTimeAndPosition(dt,currentShape, otherShape)
            //stop shape from falling off the ground because it happens
            //the y axis is reversed  in a computer REMEMBER THAT
            if(otherShape.immobile && currentShape.velocity.y<0.1 && currentShape.velocity.y >=0){
              currentShape.immobile = true
            }
            
            currentShape.colour = 'red'
            currentShape.CalculateVelocityAfterCollision(otherShape)
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
