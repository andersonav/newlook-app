import React, { useState } from 'react';
import { TextInputProps } from 'react-native';

import * as S from './styles';

interface Props extends TextInputProps {
  value?: string;
  label?: string;
  disabled?: boolean;
  type?: string;
}

export function Input({ value, label, disabled, type, ...rest }: Props) {
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
      <S.InputText
        selectTextOnFocus={rest.keyboardType == 'numeric'}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={!!disabled}
        type={inputType}
        {...rest}
      />
    </S.Container>
  );
}
