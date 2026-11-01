import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, useWindowDimensions, Image } from 'react-native';
import * as THREE from 'three';
import { createLibraryLighting } from './LightingEnvironment';
import { LibraryCameraController } from './CameraController';
import { createFloatingBooks, updateFloatingBooks, FloatingBookItem } from './FloatingBooks';
import { colors } from '../../theme/tokens';

export interface ThreeDSceneProps {
  children?: React.ReactNode;
  showFloatingBooks?: boolean;
  intensity?: number;
  interactiveCamera?: boolean;
}

const fallbackAsset = require('../../../assets/back-to-school-3d.jpg');

export const ThreeDScene: React.FC<ThreeDSceneProps> = ({
  children,
  showFloatingBooks = true,
  interactiveCamera = true,
}) => {
  const containerRef = useRef<View>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      setHasWebGL(false);
      return;
    }

    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d2118);
    scene.fog = new THREE.FogExp2(0x0a2319, 0.08);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    createLibraryLighting(scene);

    const cameraController = new LibraryCameraController(camera, prefersReducedMotion);

    let floatingBooks: FloatingBookItem[] = [];
    if (showFloatingBooks) {
      floatingBooks = createFloatingBooks(scene, isMobile ? 3 : 6);
    }

    const particleCount = isMobile ? 40 : 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe5c158,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'default',
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to 2D background:', e);
      setHasWebGL(false);
      return;
    }

    const domElement = renderer.domElement;
    domElement.style.position = 'fixed';
    domElement.style.top = '0';
    domElement.style.left = '0';
    domElement.style.width = '100%';
    domElement.style.height = '100%';
    domElement.style.pointerEvents = 'none';
    domElement.style.zIndex = '-1';

    document.body.appendChild(domElement);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactiveCamera) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      cameraController.handlePointerMove(normX, normY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      cameraController.update(delta);
      if (showFloatingBooks) {
        updateFloatingBooks(floatingBooks, elapsedTime, prefersReducedMotion);
      }

      if (!prefersReducedMotion) {
        particles.rotation.y = elapsedTime * 0.02;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(animationFrameId);
      setHasWebGL(false);
    };
    domElement.addEventListener('webglcontextlost', handleContextLost, false);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('webglcontextlost', handleContextLost);
      if (domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [showFloatingBooks, interactiveCamera, isMobile]);

  return (
    <View style={styles.container} ref={containerRef}>
      {!hasWebGL && (
        <View style={styles.fallbackContainer} pointerEvents="none">
          <Image source={fallbackAsset} style={styles.fallbackImage} resizeMode="cover" />
          <View style={styles.fallbackOverlay} />
        </View>
      )}
      <View style={styles.foregroundLayer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    minHeight: '100%',
    position: 'relative',
  },
  fallbackContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
  },
  fallbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 35, 25, 0.7)',
  },
  foregroundLayer: {
    flex: 1,
    zIndex: 1,
    position: 'relative',
  },
});
