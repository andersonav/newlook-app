import { RFValue } from 'react-native-responsive-fontsize';
import { Feather, Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';

interface OptionProps {
  isActive: boolean;
}

export const Footer2 = styled.View`
  width: 100%;
  padding: 5px;
`;

export const Container = styled(GestureHandlerRootView)`
  flex: 1;
  width: 100%;
  height: ${RFValue(100)}px;

  justify-content: flex-end;
  padding-bottom: ${RFValue(10)}px;

  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
`;

export const HeaderWrapper = styled.View`
  height: ${RFValue(60)}px;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  padding: 0 20px;

  background-color: ${({ theme }) => Colors.colors.primary};
`;

export const HeaderWrapperSearch = styled.View`
  height: ${RFValue(40)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 20px;

  background-color: ${({ theme }) => Colors.colors.primary};
`;

export const HeaderItemLeft = styled.View`
  width: 40px;
  align-items: flex-start;
  justify-content: center;
`;

export const HeaderItemCenter = styled.View`
  width: auto;
  padding: 35px 0px 0px 0px;
  align-items: center;
  justify-content: center;
`;

export const HeaderItemRight = styled.View`
  width: 40px;
  padding: 35px 0px 0px 0px;
  align-items: flex-end;
  justify-content: center;
`;

export const IconContainer = styled.TouchableOpacity``;

export const Icon = styled(Ionicons)`
  font-size: 28px;
  color: #ffffff;
`;

export const Title = styled.Text`
  color: ${({ theme }) => Colors.colors.white};
  font-size: ${RFValue(18)}px;
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => Colors.colors.lightGray2};
  font-size: ${RFValue(12)}px;
`;

export const Option = styled.TouchableOpacity<OptionProps>`
  width: 100%;
  padding: 20px;
  flex-direction: row;
  align-items: center;

  background-color: ${({ theme, isActive }) =>
    isActive ? Colors.colors.primarySelect : Colors.colors.white};
`;

export const Name = styled.Text`
  font-size: ${RFValue(14)}px;
`;

export const Separator = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => Colors.colors.text};
`;

export const Footer = styled.View`
  width: 100%;
  padding: 24px;
`;

export const ButtonTitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => Colors.colors.white};
`;
