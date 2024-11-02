// styles.js

import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  iconeVoltar:{
    color: '#FFFFFF'
  },
  iconeGravar:{
    color: '#FFFFFF'
  },
  iconeExcluir:{
    color: '#FFFFFF'
  },
  btn3: {
    width: '48%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: '1.5%'
  },
  btn2: {
    width: '30%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: '2.5%'
  },
  btn: {
    width: '15%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuTopSeach: {
    backgroundColor: Colors.colors.success,
    width: '100%',
    padding: 5,
    height: 60
  },
  menuTop: {
    backgroundColor: Colors.colors.success,
    width: '100%',
    padding: 5,
    height: 80
  },
  menuTopBotao: {
    backgroundColor: Colors.colors.success,
    width: '100%',
    padding: 5,
    height: 60
  },
  linha: {
    backgroundColor: Colors.colors.success,
    flexDirection: 'row'
  },
  Search: {
    width: '70%'
  },
  Input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    margin: 4,
    width: '100%',
    fontSize: 20,
    padding: 5
  }
});

export default styles;
