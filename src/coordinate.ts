export class coordinate {
  constructor(public x: number, public y: number) {
    this.x = x;
    this.y = y;
  }
  //translation
  translate(dx: number, dy: number) {
    this.x = this.x + dx;
    this.y = this.y + dy;
  }
  //rotation
  rotate(centre: coordinate, angle: number) {
    const x = this.x - centre.x;
    const y = this.y - centre.y;
    const rotX = x * Math.cos(angle) - y * Math.sin(angle);
    const rotY = x * Math.sin(angle) + y * Math.cos(angle);
    this.x = rotX + centre.x;
    this.y = rotY + centre.y;
  }
}
