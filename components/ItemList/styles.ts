import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import Colors from '@/constants/Colors';

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => Colors.light.background};
`;

export const Content = styled.ScrollView`
  padding: 0 25px 40px;
  margin-bottom: 40px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

interface InputItemProps {
  first?: boolean;
}

export const InputItem = styled.View<InputItemProps>`
  flex: 1 0 30%;

  margin-left: ${({ first }) => (first ? "0" : "20px")};
`;

export const IconContainer = styled.View`
  padding-top: 40px;
  flex-direction: row;
  justify-content: space-between;
`;

export const IconItem = styled.View<InputItemProps>`
  flex: 1 0 45%;
  margin-left: ${({ first }) => (first ? "0" : "20px")};
`;

export const ButtonCancel = styled.TouchableOpacity`
  height: 60px;
  background-color: ${({ theme }) => Colors.colors.danger};
  border-width: 1px;
  border-color: ${({ theme }) => Colors.colors.danger};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
`;

export const ButtonConfirm = styled.TouchableOpacity`
  height: 60px;
  background-color: ${({ theme }) => Colors.colors.white};
  border-width: 1px;
  border-color: ${({ theme }) => Colors.colors.success};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
`;

export const Icon = styled(Ionicons)`
  font-size: 40px;
`;

export const HomeContainer = styled.View`
  flex-direction: column;
  margin-top: 40px;
`;

export const HomeContainerItem = styled.View`
  flex-direction: row;
  align-items: center;

  padding: 10px 0;

  border-bottom-width: 1px;
  border-bottom-color: #4F2AE7;
`;

export const HomeContainerItemIconContainer = styled.View`
  width: 40px;
  align-items: center;
`;

export const HomeContainerItemIcon = styled(Ionicons)`
  font-size: 24px;
`;

export const HomeContainerItemText = styled.Text`
  width: 48%;
  font-size: 14px;
`;

export const HomeContainerItemTextValue = styled.Text`
  text-align: right;
  font-size: 14px;
`;

export const Container = styled.View``;

export const ListItem = styled.TouchableOpacity`
  flex-direction: row;

  border-bottom-width: 1px;
  border-bottom-color: #eee;
  margin: 5px 0;

  padding-bottom: 10px;
`;

export const ListItemStatus = styled.View`
  width: 40px;
  justify-content: center;
  align-items: center;
`;

export const ListItemInfo = styled.View`
  flex-grow: 1;
  color: '#FFFFFF'
`;

export const ListItemInfoTitle = styled.Text`
  color: ${({ theme }) => Colors.colors.corFontes};
  font-size: 20px;
  font-weight: bold;
`;

export const ListItemInfoContainer = styled.View``;

export const ListItemInfoContainerRow = styled.View`
  flex-direction: row;
`;

export const ListItemInfoContainerFirstColumn = styled.View`
  width: 90px;
`;

export const ListItemInfoContainerSecondColumn = styled.View`
  flex: 1;
`;

export const ListContainerInfo = styled.Text`
  color: ${({ theme }) => Colors.colors.lightGray2};
  font-size: 13px;
  font-weight: bold;
`;

export const ListContainerInfoValue = styled.Text`
  text-align: left;
  color: ${({ theme }) => Colors.colors.lightGray2};
  font-size: 13px;
`;

export const ListItemLink = styled.View`
  width: 40px;
  justify-content: center;
  align-items: center;
`;

export const NoResults = styled.Text`
  margin-top: 20px;
  color: ${({ theme }) => Colors.colors.primary};
  font-size: 16px;
`;

export const OptionsContainer = styled.View``;

export const OptionsTitleContainer = styled.View`
  flex-direction: column;
`;

export const OptionsTitleContainerText = styled.Text`
  color: ${({ theme }) => Colors.colors.black};
  font-size: 16px;
  margin-bottom: 10px;
  margin-top: 20px;
`;

export const OptionsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => Colors.colors.primary};
  padding: 5px 0;
  margin-left: 20px;
  flex-grow: 1;
`;

export const OptionsLeftContent = styled.View``;

export const OptionsLeftContentText = styled.Text`
  color: ${({ theme }) => Colors.colors.primary};
  font-size: 16px;
`;

export const OptionsRightContent = styled.TouchableOpacity`
  width: 40px;
  justify-content: center;
  align-items: center;
`;

export const PaginationContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

interface PaginationActive {
  active?: boolean;
}

export const PaginationItem = styled.TouchableOpacity<PaginationActive>`
  width: 36px;
  height: 36px;

  background-color: ${({ theme, active }) =>
    active ? Colors.colors.primary : Colors.colors.white};
  border-width: 1px;
  border-color: ${({ theme }) => Colors.colors.lightGray};

  justify-content: center;
  align-items: center;

  border-radius: 18px;
  margin: 8px;
`;

export const PaginationItemText = styled.Text<PaginationActive>`
  font-size: 14px;
  color: ${({ theme, active }) =>
    active ? Colors.colors.white : Colors.colors.black};
`;

export const PaginationText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => Colors.colors.primary};
  margin: 10px 0;
`;

export const Favorite = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
`;

export const FavoriteLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => Colors.colors.primary};
  margin-bottom: 10px;
`;

export const FavoriteStar = styled.TouchableOpacity``;
