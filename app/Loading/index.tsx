import React from 'react';
import LottieView from 'lottie-react-native';

import loading from '../../assets/loading.json';

import * as S from './styles';

interface Props {
  label?: string;
}

export function Loading(data: Props) {
  return (
    <S.Container>
      <LottieView
        source={loading}
        style={{ height: 200 }}
        resizeMode='contain'
        autoPlay
        loop
      />
      {data?.label !== '' && <S.ContainerText>{data.label}</S.ContainerText>}
    </S.Container>
  );
}
