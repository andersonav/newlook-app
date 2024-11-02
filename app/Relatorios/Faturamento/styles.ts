import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import Colors from '@/constants/Colors';

export const BodyOption = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
`;

export const BodyTextLeft = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => Colors.colors.primary};
  width: 100px;
  font-weight: bold;
`;

export const BodyTextRight = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => Colors.colors.black};
`;

export const Calendar = styled.TouchableOpacity`
  background-color: ${({ theme }) => Colors.colors.inputText.background};
  border-radius: 5px;
  margin: 5px 30px;
  height: 40px;
  width: 220px;
  padding-left: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => Colors.colors.primaryLight};
`;

export const CalendarText = styled.Text`
  padding: 5px;
  color: ${({ theme }) => Colors.colors.black};
  font-size: 17px;
  text-align: center;
`;

export const BodyOption2 = styled.View`
  justify-content: space-between;
  margin: 10px 0;
`;