import React from 'react';
import * as S from './styles';

const InfoItem = ({ descricao, valor , id }:{ descricao:string, valor:any, id:any }) => {
  return (
    <S.ListItemInfoContainerRow key={id}>
        <S.ListItemInfoContainerFirstColumn>
        <S.ListContainerInfo>
            {descricao}
        </S.ListContainerInfo>
        </S.ListItemInfoContainerFirstColumn>
        <S.ListItemInfoContainerSecondColumn>
        <S.ListContainerInfoValue>
            {valor}
        </S.ListContainerInfoValue>
        </S.ListItemInfoContainerSecondColumn>
    </S.ListItemInfoContainerRow>
  );
};

export default InfoItem;
