import React from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import { colors } from '../theme/tokens';

// Require local 3D rendering background asset
const backgroundImageAsset = require('../../assets/back-to-school-3d.jpg');

export const ImmersiveBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.outerWrapper}>
      {/* Fixed Ambient 3D Depth Canvas Layer */}
      <View style={styles.backgroundCanvas} pointerEvents="none">
        {/* Layer 1: 3D Rendered Background Asset */}
        <Image
          source={backgroundImageAsset}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Layer 2: Atmospheric Warm Paper Gradient Overlay for Readability */}
        <View style={styles.gradientOverlay} />

        {/* Layer 3: 3D Perspective Floating Book & Paper Silhouettes */}
        <View style={styles.floatingLayer1}>
          <View style={[styles.floatingShape, styles.shapeBook1]} />
          <View style={[styles.floatingShape, styles.shapeBook2]} />
          <View style={[styles.floatingShape, styles.shapeParchment1]} />
        </View>

        {/* Layer 4: Depth Floating Orbs / Ambient Soft Spotlights */}
        <View style={styles.floatingLayer2}>
          <View style={[styles.glowOrb, styles.orbGold]} />
          <View style={[styles.glowOrb, styles.orbEmerald]} />
          <View style={[styles.glowOrb, styles.orbCobalt]} />
        </View>
      </View>

      {/* Main Foreground Content */}
      <View style={styles.contentLayer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.background,
    width: '100%',
    minHeight: '100%',
  },
  backgroundCanvas: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    opacity: 0.82,
  },
  floatingLayer1: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.45,
  },
  floatingShape: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(194, 155, 56, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  shapeBook1: {
    top: '8%',
    right: '5%',
    width: 140,
    height: 190,
    transform: Platform.OS === 'web' ? ([{ rotateZ: '-12deg' }, { rotateY: '25deg' }] as any) : [{ rotate: '-12deg' }],
  },
  shapeBook2: {
    bottom: '12%',
    left: '3%',
    width: 160,
    height: 220,
    transform: Platform.OS === 'web' ? ([{ rotateZ: '15deg' }, { rotateX: '20deg' }] as any) : [{ rotate: '15deg' }],
  },
  shapeParchment1: {
    top: '45%',
    left: '85%',
    width: 110,
    height: 140,
    borderRadius: 16,
    transform: Platform.OS === 'web' ? ([{ rotateZ: '28deg' }, { rotateY: '-30deg' }] as any) : [{ rotate: '28deg' }],
  },
  floatingLayer2: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 9999,
  },
  orbGold: {
    top: '5%',
    left: '20%',
    width: 320,
    height: 320,
    backgroundColor: 'rgba(194, 155, 56, 0.22)',
  },
  orbEmerald: {
    bottom: '15%',
    right: '15%',
    width: 380,
    height: 380,
    backgroundColor: 'rgba(18, 59, 43, 0.18)',
  },
  orbCobalt: {
    top: '50%',
    left: '40%',
    width: 280,
    height: 280,
    backgroundColor: 'rgba(21, 101, 192, 0.12)',
  },
  libraryGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(18, 59, 43, 0.03)',
  },
  contentLayer: {
    flex: 1,
    zIndex: 1,
    position: 'relative',
  },
});
