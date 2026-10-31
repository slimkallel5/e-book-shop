import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import LottieView from 'lottie-react-native';
import {
  bookAnimation,
  searchAnimation,
  settingsAnimation,
  packageAnimation,
  mailAnimation,
  heartAnimation,
  cartAnimation,
  arrowAnimation,
  starAnimation,
  trashAnimation,
  gradCapAnimation,
  pencilAnimation,
  rulerAnimation,
  giftAnimation,
  newspaperAnimation,
  buildingAnimation,
  closeAnimation,
  zoomAnimation,
  checkAnimation,
  alertAnimation,
  phoneAnimation,
  eyeAnimation,
  chartAnimation,
} from './animations';

export type LottieIconName =
  | 'book'
  | 'search'
  | 'settings'
  | 'package'
  | 'mail'
  | 'heart'
  | 'heart-outline'
  | 'cart'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-down'
  | 'arrow-up'
  | 'star'
  | 'star-outline'
  | 'trash'
  | 'grad-cap'
  | 'pencil'
  | 'ruler'
  | 'gift'
  | 'newspaper'
  | 'building'
  | 'close'
  | 'zoom-in'
  | 'zoom-out'
  | 'check'
  | 'alert'
  | 'phone'
  | 'eye'
  | 'chart';

interface LottieIconProps {
  name: LottieIconName;
  size?: number;
  color?: string;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  style?: StyleProp<ViewStyle>;
}

export const LottieIcon: React.FC<LottieIconProps> = ({
  name,
  size = 20,
  autoPlay = true,
  loop = true,
  speed = 1,
  style,
}) => {
  const animationSource = useMemo(() => {
    switch (name) {
      case 'book':
        return bookAnimation;
      case 'search':
        return searchAnimation;
      case 'settings':
        return settingsAnimation;
      case 'package':
        return packageAnimation;
      case 'mail':
        return mailAnimation;
      case 'heart':
        return heartAnimation(true);
      case 'heart-outline':
        return heartAnimation(false);
      case 'cart':
        return cartAnimation;
      case 'arrow-left':
        return arrowAnimation('left');
      case 'arrow-right':
        return arrowAnimation('right');
      case 'arrow-down':
        return arrowAnimation('down');
      case 'arrow-up':
        return arrowAnimation('up');
      case 'star':
        return starAnimation(true);
      case 'star-outline':
        return starAnimation(false);
      case 'trash':
        return trashAnimation;
      case 'grad-cap':
        return gradCapAnimation;
      case 'pencil':
        return pencilAnimation;
      case 'ruler':
        return rulerAnimation;
      case 'gift':
        return giftAnimation;
      case 'newspaper':
        return newspaperAnimation;
      case 'building':
        return buildingAnimation;
      case 'close':
        return closeAnimation;
      case 'zoom-in':
        return zoomAnimation(true);
      case 'zoom-out':
        return zoomAnimation(false);
      case 'check':
        return checkAnimation;
      case 'alert':
        return alertAnimation;
      case 'phone':
        return phoneAnimation;
      case 'eye':
        return eyeAnimation;
      case 'chart':
        return chartAnimation;
      default:
        return bookAnimation;
    }
  }, [name]);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
        style,
      ]}
      pointerEvents="none"
    >
      <LottieView
        source={animationSource}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        style={{ width: size, height: size }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
});
