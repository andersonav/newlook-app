import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import Colors from '@/constants/Colors';

export const Container = styled.View`
  width: 100%;
  height: ${RFValue(100)}px;

  justify-content: flex-end;
  padding-bottom: ${RFValue(10)}px;

  background-color: ${({ theme }) => Colors.colors.primary};

  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
`;

export const HeaderWrapper = styled.View`
  height: ${RFValue(60)}px;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  padding: 0 20px;
`;

export const HeaderItemLeft = styled.View`
  width: 40px;
  align-items: flex-start;
  justify-content: center;
`;

export const HeaderItemCenter = styled.View`
  width: auto;
  align-items: center;
  justify-content: center;
`;

export const HeaderItemRight = styled.View`
  width: 40px;
  align-items: flex-end;
  justify-content: center;
`;

export const IconContainer = styled.TouchableOpacity``;

export const Icon = styled(Ionicons)`
  font-size: 28px;
  color: #ffffff;
`;

export const Title = styled.Text`
  font-size: 22px;
  color: ${({ theme }) => Colors.colors.white};
`;
