class coordinate {
  constructor(public x: number, public y: number){
    this.x = x
    this.y = y
  }
//translation
  translate(dx:number,dy:number){
    this.x = this.x + dx 
    this.y = this.y + dy
  }
//rotation
rotate(centre: coordinate, angle: number){
  const x = this.x - centre.x
  const y = this.y - centre.y
  const rotX = x*Math.cos(angle) - y*Math.sin(angle)
  const rotY = x*Math.sin(angle) + y*Math.cos(angle)
  this.x = rotX + centre.x 
  this.y = rotY + centre.y
}

}

class finiteSegment{
  s1: coordinate
  s2: coordinate
  colour: string = 'blue'
  constructor(a:coordinate, b:coordinate){
    this.s1 = a
    this.s2 = b
  }

  changeColour(colour: string){
    this.colour = colour
  }

  draw(ctx: CanvasRenderingContext2D){
    ctx.strokeStyle = this.colour
    ctx.beginPath()
		ctx.moveTo(this.s1.x, this.s1.y)
		ctx.lineTo(this.s2.x, this.s2.y)
		ctx.stroke()   
  }
  //result of a function is either coordiante or null
  checkForIntersectingPoints(s: finiteSegment): coordinate|null{
    const x1 = this.s1.x
    const y1 = this.s1.y
    const x2 = this.s2.x
    const y2 = this.s2.y
    const x3 = s.s1.x
    const y3 = s.s1.y
    const x4 = s.s2.x
    const y4 = s.s2.y
    //ternary operator ? = if and : else
    //order matters
    // 2 line vertical adn same position, if the same x for both x1,x2 and x3,x4, then return one of the point
    if(x1==x2 && x3==x4) {
      if(x1 == x3) return new coordinate(x1,y1) 
      return null
    }

    //if one line is vertical.. 
    if(x2==x1){
      const x = x1
      const gradC = (y3-y4)/(x3-x4)
      const d = y3 - (gradC)*x3
      const y = gradC*x1+d
      return new coordinate(x,y)
    }

    if(x3==x4){
      const x = x3
      const gradA = (y2-y1)/(x1-x2)
      const b = y2 - (gradA)*x3
      const y = gradA*x3+b
      return new coordinate(x,y)
    }
//if two lines verticals 
    const gradA = (y2-y1)/(x2-x1)
    const gradC = (y3-y4)/(x3-x4)
    const b = y1 - (gradA)*x1
    const d = y3 - (gradC)*x3

     // parallel
     if(gradA == gradC) {
       if(b==d) {
         return new coordinate(x1,x2)
       }
      return null
    }

    //find coordinate point where they interesect
    const x = (d-b)/(gradA - gradC)
    const y = (gradA*x + b)
    const interesctingPoint = new coordinate (x,y)
    
    //verify that the point belong to segment
    if (this.contains(interesctingPoint) && s.contains(interesctingPoint)){
      console.log(`Point: x=${x},y=${y}`)
      return interesctingPoint
    }
    console.log("null")
    return null
 }

