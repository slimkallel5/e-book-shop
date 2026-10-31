import React, { useRef, useMemo } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text as RNText } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Image, Text } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { useLanguage } from '../../context/LanguageContext';

export interface Real3DBookProps {
  coverUrl: string;
  currentPage: number;
  totalPages: number;
  isOpen: boolean;
  onToggleOpen?: () => void;
  pageImages?: string[];
  pageContent?: {
    title?: string;
    subtitle?: string;
    text?: string;
    level?: string;
    highlights?: string[];
  };
}

/**
 * AnimatedPaperPage
 * An interactive flipping paper sheet that rotates around the spine hinge
 * and dynamically bends (curls) during the flip motion.
 */
function AnimatedPaperPage({
  flipProgress, // 0 = resting on right side (next), 1 = flipped to left side (prev)
  frontImage,
  backImage,
}: {
  flipProgress: number;
  frontImage?: string;
  backImage?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const currentAngle = useRef(0);

  // Target angle: 0 rad (flat on right) to -Math.PI rad (flat on left)
  const targetAngle = -flipProgress * Math.PI;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    easing.damp(currentAngle, 'current', targetAngle, 0.2, delta);
    meshRef.current.rotation.y = currentAngle.current;

    // Curl/bend paper geometry based on rotation speed/progress
    const curl = Math.sin(Math.min(1, Math.max(0, -currentAngle.current / Math.PI)) * Math.PI) * 0.12;
    meshRef.current.position.z = Math.abs(curl);
  });

  return (
    <group position={[0, 0, 0.05]}>
      {/* Pivot hinge at spine x = 0 */}
      <mesh ref={meshRef} position={[0.7, 0, 0]}>
        <planeGeometry args={[1.4, 2.0, 16, 16]} />
        <meshStandardMaterial
          color="#fbfbfe"
          roughness={0.4}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
        {frontImage && (
          <Image
            url={frontImage}
            transparent
            scale={[1.38, 1.98]}
            position={[0, 0, 0.002]}
            side={THREE.FrontSide}
          />
        )}
        {backImage && (
          <Image
            url={backImage}
            transparent
            scale={[1.38, 1.98]}
            position={[0, 0, -0.002]}
            rotation={[0, Math.PI, 0]}
            side={THREE.FrontSide}
          />
        )}
      </mesh>
    </group>
  );
}

/**
 * Realistic Book 3D Mesh
 * Contains Hardcover Front, Spine, Core Paper Block, Back Cover, and Animated Cover Hinge
 */
function BookModel({
  coverUrl,
  currentPage,
  totalPages,
  isOpen,
  pageImages,
  pageContent,
}: Real3DBookProps) {
  const coverHingeRef = useRef<THREE.Group>(null!);
  const targetHingeAngle = isOpen ? -Math.PI * 0.95 : 0;

  useFrame((_, delta) => {
    if (!coverHingeRef.current) return;
    easing.damp(coverHingeRef.current.rotation, 'y', targetHingeAngle, 0.25, delta);
  });

  // Calculate paper flip progress between pages
  const flipProgress = totalPages > 1 ? Math.min(1, (currentPage - 1) / (totalPages - 1)) : 0;

  return (
    <group position={[isOpen ? 0.6 : 0, 0, 0]}>
      {/* Back Cover */}
      <mesh position={[0.7, 0, -0.05]}>
        <boxGeometry args={[1.45, 2.08, 0.04]} />
        <meshStandardMaterial color="#064e3b" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Gold-accented Spine */}
      <mesh position={[-0.03, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 2.08, 0.12]} />
        <meshStandardMaterial color="#b45309" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Core Paper Block (Pages Stack) */}
      <mesh position={[0.7, 0, 0]}>
        <boxGeometry args={[1.4, 2.02, 0.08]} />
        <meshStandardMaterial color="#fafaf9" roughness={0.8} />
      </mesh>

      {/* Left Inside Cover Page (Visible when open) */}
      {isOpen && (
        <group position={[-0.7, 0, 0.01]}>
          <Text
            position={[0, 0.6, 0.01]}
            fontSize={0.09}
            color="#0f172a"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.2}
            textAlign="center"
          >
            {pageContent?.title || 'المكتبة التربوية التونسية'}
          </Text>
          <Text
            position={[0, 0.35, 0.01]}
            fontSize={0.065}
            color="#047857"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.2}
            textAlign="center"
          >
            {pageContent?.subtitle || 'البرنامج البيداغوجي المعتمد'}
          </Text>
          <Text
            position={[0, -0.1, 0.01]}
            fontSize={0.055}
            color="#334155"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.2}
            textAlign="center"
            lineHeight={1.4}
          >
            {pageContent?.text ||
              'دليل مدرسي بيداغوجي وفق البرامج الرسمية لوزارة التربية والتعليم بالجمهورية التونسية.'}
          </Text>
          <Text
            position={[0, -0.75, 0.01]}
            fontSize={0.05}
            color="#64748b"
            anchorX="center"
            anchorY="middle"
          >
            ❖ 3D Interactive Edition ❖
          </Text>
        </group>
      )}

      {/* Animated Turning Paper Page */}
      {isOpen && (
        <AnimatedPaperPage
          flipProgress={flipProgress}
          frontImage={pageImages?.[currentPage - 1]}
          backImage={pageImages?.[currentPage]}
        />
      )}

      {/* Front Hardcover with animated hinge opening */}
      <group position={[0, 0, 0.05]} ref={coverHingeRef}>
        <mesh position={[0.7, 0, 0]}>
          <boxGeometry args={[1.45, 2.08, 0.03]} />
          <meshStandardMaterial color="#065f46" roughness={0.3} metalness={0.1} />

          {/* Book Front Cover Art */}
          <Image
            url={coverUrl}
            transparent
            scale={[1.42, 2.04]}
            position={[0, 0, 0.017]}
            side={THREE.FrontSide}
          />
        </mesh>
      </group>
    </group>
  );
}

export function Real3DBook(props: Real3DBookProps) {
  const { t } = useLanguage();
  const safeCover =
    props.coverUrl || '/assets/covers/arabic1.jpg';

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <pointLight position={[0, 0, 3]} intensity={0.6} />

          <BookModel {...props} coverUrl={safeCover} />

          {/* 360-degree interactive orbit controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.8}
            maxDistance={5.0}
            autoRotate={!props.isOpen}
            autoRotateSpeed={1.0}
          />
        </Canvas>
      ) : null}

      {/* Floating 360 Hint Banner */}
      <View style={styles.hintBadge}>
        <RNText style={styles.hintText}>
          🔄 {t('bookshelf.rotate360') || 'اسحب بالماوس لتدوير الكتاب 360° بحرية'}
        </RNText>
      </View>

      {/* Toggle Book Open / Close Button */}
      {props.onToggleOpen && (
        <TouchableOpacity style={styles.toggleBtn} onPress={props.onToggleOpen}>
          <RNText style={styles.toggleBtnText}>
            📖 {props.isOpen ? (t('bookshelf.closeBook') || 'إغلاق غلاف الكتاب') : (t('bookshelf.openBook') || 'فتح الكتاب وتصفح الصفحات')}
          </RNText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 480,
    backgroundColor: '#03140e',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  hintBadge: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    pointerEvents: 'none',
  },
  hintText: {
    color: '#fef08a',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleBtn: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#d97706',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  toggleBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
