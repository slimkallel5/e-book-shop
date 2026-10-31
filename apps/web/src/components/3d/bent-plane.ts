import * as THREE from 'three';

/**
 * BentPlaneGeometry
 * Based on Paul Henschel / Paul West bent-plane algorithm used in pmndrs demos (e.g. cards-with-border-radius).
 * Bends a PlaneGeometry along the X-axis along a cylinder of given radius.
 */
export class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius: number, width: number, height: number, widthSegments: number = 20, heightSegments: number = 20) {
    super(width, height, widthSegments, heightSegments);

    const p = this.attributes.position.array as Float32Array;
    for (let i = 0; i < p.length; i += 3) {
      const x = p[i];
      const angle = x / radius;
      p[i] = Math.sin(angle) * radius;
      p[i + 2] = -Math.cos(angle) * radius + radius;
    }
    this.computeVertexNormals();
  }
}
