import React, { useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Text as RNText, TouchableOpacity, Platform } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { BentPlaneGeometry } from './bent-plane';
import { Book } from '../../mock/data';
import { useLanguage } from '../../context/LanguageContext';

interface CarouselCardProps {
  url: string;
  index: number;
  total: number;
  radius: number;
  book: Book;
  isActive: boolean;
  onSelect: (book: Book) => void;
}

function CarouselCard({ url, index, total, radius, book, isActive, onSelect }: CarouselCardProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const angle = (index / total) * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const rotationY = angle;

  const bentGeometry = useMemo(() => new BentPlaneGeometry(radius, 1.4, 2.0, 32, 32), [radius]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = hovered || isActive ? 1.08 : 1.0;
    easing.damp3(meshRef.current.scale, [targetScale, targetScale, targetScale], 0.15, delta);
  });

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <mesh
        ref={meshRef}
        geometry={bentGeometry}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(book);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        {/* Cover texture or styled material */}
        <meshStandardMaterial
          color={hovered || isActive ? '#f8fafc' : '#e2e8f0'}
          roughness={0.2}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
        <Image
          url={url}
          transparent
          side={THREE.DoubleSide}
          scale={[1.36, 1.96]}
          position={[0, 0, 0.01]}
        />
      </mesh>

      {/* Floating 3D Title under each curved book */}
      <Text
        position={[0, -1.25, 0.1]}
        fontSize={0.11}
        color={hovered || isActive ? '#f59e0b' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.4}
        textAlign="center"
      >
        {book.title?.ar || book.title?.fr || book.title?.en || ''}
      </Text>
    </group>
  );
}

function CarouselRig({
  books,
  radius,
  activeBook,
  onSelectBook,
}: {
  books: Book[];
  radius: number;
  activeBook: Book | null;
  onSelectBook: (book: Book) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Parallax pointer sway
    const targetY = -(state.pointer?.x || 0) * (Math.PI / 4);
    easing.dampE(groupRef.current.rotation, [0, targetY, 0], 0.25, delta);
    easing.damp3(groupRef.current.position, [0, -(state.pointer?.y || 0) * 0.2, 0], 0.25, delta);
  });

  return (
    <group ref={groupRef} position={[0, 0, -radius * 0.6]}>
      {books.map((book, idx) => {
        const coverUrl =
          (book as any).posterUrl ||
          book.coverUrl ||
          '/assets/covers/arabic1.jpg';

        return (
          <CarouselCard
            key={book.id || idx}
            url={coverUrl}
            index={idx}
            total={books.length}
            radius={radius}
            book={book}
            isActive={activeBook?.id === book.id}
            onSelect={onSelectBook}
          />
        );
      })}
    </group>
  );
}

interface ThreeBookCarouselProps {
  books: Book[];
  onOpenViewer: (book: Book) => void;
  onSelectBook?: (book: Book) => void;
}

export function ThreeBookCarousel({ books, onOpenViewer, onSelectBook }: ThreeBookCarouselProps) {
  const { language, t, isRTL } = useLanguage();
  const [activeBook, setActiveBook] = useState<Book | null>(books[0] || null);

  const displayBooks = useMemo(() => {
    if (books.length >= 6) return books.slice(0, 8);
    // If fewer than 6, duplicate or pad so the 360 circle fills nicely
    if (books.length > 0) {
      const padded: Book[] = [];
      while (padded.length < 6) {
        padded.push(...books);
      }
      return padded.slice(0, 8).map((b, i) => ({ ...b, id: `${b.id}-${i}` }));
    }
    return [];
  }, [books]);

  const handleSelect = (book: Book) => {
    setActiveBook(book);
    if (onSelectBook) onSelectBook(book);
  };

  if (displayBooks.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* 3D WebGL Canvas */}
      <View style={styles.canvasContainer}>
        {Platform.OS === 'web' ? (
          <Canvas
            camera={{ position: [0, 0, 2.5], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            <CarouselRig
              books={displayBooks}
              radius={2.6}
              activeBook={activeBook}
              onSelectBook={handleSelect}
            />
          </Canvas>
        ) : null}
      </View>

      {/* Interactive Overlay & Controls */}
      <View style={styles.overlay}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <RNText style={styles.badgeText}>3D Interactive Lookbook • {t('common.preview') || 'معاينة ثلاثية الأبعاد'}</RNText>
          </View>
        </View>

        {activeBook && (
          <View style={[styles.bookCard, isRTL && styles.bookCardRTL]}>
            <View style={{ flex: 1 }}>
              <RNText style={[styles.bookTitle, isRTL && styles.textRTL]} numberOfLines={1}>
                {activeBook.title?.[language] || activeBook.title?.ar}
              </RNText>
              <RNText style={[styles.bookSub, isRTL && styles.textRTL]}>
                {activeBook.levelName?.[language] || activeBook.levelName?.ar} • {activeBook.price ? `${activeBook.price} TND` : (t('common.free') || 'مجاني')}
              </RNText>
            </View>

            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => onOpenViewer(activeBook)}
              accessibilityRole="button"
            >
              <RNText style={styles.openBtnText}>
                {t('bookshelf.previewSample') || 'فتح الكتاب 360°'}
              </RNText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 480,
    width: '100%',
    position: 'relative',
    backgroundColor: '#051914',
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.25)',
  },
  canvasContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
    pointerEvents: 'box-none',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  badge: {
    backgroundColor: 'rgba(5, 46, 22, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  badgeText: {
    color: '#fbbf24',
    fontWeight: '700',
    fontSize: 13,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    gap: 16,
  },
  bookCardRTL: {
    flexDirection: 'row-reverse',
  },
  bookTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bookSub: {
    color: '#94a3b8',
    fontSize: 13,
  },
  textRTL: {
    textAlign: 'right',
  },
  openBtn: {
    backgroundColor: '#d97706',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#d97706',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  openBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
