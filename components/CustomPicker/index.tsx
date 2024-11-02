import React from 'react';

import * as S from './styles';

interface Props {
  title: string;
  onPress: () => void;
}

export function CustomPicker({ title, onPress }: Props) {
  return (
    <S.Wrapper>
      <S.Container onPress={onPress}>
        <S.Title>{title}</S.Title>
        <S.Icon name='chevron-down' />
      </S.Container>
    </S.Wrapper>
  );
}
