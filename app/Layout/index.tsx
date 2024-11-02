import React from 'react';
import * as S from './styles';

interface Props {
  title: string;
  showTopMenu?: boolean;
  handleShowTopMenu?: () => void;
  handleOpenDrawer: () => void;
}

export function Layout({
  title,
  showTopMenu,
  handleShowTopMenu,
  handleOpenDrawer,
}: Props) {
  return (
    <S.Container>
      <S.HeaderWrapper>
        <S.HeaderItemLeft>
          <S.Icon name='menu' onPress={handleOpenDrawer} />
        </S.HeaderItemLeft>
        <S.HeaderItemCenter>
            <S.Title>{title}</S.Title>
        </S.HeaderItemCenter>
        <S.HeaderItemRight>
        </S.HeaderItemRight>
      </S.HeaderWrapper>
    </S.Container>
  );
}
