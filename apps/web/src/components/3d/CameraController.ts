import * as THREE from 'three';

export class LibraryCameraController {
  private camera: THREE.PerspectiveCamera;
  private targetX: number = 0;
  private targetY: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;
  private isReducedMotion: boolean = false;

  constructor(camera: THREE.PerspectiveCamera, isReducedMotion: boolean = false) {
    this.camera = camera;
    this.isReducedMotion = isReducedMotion;
  }

  public setReducedMotion(reduced: boolean): void {
    this.isReducedMotion = reduced;
  }

  public handlePointerMove(normalizedX: number, normalizedY: number): void {
    if (this.isReducedMotion) return;
    this.targetX = normalizedX * 0.45;
    this.targetY = normalizedY * 0.25;
  }

  public update(deltaTime: number = 0.016): void {
    if (this.isReducedMotion) {
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      return;
    }

    const factor = Math.min(deltaTime * 4.0, 1.0);
    this.currentX += (this.targetX - this.currentX) * factor;
    this.currentY += (this.targetY - this.currentY) * factor;

    this.camera.position.x = this.currentX;
    this.camera.position.y = this.currentY;
    this.camera.lookAt(0, 0, 0);
  }
}
