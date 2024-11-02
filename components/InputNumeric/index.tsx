import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'; // Importe o TextInputMask da biblioteca react-native-masked-text

import * as S from './styles';

interface Props extends TextInputProps {
  value?: string;
  label?: string;
  disabled?: boolean;
  type?: string;
}

export function InputNumeric({ value, label, disabled, type, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }

  const inputType = type === 'secondary' ? 'secondary' : 'primary';

  return (
    <S.Container isFocused={isFocused} type={inputType}>
      {inputType === 'primary' && <S.InputLabel>{label}</S.InputLabel>}
      <TextInputMask
        style={{fontSize: 17}}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        type={'money'} // Define o tipo de máscara como 'money' para formatar o valor numérico como moeda
        options={{
          precision: 2, // Define a precisão da máscara (2 casas decimais)
          separator: ',', // Define o separador de milhar
          delimiter: '.', // Define o separador decimal
          unit: 'R$ ', // Define a unidade de moeda
          suffixUnit: '', // Define um sufixo para a unidade de moeda
        }}
        value={value}
        {...rest}
      />
    </S.Container>
  );
}
