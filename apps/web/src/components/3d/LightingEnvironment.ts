import * as THREE from 'three';

export interface LibraryLighting {
  ambientLight: THREE.AmbientLight;
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  warmGlowPointLight: THREE.PointLight;
  emeraldAccentLight: THREE.PointLight;
}

export function createLibraryLighting(scene: THREE.Scene): LibraryLighting {
  const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.7);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff0db, 1.2);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x1b543e, 0.6);
  fillLight.position.set(-6, -4, 4);
  scene.add(fillLight);

  const warmGlowPointLight = new THREE.PointLight(0xe5c158, 1.5, 20);
  warmGlowPointLight.position.set(0, 2, 4);
  scene.add(warmGlowPointLight);

  const emeraldAccentLight = new THREE.PointLight(0x123b2b, 1.0, 25);
  emeraldAccentLight.position.set(3, -2, -2);
  scene.add(emeraldAccentLight);

  return {
    ambientLight,
    keyLight,
    fillLight,
    warmGlowPointLight,
    emeraldAccentLight,
  };
}
