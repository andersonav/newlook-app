import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';

const ConfirmationModal = ({ visible, onConfirm, onCancel, message }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Sim</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Não</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // fundo escuro com transparência
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%', // 80% da largura da tela
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // alinha os botões à direita
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#007bff', // azul
  },
  cancelButton: {
    backgroundColor: '#dc3545', // vermelho
  },
  buttonText: {
    color: '#fff', // texto branco
    fontSize: 16,
  },
});

export default ConfirmationModal;
