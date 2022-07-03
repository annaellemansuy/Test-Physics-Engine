class coordinate {
  constructor(public x: number, public y: number){
    this.x = x
    this.y = y
  }
}

class finiteSegment{
  s1: coordinate
  s2: coordinate
  constructor(a:coordinate, b:coordinate){
    this.s1 = a
    this.s2 = b
  }
  draw(ctx: CanvasRenderingContext2D){
    ctx.beginPath()
		ctx.moveTo(this.s1.x, this.s1.y)
		ctx.lineTo(this.s2.x, this.s2.y)
		ctx.stroke()   
  }
  }


  function initialise(){
    const c1 = new coordinate(50,50)
    const c2 = new coordinate (500,500)
    const seg1 = new finiteSegment(c1,c2)
    const seg2 = new finiteSegment(new coordinate(0,0), new coordinate(20,40))
    const canvas = document.getElementById('canvas') as HTMLCanvasElement // convert element to a type- not necessary but tells compiler that this object is a canvas
    const ctx = canvas.getContext('2d')
      if(ctx != null){
        seg1.draw(ctx)
        seg2.draw(ctx)
      }
      else{
        console.log("error")
      }
    }
  window.onload = initialise
  export{initialise}