  contains(p: coordinate): boolean {
    let x1 = this.s1.x
    let y1 = this.s1.y
    let x2 = this.s2.x
    let y2 = this.s2.y
    let x = p.x
    let y = p.y
    //checks if the collision point is between the limit of segments, if you multiply the difference, and are negative it is within bounds
    console.log("calculated")
    return (x - x1) * (x - x2) <= 0 && (y - y1) * (y - y2) <= 0
  }
}

  class Circle {
    colour: string = 'black'
    constructor( public centre: coordinate, public radius: number){
      this.centre = centre
      this.radius = radius
    }
    changeColour(colour: string){
      this.colour = colour
    }
    draw(ctx: CanvasRenderingContext2D){
      ctx.strokeStyle = this.colour
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(this.centre.x, this.centre.y, this.radius, 0, 2 * Math.PI )
      ctx.stroke()
    }
  }

  //create polygon
  class Polygon{
    colour: string = 'pink'
    points: coordinate[]
    dx: number
    dy: number
    //... puts array (Variadic Parameter) 
    constructor(...points: coordinate[]){
      this.points = points
      this.dx = 0
      this.dy = 0
    }
    changeColour(colour:string){
      this.colour = colour
    }

    draw(ctx: CanvasRenderingContext2D){
      ctx.beginPath()
      //use iteration
      ctx.moveTo(this.points[0].x, this.points[0].y)
        //length for array
        for(let i = 1; i < this.points.length; i ++){
          ctx.lineTo(this.points[i].x, this.points[i].y)
        }
        ctx.closePath()
        ctx.fillStyle = this.colour
        ctx.fill()
      
    }

    //calculate the barycentre (centre of gravity) coordinate using averages
    calculateCentre(): coordinate{
      let x = 0
      let y = 0
      for(let i =0; i< this.points.length;i ++){
        x += this.points[i].x
        y += this.points[i].y
      }
      return new coordinate(x/this.points.length, y/this.points.length)
    }
    //calculate centre and apply the angle so you don't need to type two lines of code
    rotateCentre(angle:number) {
      const centre = this.calculateCentre()
      this.rotate(centre,angle)
    }

    //create rotation function
    rotate(centre:coordinate, angle: number){
        //centre = this.calculateCentre()
          for(let i = 0; i< this.points.length;i ++){
            this.points[i].rotate(centre,angle)
          }
    }

    // create a translate function
    translate(dx:number,dy:number){
      for(let i = 0; i < this.points.length; i ++){
        this.points[i].translate(dx,dy)
      }
    }
    //how much the x and y change by millisecond
    update(time: number){
      const dx = this.dx*time
      const dy = this.dy*time
      console.log(`dx=${dx},dy=${dy}`)
      this.translate(dx,dy)
    }


 }
  
 //draw Rectangle
 //1: Top Left, 2: Top Right, 3: Bottom Right, 4: Bottom Left
 function createRect(centre:coordinate, length:number, height:number): Polygon {
  const x1 = centre.x - length/2
  const y1 = centre.y - height/2
  const x2 = centre.x + length/2
  const y2 = centre.y - height/2
  const x3 = centre.x + length/2
  const y3 = centre.y + height/2
  const x4 = centre.x - length/2
  const y4 = centre.y + height/2
  console.log("centre " + centre.x, centre.y)
  return new Polygon(new coordinate(x1,y1),new coordinate(x2,y2), new coordinate(x3,y3), new coordinate(x4,y4))
}

//... as many parameter as you like
class GameEngine{
  shapes: Polygon []
  currentTime: Date
  constructor(...shapes:Polygon[]){
    console.log('constructor game')
    this.shapes = shapes
    this.currentTime = new Date() //creates new date out of the timer
  }
  draw(ctx: CanvasRenderingContext2D){
    for(let i = 0; i < this.shapes.length; i ++){
      this.shapes[i].draw(ctx)}
  }

  addShape(shape: Polygon){
    this.shapes.push(shape) //add shape to array
  }
  //clears the screen
  clear(ctx:CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  animationLoop(time: Date,ctx:CanvasRenderingContext2D){
    //getTime gets the time value in milliseconds since the 1 janvier 1970
    const dt = time.getTime()-this.currentTime.getTime()
    this.currentTime = time
    //update the position of all the shapes
    for(let i = 0; i< this.shapes.length;i++){
      this.shapes[i].update(dt)     
      // request animation frame asks to call function next time the computer draws the matrix of the screen (web browser screen) call function animation loop with the date 
    }
    //clear the screen
    this.clear(ctx)
    //draw the shapes again
    this.draw(ctx)
    //next time u redraw the matrix of the screen you call animation loop again
    //arow function => (return)
    window.requestAnimationFrame(()=>this.animationLoop(new Date(),ctx))

  }
}
//global variable 
const game = new GameEngine()

  function initialise(){
    console.log("init")
    const newSquare = createRect(new coordinate(200,300), 50, 30)
    //const centre = newSquare.calculateCentre()
    newSquare.rotateCentre(Math.PI/4)
    newSquare.dy = 0
    newSquare.dx = 0

    const square2 = createRect(new coordinate(50,50),100,100)
    square2.dy = 0
    square2.colour = "orange"
   
    game.addShape(newSquare)
    game.addShape(square2)

    const canvas = document.getElementById('canvas') as HTMLCanvasElement // convert element to a type- not necessary but tells compiler that this object is a canvas
    const ctx = canvas.getContext('2d')
      if(ctx != null){
        game.animationLoop(new Date(),ctx)
      }
      else{
        console.log("error")
      }
    }

  
  window.onload = initialise
  export{initialise}
