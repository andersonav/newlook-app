const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

let colors = {
  primary2: '#006600',
  corFontes: '#006600',
  chevronForward: '#0909d3',

  primary: '#006600',
  primaryLight: '#0909d3',
  primarySelect: '#73e5ff',

  background: '#fff',

  text: '#252525',

  success: '#006600',
  successLight: 'rgba(18, 164, 84, 0.5)',

  warning: '#2424f3',
  warningLight: 'rgba(36, 36, 243, 0.5)',

  danger: '#E83F5B',
  dangerLight: 'rgba(232, 63, 91, 0.5)',

  inputText: {
    text: '#252525',
    background: '#fff',
    border: '#006600',
  },

  submit: {
    text: '#fff',
    background: '#006600',
    border: '#006600',
  },

  icons: '#000000',
  white: '#fff',
  black: '#000000',
  lightGray: '#BDBDBD',
  lightGray2: '#000000',
  superLightGray: '#CACACA',
  blue: '#0000FF',
  verdeLight: '#7FE4B4',
  laranja: '#006600',
  yellow: '#ffec45',
  yellowLight: '#0dfc29',
  backgroundFilters: '#eaeaea',
}

export default {
  colors: colors,
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    colors: colors
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    colors: colors
  },
  btn3: {
    width: '50%',
    alignContent:'center',
    verticalAlign:'auto',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn2: {
    width: '33%',
    alignContent:'center',
    verticalAlign:'auto',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    width: '15%',
    alignContent:'center',
    verticalAlign:'auto',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuTop: {
    backgroundColor: colors.success,
    width: '100%',
    padding: 5,
    height: 80
  },
  menuTopBotao: {
    backgroundColor: colors.success,
    width: '100%',
    padding: 5,
    height: 40
  },
  linha:{
    backgroundColor: colors.success,
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
};


