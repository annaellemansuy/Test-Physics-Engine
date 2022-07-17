import { coordinate } from "./coordinate"
import { GameEngine } from "./GameEngine"
import { Polygon } from "./Polygon"
import { Vector } from "./vector"

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


//global variable 
const game = new GameEngine()

  function initialise(){
    console.log("init")
    const newSquare = createRect(new coordinate(80,80), 50, 30)
    newSquare.rotateCentre(Math.PI/4)
    newSquare.velocity = new Vector(0,0)
    newSquare.angularRotation = 0.0

    const square2 = createRect(new coordinate(50,50),10,10)
    square2.velocity = new Vector(10,10)
    square2.colour = "orange"

    const square3 = createRect(new coordinate(100,100),10,30)
    square3.velocity = new Vector(100,100)
    square3.colour = "violet"
    square3.angularRotation = 0.07

    const ground = createRect(new coordinate(0,400),1200,20)
    ground.immobile = true
    ground.colour = "pink"
    ground.mass = 100000000

    const wallLeft = createRect(new coordinate(3,0),20,800)
    wallLeft.colour = "pink"
    wallLeft.immobile = true
    wallLeft.mass = 100000000

    const wallRight = createRect(new coordinate(600,0),20,800)
    wallRight.colour = "pink"
    wallRight.immobile = true
    wallRight.mass = 100000000

    const top = createRect(new coordinate(0,0),1200,20)
    top.colour = "pink"
    top.immobile = true
    top.mass = 100000000

    game.addShape(ground)
    game.addShape(wallLeft)
    game.addShape(wallRight)
    game.addShape(top)

    game.addShape(newSquare)
    //game.addShape(square2)
    //game.addShape(square3)

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
