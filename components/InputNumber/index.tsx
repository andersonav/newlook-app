import React, { useState } from 'react';
import { TextInputProps, KeyboardTypeOptions } from 'react-native';

import * as S from './styles';

interface Props extends TextInputProps {
  value?: string;
  label?: string;
  disabled?: boolean;
  type?: 'primary' | 'secondary';
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (value: number) => void; // Define o tipo de retorno como número
}

export function Input({ value, label, disabled, type, onChangeText, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }

  const handleTextChange = (text: string) => {
    const numericValue = parseFloat(text); // Converte o texto para número
    onChangeText?.(numericValue); // Chama a função onChangeText com o valor numérico
  };

  const inputType = type === 'secondary' ? 'secondary' : 'primary';

  return (
    <S.Container isFocused={isFocused} type={inputType}>
      {inputType === 'primary' && <S.InputLabel>{label}</S.InputLabel>}
      <S.InputText
        selectTextOnFocus={rest.keyboardType === 'numeric'}
        keyboardType="numeric"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={handleTextChange} // Usa a função handleTextChange
        disabled={!!disabled}
        type={inputType}
        {...rest}
      />
    </S.Container>
  );
}
