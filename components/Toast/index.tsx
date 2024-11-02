import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type: 'success' | 'error' | 'alert';
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, type, onHide }) => {
  const fadeAnim = useState(new Animated.Value(0))[0];

  const backgroundColor = {
    success: '#28a745',
    error: '#dc3545',
    alert: '#ffc107',
  }[type] || '#28a745';

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          onHide();
        }, 3000); // Esconde o toast após 2 segundos
      });
    }
  }, [isVisible]);

  return (
    isVisible && (
      <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
        <View style={[styles.toastContent, { backgroundColor }]}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastContent: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 6, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Toast;
