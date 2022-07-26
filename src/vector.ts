export class Vector {
  constructor(public x: number, public y: number) {}
  dotProduct(v: Vector) {
    return this.x * v.x + this.y * v.y
  }
  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y)
    return new Vector(this.x / length, this.y / length)
  }

  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  subtract(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  angleDirection(): number {
    return Math.atan2(this.y, this.x)
  }

  multiply(v: Vector) {
    return new Vector(this.x * v.x, this.y * v.y)
  }

  ScalarMultiplication(s: number) {
    return new Vector(this.x * s, this.y * s)
  }

  rotate(angle: number) {
    const x = this.x
    const y = this.y
    return new Vector(
      x * Math.cos(angle) - y * Math.sin(angle),
      x * Math.sin(angle) + y * Math.cos(angle)
    )
  }

}