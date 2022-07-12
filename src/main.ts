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
    //forgot the this.contains so it always thinks it's colliding because the segments are infinite
    if(x2==x1){
      const x = x1
      const gradC = (y3-y4)/(x3-x4)
      const d = y3 - (gradC)*x3
      const y = gradC*x1+d
      const interesctingPoint = new coordinate(x,y)
      if (this.contains(interesctingPoint) && s.contains(interesctingPoint)){
        console.log(`Point: x=${x},y=${y}`)
        return interesctingPoint
      }
      return null
    }

    if(x3==x4){
      const x = x3
      const gradA = (y2-y1)/(x1-x2)
      const b = y2 - (gradA)*x3
      const y = gradA*x3+b
      const interesctingPoint = new coordinate(x,y)
      if (this.contains(interesctingPoint) && s.contains(interesctingPoint)){
        console.log(`Point: x=${x},y=${y}`)
        return interesctingPoint
      }
      return null
    }
//if two lines verticals 
    const gradA = (y2-y1)/(x2-x1)
    const gradC = (y3-y4)/(x3-x4)
    const b = y1 - (gradA)*x1
    const d = y3 - (gradC)*x3

     // parallel
     if(gradA == gradC) {
       if(b==d) {      
         const interesctingPoint = new coordinate(x1,x2)
         if (this.contains(interesctingPoint) && s.contains(interesctingPoint)){
           console.log(`Point: x=${x1},y=${x2}`)
           return interesctingPoint
         }
         return null
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
    //console.log("null")
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
    //detect collision with another circle
    collideWith(anotherCircle: Circle){
      const minDistance = Math.sqrt((anotherCircle.centre.x - this.centre.x) +(anotherCircle.centre.y - this.centre.y))
      const distance = this.radius + anotherCircle.radius
      if (distance < minDistance){
        return true
      }
      return false
    }
  }

  //create polygon
  class Polygon{
    mass: number
    colour: string = 'pink'
    points: coordinate[]
    dx: number
    dy: number
    angularRotation:number
    //... puts array (Variadic Parameter) 
    constructor(...points: coordinate[]){
      this.points = points
      this.dx = 0
      this.dy = 0
      this.mass = 1
      this.angularRotation = 0
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
      this.rotateCentre(this.angularRotation)
      this.translate(dx,dy)
    }

    //method in polygon class detecting collisions
    collideWith(p:Polygon): coordinate[]{
      const collisions : coordinate[] = []
      const l1 = p.listSegments()
      const l2 = this.listSegments()
      for(let i =0; i< l1.length;i++){
        for(let j=0; j<l2.length;j++){
          const c = l1[i].checkForIntersectingPoints(l2[j])
          //there is intersection
          if(c != null){
            //add interesction point in the array
            console.log(`segment ${i} and ${j} intersect at x=${c.x},y=${c.y}`)
            collisions.push(c)
          }
         
        }
      }

      return collisions
    }

    //list the segments of the polygon
    listSegments():finiteSegment[]{
      const segments: finiteSegment[] = []
      for(let i=0; i< this.points.length;i++){
        //the modulo is because we loop back to zero when we finish drawing the shape, the modulo limits the sequence into modulo, i cannot be greater than the modulo
        //modulo creates sequences that repeat
        const s = new finiteSegment(this.points[i],this.points[(i+1)%this.points.length])
        segments.push(s)
      }
      return segments
    }
    //resolving collisions: collision works but shape becomes trapped to avoid this I need to seperate the shape when they collide
    //collision solve displacement

    resolveCollision(p: Polygon){
      this.dx = -this.dx
      this.dy = -this.dy 
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
    //update for circles
    
    //update the position of all the shapes
    for(let i = 0; i< this.shapes.length;i++){
      this.shapes[i].update(dt)     
      // request animation frame asks to call function next time the computer draws the matrix of the screen (web browser screen) call function animation loop with the date 
    }
    //change colour of the shape if it's colliding
    for(let i = 0; i<this.shapes.length;i++){
      for(let j=0; j<this.shapes.length;j++){
        if(i != j){
          const c = this.shapes[i].collideWith(this.shapes[j])
          if(c.length>0){
            this.shapes[i].resolveCollision(this.shapes[j])
          }
        }
      }
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
    const newSquare = createRect(new coordinate(80,80), 50, 30)
    newSquare.rotateCentre(Math.PI/4)
    newSquare.dy = 0.5
    newSquare.dx = 0.2
    newSquare.angularRotation = 0.02

    const square2 = createRect(new coordinate(50,50),10,10)
    square2.dx = 0.1
    square2.dy = 0.1
    square2.colour = "orange"

    const square3 = createRect(new coordinate(100,100),10,30)
    square3.dy = 0.1
    square3.colour = "violet"
    square3.angularRotation = 0.07

    const ground = createRect(new coordinate(0,400),1200,10)
    ground.colour = "green"
    ground.mass = 1

    const wallLeft = createRect(new coordinate(3,0),5,800)
    wallLeft.colour = "black"
    const wallRight = createRect(new coordinate(600,0),5,800)
    wallRight.colour = "black"
    const top = createRect(new coordinate(0,0),1200,5)
    top.colour = "black"

    game.addShape(ground)
    game.addShape(wallLeft)
    game.addShape(wallRight)
    game.addShape(top)

    game.addShape(newSquare)
    game.addShape(square2)
    game.addShape(square3)

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
