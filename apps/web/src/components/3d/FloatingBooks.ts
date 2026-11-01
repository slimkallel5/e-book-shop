import * as THREE from 'three';

export interface FloatingBookItem {
  mesh: THREE.Group;
  initialY: number;
  speed: number;
  rotSpeedX: number;
  rotSpeedY: number;
  phase: number;
}

export function createFloatingBooks(scene: THREE.Scene, count: number = 6): FloatingBookItem[] {
  const books: FloatingBookItem[] = [];
  const bookGeometry = new THREE.BoxGeometry(0.85, 1.2, 0.16);
  const coverColors = [0x1b543e, 0x8b5a2b, 0x7b1fa2, 0x0a3323, 0x243e33, 0xc29b38];

  for (let i = 0; i < count; i++) {
    const group = new THREE.Group();

    const coverMaterial = new THREE.MeshStandardMaterial({
      color: coverColors[i % coverColors.length],
      roughness: 0.35,
      metalness: 0.1,
    });

    const pageEdgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5eedc,
      roughness: 0.7,
      metalness: 0.0,
    });

    const materials = [
      pageEdgeMaterial,
      coverMaterial,
      pageEdgeMaterial,
      pageEdgeMaterial,
      coverMaterial,
      coverMaterial,
    ];

    const bookMesh = new THREE.Mesh(bookGeometry, materials);
    group.add(bookMesh);

    const angle = (i / count) * Math.PI * 2;
    const radius = 3.8 + (i % 2) * 1.5;
    const x = Math.cos(angle) * radius;
    const y = ((i % 3) - 1) * 1.8;
    const z = Math.sin(angle) * 1.8 - 2.5;

    group.position.set(x, y, z);
    group.rotation.set(
      0.2 + (i * 0.15),
      0.3 + (i * 0.25),
      -0.15 + (i * 0.1)
    );

    scene.add(group);

    books.push({
      mesh: group,
      initialY: y,
      speed: 0.6 + (i % 3) * 0.3,
      rotSpeedX: 0.002 * ((i % 2 === 0) ? 1 : -1),
      rotSpeedY: 0.003 * ((i % 2 === 0) ? -1 : 1),
      phase: i * 1.2,
    });
  }

  return books;
}

export function updateFloatingBooks(
  books: FloatingBookItem[],
  time: number,
  isReducedMotion: boolean = false
): void {
  if (isReducedMotion) return;

  books.forEach((item) => {
    item.mesh.position.y = item.initialY + Math.sin(time * item.speed + item.phase) * 0.18;
    item.mesh.rotation.x += item.rotSpeedX;
    item.mesh.rotation.y += item.rotSpeedY;
  });
}
