import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '@/constants/Colors';

export const Wrapper = styled.View`
  flex: 1;
  width: 100%;
`;

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex-direction: column;
  border-bottom-width: 1px;
  border-bottom-color: #000000;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
`;

export const Title = styled.Text`
  font-size: 17px;
`;

export const Icon = styled(Feather)`
  font-size: 17px;
  color: ${({ theme }) => Colors.colors.text};
`;
