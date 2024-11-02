import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importe o ícone desejado

import * as S from './styles';

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  options: Option[];
  label?: string;
  disabled?: boolean;
  selectedValue?: string | number;
  onValueChange?: (itemValue: any, itemIndex: number) => void;
}

export function Select({ options, label, disabled, selectedValue, onValueChange }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [internalSelectedValue, setInternalSelectedValue] = useState<string | number | undefined>(selectedValue);

  const handleValueChange = (itemValue: string | number) => {
    setInternalSelectedValue(itemValue);
    setShowModal(false);
    if (onValueChange) {
      onValueChange(itemValue, options.findIndex((option) => option.value === itemValue));
    }
  };

  return (
    <S.Container>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        disabled={disabled}
        style={{ borderBottomWidth: 1 }}
      >
        {label && <S.InputLabel>{label}</S.InputLabel>}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <S.SelectText style={{ backgroundColor: '#FFFFFF', padding: 6, paddingBottom: 8, borderRadius: 5, color: '#000000', flex: 1 }}>
            {options.find((option) => option.value === internalSelectedValue)?.label || 'Selecione'}
          </S.SelectText>
          <FontAwesome name="caret-down" size={20} color="#000" style={{ marginRight: 10 }} />
          {/* Adicionei um ícone de seta para baixo no lado direito */}
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{padding: 10, paddingBottom: 10}}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.optionItem}
                  onPress={() => handleValueChange(option.value)}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </S.Container>
  );
}

export const styles = StyleSheet.create({
  SelectContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    fontSize: 16
  },
  SelectLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  SelectText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    maxHeight: 300,
    overflow: 'hidden',
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
});
