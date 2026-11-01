import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThreeDScene } from '../3d/ThreeDScene';
import { Header, Footer } from '../Header';
import { useLanguage } from '../../context/LanguageContext';

export interface ShellLayoutProps {
  children?: React.ReactNode;
  cartCount: number;
  favouritesCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenOrderLookup: () => void;
  onOpenContact: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  show3DBackground?: boolean;
}

export const ShellLayout: React.FC<ShellLayoutProps> = ({
  children,
  cartCount,
  favouritesCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenOrderLookup,
  onOpenContact,
  isAdminMode,
  onToggleAdminMode,
  show3DBackground = true,
}) => {
  const { isRTL } = useLanguage();

  return (
    <ThreeDScene showFloatingBooks={show3DBackground} interactiveCamera={show3DBackground}>
      <View style={[styles.shellWrapper, { direction: isRTL ? 'rtl' : 'ltr' } as any]}>
        <Header
          cartCount={cartCount}
          favouritesCount={favouritesCount}
          onOpenCart={onOpenCart}
          onOpenOrderLookup={onOpenOrderLookup}
          onOpenContact={onOpenContact}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isAdminMode={isAdminMode}
          onToggleAdminMode={onToggleAdminMode}
        />

        <View style={styles.contentArea}>{children}</View>

        <Footer />
      </View>
    </ThreeDScene>
  );
};

const styles = StyleSheet.create({
  shellWrapper: {
    flex: 1,
    minHeight: '100%',
  },
  contentArea: {
    flex: 1,
  },
});
