import React, { useState } from 'react';
import { Animated, Button, Text, TextInput, TouchableHighlight } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import * as S from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '@/constants/Colors';

interface Options {
  key       : string;
  name      : string;
  descricao : string; 
  dados     : any;
}

interface Props {
  title: string;
  option: Options;
  setOption: (option: Options) => void;
  onValueChange: (itemValue: any, itemIndex: any) => void;
  optionList: Options[];
  closeCustomPickerScreen: () => void;
}

export function CustomPickerScreen({
  title,
  option,
  setOption,
  onValueChange,
  optionList,
  closeCustomPickerScreen,
}: Props) {
  const [search, setSearch] = useState('');
  const [selecionado, setSelecionado] = useState(false);

  const scrollY = new Animated.Value(0);

  function handleOptionSelect(option: Options) {
    setOption(option);
    onValueChange(option, 0);
    setSelecionado(true);
  }

  function handleOptionSelectFechar2(option: Options) {
    setOption(option);
    onValueChange(option, 0);
    closeCustomPickerScreen();
  }

  return (
    <S.Container>
      <S.HeaderWrapper>
        <S.HeaderItemLeft></S.HeaderItemLeft>
        <S.HeaderItemCenter>
            <S.Title>{title}</S.Title>
        </S.HeaderItemCenter>
        <S.HeaderItemRight>
          <S.IconContainer onPress={closeCustomPickerScreen}>
            <S.Icon name='close' />
          </S.IconContainer>
        </S.HeaderItemRight>
      </S.HeaderWrapper>
      <S.HeaderWrapperSearch>
        <TextInput
          placeholder='Buscar'
          autoCorrect={false}
          autoCapitalize='none'
          onChangeText={setSearch}
          defaultValue={''}
          style={{
            backgroundColor: '#FFF',
            width: '80%',
            borderRadius: 5,
            marginBottom: 10,
            padding: 5,
          }}
        />
      </S.HeaderWrapperSearch>


      <Animated.FlatList
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        ListFooterComponent={<Animated.View style={{height: scrollY}} />}
        scrollEventThrottle={16}

        data={optionList.filter((option) => {
          const searchPattern = new RegExp(search.replace(/ /g, '.*'), 'i');
          return searchPattern.test(option.name);
        })}

        style={{ flex: 1, width: '100%' }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <S.Option
            onPress={() => handleOptionSelect(item)}
            isActive={option.key === item.key}
          >
            <S.Footer2 style={{flexDirection: 'row'}}>
              <S.Name>{item.name}</S.Name>

              <TouchableHighlight
                style={{
                  marginLeft: 'auto',
                  borderRadius: 10,
                  backgroundColor: Colors.colors.success,
                  alignItems: 'center',
                  alignSelf: 'center',
                  padding: 10,
                }}
                onPress={() => { handleOptionSelectFechar2(item);}}
              >
                <S.Icon name={'arrow-forward-circle-outline'} />
              </TouchableHighlight>
            </S.Footer2>
            
          </S.Option>
        )}
        ItemSeparatorComponent={() => <S.Separator />}
      />

      <S.Footer>
        {/* <Button
          title='Selecionar'
          onPress={closeCustomPickerScreen}
          style={{ border: '1px solid' }}
        /> */}
        <TouchableHighlight
          disabled={!selecionado}
          style={{
            borderRadius: 10,
            backgroundColor: Colors.colors.success,
            alignItems: 'center',
            padding: 10,
          }}
          onPress={closeCustomPickerScreen}
        >
          <S.ButtonTitle>Selecionar</S.ButtonTitle>
        </TouchableHighlight>
      </S.Footer>
    </S.Container>
  );
}
