import styled, { css } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { TextInput } from 'react-native';
import Colors from '@/constants/Colors';

interface ContainerProps {
  isFocused: boolean;
  type: string;
}

interface DisabledProps {
  disabled: boolean;
  type: string;
}

export const Container = styled.View<ContainerProps>`
  flex-direction: column;

  ${({ type }) =>
    type === 'primary'
      ? css`
          margin-top: 20px;
          border-bottom-width: 1px;
        `
      : css`
          margin-top: 5px;
        `};

  ${({ type, isFocused, theme }) =>
    type === 'primary' && isFocused
      ? css`
          border-bottom-color: ${Colors.colors.primary};
        `
      : css``};
`;

export const InputLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => Colors.colors.primary};
  margin-bottom: 6px;
  font-weight: bold;
`;

export const SelectText = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => Colors.colors.primary};
  margin-bottom: 4px;
`;

export const InputText = styled(TextInput).attrs<DisabledProps>(({ type }) => ({
  textAlign: type === 'primary' ? 'left' : 'center',
}))<DisabledProps>`
  height: 35px;
  padding: 3px;
  border-radius: 5px;
  font-size: 20px;
  color: ${({ theme, disabled }) => disabled ? Colors.colors.lightGray2 : Colors.colors.text};

  ${({ type, theme }) =>
    type === 'primary'
      ? css`
          background-color: ${Colors.colors.white};
        `
      : css`
          background-color: ${Colors.colors.white};
          border-radius: 8px;
          border-width: 1px;
          border-color: ${Colors.colors.success};
        `};
`;

