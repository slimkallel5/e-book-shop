import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, Image, ActivityIndicator } from 'react-native';
import * as THREE from 'three';
import { layout, shadows, colors } from '../../theme/tokens';

export interface Book3DProps {
  coverUrl?: string;
  width?: number;
  height?: number;
  depth?: number;
  interactive?: boolean;
  onPress?: () => void;
  style?: any;
}

export const Book3D: React.FC<Book3DProps> = ({
  coverUrl,
  width = 160,
  height = 160 * layout.a4AspectRatio,
  depth = 22,
  interactive = true,
  onPress,
  style,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      setHasWebGL(false);
      setIsLoading(false);
      return;
    }

    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      setHasWebGL(false);
      setIsLoading(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const aspect = height / width;
    const meshWidth = 2.0;
    const meshHeight = meshWidth * aspect;
    const meshDepth = 0.28;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3db, 1.2);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    const goldPoint = new THREE.PointLight(0xe5c158, 0.8, 10);
    goldPoint.position.set(-2, 1, 2);
    scene.add(goldPoint);

    const geometry = new THREE.BoxGeometry(meshWidth, meshHeight, meshDepth);

    const spineMaterial = new THREE.MeshStandardMaterial({
      color: 0x123b2b,
      roughness: 0.4,
      metalness: 0.1,
    });

    const pagesMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbf6ea,
      roughness: 0.7,
      metalness: 0.05,
    });

    const textureLoader = new THREE.TextureLoader();
    let frontMaterial: THREE.Material = spineMaterial;

    if (coverUrl) {
      textureLoader.load(
        coverUrl,
        (texture: THREE.Texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          frontMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.35,
            metalness: 0.05,
          });

          bookMesh.material = [
            pagesMaterial,
            spineMaterial,
            pagesMaterial,
            pagesMaterial,
            frontMaterial,
            spineMaterial,
          ];
          setIsLoading(false);
        },
        undefined,
        () => {
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }

    const bookMesh = new THREE.Mesh(geometry, [
      pagesMaterial,
      spineMaterial,
      pagesMaterial,
      pagesMaterial,
      frontMaterial,
      spineMaterial,
    ]);

    bookMesh.rotation.y = -0.25;
    bookMesh.rotation.x = 0.05;
    scene.add(bookMesh);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
    } catch (e) {
      setHasWebGL(false);
      setIsLoading(false);
      return;
    }

    container.appendChild(renderer.domElement);

    let targetRotY = -0.25;
    let targetRotX = 0.05;

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetRotY = x * 0.6;
      targetRotX = -y * 0.4;
    };

    const handlePointerLeave = () => {
      targetRotY = -0.25;
      targetRotX = 0.05;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mouseleave', handlePointerLeave);

    let animationId: number;
    const animate = () => {
      bookMesh.rotation.y += (targetRotY - bookMesh.rotation.y) * 0.1;
      bookMesh.rotation.x += (targetRotX - bookMesh.rotation.x) * 0.1;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
    };
  }, [coverUrl, width, height, interactive]);

  if (!hasWebGL || Platform.OS !== 'web') {
    return (
      <View style={[styles.fallbackContainer, { width, height }, style]}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.fallbackCover} resizeMode="cover" />
        ) : (
          <View style={styles.emptyBookCover} />
        )}
      </View>
    );
  }

  return (
    <View style={[{ width, height }, styles.container, style]}>
      <div
        ref={mountRef as any}
        style={{
          width,
          height,
          position: 'relative',
          cursor: onPress ? 'pointer' : 'default',
        }}
        onClick={onPress}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.accentLight} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 59, 43, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackContainer: {
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  fallbackCover: {
    width: '100%',
    height: '100%',
  },
  emptyBookCover: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});
