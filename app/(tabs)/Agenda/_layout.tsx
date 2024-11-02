import Colors from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import sqlTbEventos, {IEvento} from './Tabela';
import sqlTbClientes, {IClient} from '../Clientes/Tabela';
import * as S from './styles';
import InfoItem from '@/components/ItemList';
import ConfirmationModal from '@/components/Confirmacao';
import Toast from '@/components/Toast';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { CustomPicker } from '@/components/CustomPicker';
import { CustomPickerScreen } from '@/components/CustomPickerScreen';
import DateTimePicker, { DateTimePickerEvent }  from '@react-native-community/datetimepicker';
import stylesG from '../../style'
import moment from 'moment';

const { width } = Dimensions.get('window');
const daySize = (width - 40) / 7; // subtrai 40 para levar em conta o espaçamento dos dias da semana

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const getCurrentDate = () => {
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};



interface Option {
  key       : string;
  name      : string;
  descricao : string; 
  dados     : any;
}

const Calendar = () => {

  useEffect(() => {
    
    const newMonth = currentDate.month;
    const newYear  = currentDate.year;

    loadEventos(newMonth+1, newYear);

    return () => {};
  }, []);
  
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [listaAgendamentos, setListaAgendamentos] = useState([]);

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'alert'>('success');
  const [toastMsg, setToastMsg] = useState('');

  const [modalEventoVisible, setModalEventoVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('0');
  const [selectedMon, setSelectedMon] = useState('0');
  const [selectedYea, setSelectedYea] = useState('0');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [eventos, setEventos] = useState([] as IEvento[]);
  const [selectedItem, setSelectedItem] = useState({} as IEvento);

  const showToast = (msg:string, type: 'success' | 'error' | 'alert') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastVisible(true);

    // Esconde o toast após 2 segundos
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  async function filtrarLista(dia:any, mes:any, ano:any, pagina:any){
    setLoading(true);
    console.log('Abrir dia: '+dia+' de '+mes);

    let limit = 30;
    setPage(pagina);

    let total :any = await sqlTbEventos.length(dia, mes, ano);
    let itens :any = await sqlTbEventos.pagination(dia, mes, ano, limit, ((pagina-1) * limit));

    const totalPages = Math.ceil(total / limit);
    setTotalPages(totalPages);
    setEventos(itens);
    setLoading(false);
  }

  async function abrirDia(dia:any, mes:any, ano:any){
    setSelectedDay(dia);
    setSelectedMon(mes);
    setSelectedYea(ano);

    filtrarLista(dia, mes, ano, 1);
    setModalVisible(true);
  }

  function fecharDia(){
    setModalVisible(false);
  }

  function addEvento(){

    let finalItem = {
      key: ``,
      name: ``,
      descricao: ``,
      dados: {ID: 0, RAZAO_SOCIAL: ''}
    };

    setCliente(finalItem);

    setSelectedItem({
      ID: 0,
      DESCRICAO: '',
      PESSOA_ID: 0,
      HORA: '00:00',
      DIA: Number(selectedDay),
      MES: Number(selectedMon),
      ANO: Number(selectedYea),
      STATUS: 1
    });

    setModalEventoVisible(true);
  }

  async function gravar() {

    let itemGravar = {
      DESCRICAO : selectedItem.DESCRICAO,
      PESSOA_ID : cliente.dados.ID,
      HORA      : selectedItem.HORA,
      DIA       : selectedItem.DIA,
      MES       : selectedItem.MES,
      ANO       : selectedItem.ANO,
      STATUS    : selectedItem.STATUS,
      ID        : selectedItem.ID,
    }

    await sqlTbEventos.create(itemGravar);
    filtrarLista(selectedDay, selectedMon, selectedYea, 1);
    showToast('Gravado com sucesso', 'success');
    setModalEventoVisible(false);

    loadEventos(selectedItem.MES, selectedItem.ANO);
  } 

  async function excluir() {
    setModalExcluirVisible(true);
  } 

  async function abrirItem(item:any) {

    let finalItem = {
      key: `${item.PESSOA_ID}`,
      name: `${(item.PESSOA_ID+'').padStart(4, "0")} - ${item.DESC_CLIENTE}`,
      descricao: `${(item.PESSOA_ID+'').padStart(4, "0")} - ${item.DESC_CLIENTE}`,
      dados: {ID: item.PESSOA_ID, RAZAO_SOCIAL: item.DESC_CLIENTE}
    };

    setCliente(finalItem);

    setSelectedItem(item);
    setModalEventoVisible(true);
  }

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);

  const handleExcluirConfirm = async () => {
    // Lógica a ser executada quando o botão "Sim" for pressionado

    await sqlTbEventos.deleteItem(selectedItem.ID);
    filtrarLista(selectedDay, selectedMon, selectedYea, 1);

    showToast('Excluído com sucesso', 'alert');
    setModalExcluirVisible(false);
    setModalEventoVisible(false);

  };

  const handleExcluirCancel = () => {
    // Lógica a ser executada quando o botão "Não" for pressionado
    setModalExcluirVisible(false);
  };

  //Cliente
  const [clienteList, setClienteList] = useState([] as Option[]);
  const [clienteModalOpen, setClienteModalOpen] = useState(false);

  async function handleOpenClienteModal() {

    let finalClienteList: { key: string; name: string, descricao: string, dados: any }[] = [];
    const clientes : any = await sqlTbClientes.list();

    clientes.map((tipo: any) => {
        finalClienteList.push({
          key: `${tipo.ID}`,
          name: `${(tipo.ID+'').padStart(4, "0")} - ${tipo.RAZAO_SOCIAL}`,
          descricao: `${(tipo.ID+'').padStart(4, "0")} - ${tipo.RAZAO_SOCIAL}`,
          dados: tipo,
        });
    });
    
    setClienteList(finalClienteList);
    setClienteModalOpen(true);
  }

  function handleCloseClienteModal() {
    setClienteModalOpen(false);
  }

  const [cliente, setCliente] = useState({
    key: '',
    name: '',
    descricao: '',
    dados: {},
  });

  async function changeCliente(itemValue : any, itemIndex : any){

  }

  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [isDatePickerVisible3, setDatePickerVisibility3] = useState(false);

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const hideDatePicker3 = () => {
    setDatePickerVisibility3(false);
  };
  
  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const showDatePicker3 = () => {
    setDatePickerVisibility3(true);
  };

  const handleConfirm1 = (date: Date) => {
    
    const dataUtcString = moment(date).toISOString();   
    const data = new Date(dataUtcString);

    setSelectedItem({
      ...selectedItem,
      HORA: moment(data).format('HH:mm'),
    });

    hideDatePicker1();
  };

  const handleConfirm2 = (date: Date) => {
    setSelectedItem({
      ...selectedItem,
      HORA: moment(date).format('HH:mm'),
    });

    hideDatePicker2();
  };

  const handleConfirm3 = (date: Date) => {
    setSelectedItem({
      ...selectedItem,
      HORA: moment(date).format('HH:mm'),
    });

    hideDatePicker3();
  };

  async function loadEventos(mes:any, ano:any) {
    let agendamento : any = await sqlTbEventos.getAgendamento(mes, ano);
    console.log(mes+' - '+ano);
    console.log(agendamento);
    setListaAgendamentos(agendamento);
  }

  const prevMonth = () => {
    const newMonth = currentDate.month === 0 ? 11 : currentDate.month - 1;
    const newYear = currentDate.month === 0 ? currentDate.year - 1 : currentDate.year;

    loadEventos(newMonth+1, newYear);

    setCurrentDate(prev => {
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      return { year: newYear, month: newMonth, day: 1 };
    });
	
  };

  const nextMonth = () => {
    
    const newMonth = currentDate.month === 0 ? 11 : currentDate.month + 1;
    const newYear = currentDate.month === 0 ? currentDate.year + 1 : currentDate.year;

    loadEventos(newMonth+1, newYear);
    setCurrentDate(prev => {
      const newMonth = prev.month === 11 ? 0 : prev.month + 1;
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
      return { year: newYear, month: newMonth, day: 1 };
    });
	
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={prevMonth} style={{backgroundColor: Colors.colors.success, padding: 10, borderRadius:5}}>
        <Text style={styles.headerText2}>Anterior</Text>
      </TouchableOpacity>

      <Text style={styles.headerText}>{`${months[currentDate.month]} ${currentDate.year}`}</Text>

      <TouchableOpacity onPress={nextMonth} style={{backgroundColor: Colors.colors.success, padding: 10, borderRadius:5}}>
        <Text style={styles.headerText2}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDaysOfWeek = () => (
    <View style={styles.daysOfWeek}>
      {daysOfWeek.map(day => (
        <Text key={day} style={styles.dayText}>{day}</Text>
      ))}
    </View>
  );

  const renderDaysOfMonth = () => {
    const firstDayOfMonth = new Date(currentDate.year, currentDate.month, 1).getDay();
    const totalDaysOfMonth = new Date(currentDate.year, currentDate.month + 1, 0).getDate();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay}></View>);
    }

    // Add days of the month
    for (let i = 1; i <= totalDaysOfMonth; i++) {

      const isCurrentDay = i === new Date().getDate() && currentDate.month === new Date().getMonth();

      days.push(
        <TouchableOpacity onPress={function(){abrirDia(i, currentDate.month+1, currentDate.year)}} key={i} style={[styles.day, isCurrentDay && styles.currentDay]}>

          <View style={{flex:1, alignItems: 'center'}}>
            <Text style={[styles.dayText, isCurrentDay && styles.currentDayText]}>{i}</Text>
            {listaAgendamentos.some(agendamento => agendamento.DIA == i) ? <FontAwesome size={15} name="bell" color={'#000000'} /> : <></>}
          </View>

        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.daysOfMonth}>
        {days}
      </View>
    );
  };

  return (
    
    <View style={styles.container}>
      
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderDaysOfMonth()}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          loadEventos(currentDate.month+1, currentDate.year);
        }}
      >
        <View style={{ flex: 1}}>
          
          <View style={styles.menuTop}>
            <Text style={{marginTop: 45, color: '#FFFFFF', fontSize:22, textAlign: 'center', width: '100%', fontWeight: 'bold'}}>
              {selectedDay} de {months[currentDate.month]} de {currentDate.year}
            </Text>
          </View>

          <View style={styles.menuTopBotao}>
            <View style={styles.linha}>
              <>
                <TouchableOpacity style={styles.btn2} onPress={function(){fecharDia(); loadEventos(currentDate.month+1, currentDate.year);}}>
                  <FontAwesome size={28} name="arrow-left" color={'#FFFFFF'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn2} onPress={function(){addEvento()}}>
                  <FontAwesome size={28} name="plus" color={'#FFFFFF'} />
                </TouchableOpacity>

              </> 
            </View>
          </View>

          <ScrollView style={{padding: 10, paddingBottom: 20}}>
            <S.Content>
              <S.Container>
                {eventos.length === 0 && (
                  <S.NoResults>
                    Nenhum agendamento encontrado.
                  </S.NoResults>
                )}
                {eventos &&
                  eventos.map((evento) => {
                    return (
                      <S.ListItem
                        key={evento.ID}
                        onPress={() => {  }}
                      >
                        <S.ListItemStatus>
                          {evento.STATUS == 1 ?
                            <FontAwesome size={28} style={{ marginBottom: -3 }} name="check" color={Colors.colors.success} /> :
                            <FontAwesome size={28} style={{ marginBottom: -3 }} name="times" color={Colors.colors.danger} /> 
                          }
                        </S.ListItemStatus>

                        <S.ListItemInfo>
                          <S.ListItemInfoTitle>
                            {evento.ID} - {evento.DESCRICAO}
                          </S.ListItemInfoTitle>

                          <S.ListItemInfoContainer>
                            <InfoItem id={evento.ID+'_01'} descricao={'Cliente:'} valor={evento.DESC_CLIENTE} />
                            <InfoItem id={evento.ID+'_02'} descricao={'Hora:'} valor={evento.HORA} />
                          </S.ListItemInfoContainer>

                        </S.ListItemInfo>

                        <S.ListItemLink>
                          <TouchableOpacity onPress={function(){abrirItem(evento)}}>
                            <FontAwesome size={40} style={{ marginBottom: -3 }} name="pencil-square" color={'#000000'} />
                          </TouchableOpacity>
                        </S.ListItemLink>

                      </S.ListItem>
                    );
                  })}

                {eventos.length > 0 && (
                  <>
                    <S.PaginationText>Paginação</S.PaginationText>
                    <S.PaginationContainer>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (itemPage) => {
                          const active = itemPage === page;

                          return (
                            <S.PaginationItem
                              active={active}
                              key={itemPage}
                              onPress={
                                !active ? () => filtrarLista(selectedDay, selectedMon, selectedYea, itemPage) : () => {}
                              }
                            >
                              <S.PaginationItemText active={active}>
                                {itemPage}
                              </S.PaginationItemText>
                            </S.PaginationItem>
                          );
                        }
                      )}
                    </S.PaginationContainer>
                  </>
                )}
              </S.Container>
            </S.Content>
          </ScrollView >

          <Toast
            message={toastMsg}
            isVisible={isToastVisible}
            type={toastType}
            onHide={() => setIsToastVisible(false)}
          />
          
          {isDatePickerVisible1 ? 
          <DateTimePicker 
            mode={'time'}
            timeZoneOffsetInMinutes={-180}
            value={new Date(moment(selectedDay+'-'+selectedMon+'-'+selectedYea+'T'+selectedItem.HORA).toISOString())}
            onChange={function(event: DateTimePickerEvent, date: Date){
              setDatePickerVisibility1(false);
              console.log(date);
              console.log(moment(date).toISOString());
              setSelectedItem({
                ...selectedItem,
                HORA: moment(moment(date).toISOString()).format('HH:mm'),
              });
              return date;
            }}
          /> : <></>}
          
        </View>
        
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalEventoVisible}
            onRequestClose={() => {
              setModalEventoVisible(!modalEventoVisible);
            }}
          >
            <View style={{ flex: 1}}>
              
              <View style={stylesG.menuTop}>
                <Text style={{marginTop: 45, color: '#FFFFFF', fontSize:22, textAlign: 'center', width: '100%', fontWeight: 'bold'}}>
                  Agendar em {selectedDay} de {months[currentDate.month]} de {currentDate.year}
                </Text>
              </View>

              <View style={stylesG.menuTopBotao}>
                <View style={stylesG.linha}>

                  { selectedItem.ID > 0 ? 
                    <>
                      <TouchableOpacity style={stylesG.btn2} onPress={function(){setModalEventoVisible(false)}}>
                        <FontAwesome size={28} name="arrow-left" color={stylesG.iconeVoltar.color} />
                      </TouchableOpacity>

                      <TouchableOpacity style={stylesG.btn2} onPress={function(){gravar()}}>
                        <FontAwesome size={28} name="save" color={stylesG.iconeGravar.color} />
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={stylesG.btn2} onPress={function(){excluir()}}>
                        <FontAwesome size={28} name="trash" color={stylesG.iconeExcluir.color} /> 
                      </TouchableOpacity>
                    </> : 
                    <>
                      <TouchableOpacity style={stylesG.btn3} onPress={function(){setModalEventoVisible(false)}}>
                        <FontAwesome size={28} name="arrow-left" color={stylesG.iconeVoltar.color} />
                      </TouchableOpacity>

                      <TouchableOpacity style={stylesG.btn3} onPress={function(){gravar()}}>
                        <FontAwesome size={28} name="save" color={stylesG.iconeGravar.color} />
                      </TouchableOpacity>
                    </> 
                  } 
                </View>
              </View>

              <ScrollView style={{padding: 10, paddingBottom: 20}}>
                
                  {Platform.OS === 'ios' ?
                    <S.BodyOption>
                      <S.BodyTextLeft4>Hora: {}</S.BodyTextLeft4>
                      <S.BodyTextRight>
                        <S.Calendar2>
                          <DateTimePicker 
                            mode={'time'}
                            style={{width: 100, backgroundColor: '#FFFFFF'}}
                            value={new Date(moment(selectedDay+'-'+selectedMon+'-'+selectedYea+'T'+selectedItem.HORA).toISOString())}
                            onChange={function(event: DateTimePickerEvent, date: Date){
                              setDatePickerVisibility1(false);
                              setSelectedItem({
                                ...selectedItem,
                                HORA: moment(moment(date).toISOString()).format('HH:mm'),
                              });
                              return date;
                            }}
                          />
                          <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                        </S.Calendar2>
                      </S.BodyTextRight>
                    </S.BodyOption> :

                    <S.BodyOption>
                      <S.BodyTextLeft4>Hora: {}</S.BodyTextLeft4>
                      <S.BodyTextRight>
                        <S.Calendar2 onPress={showDatePicker1}>
                          <S.CalendarText2>
                            {moment(selectedDay+'-'+selectedMon+'-'+selectedYea+'T'+selectedItem.HORA).format('HH:mm')}
                          </S.CalendarText2>
                          <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                        </S.Calendar2>
                      </S.BodyTextRight>
                    </S.BodyOption>
                }

                <Input
                  label='Descrição'
                  placeholder='Descrição do produto'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      DESCRICAO: text,
                    });
                  }}
                  keyboardType={'default'}
                  defaultValue={selectedItem.DESCRICAO}
                  editable={true}
                  disabled={false}
                />
                
                <S.BodyOption2>
                  <S.BodyTextLeft>Cliente:</S.BodyTextLeft>
                    <CustomPicker
                      title={cliente.name}
                      onPress={handleOpenClienteModal}
                    />
                </S.BodyOption2>

              </ScrollView >
              
            </View>

            <Modal visible={clienteModalOpen}>
              <CustomPickerScreen
                title='Cliente'
                option={cliente}
                setOption={setCliente}
                onValueChange={(itemValue, itemIndex) => changeCliente(itemValue, itemIndex)}
                optionList={clienteList}
                closeCustomPickerScreen={handleCloseClienteModal}
              />
            </Modal>
            
            <ConfirmationModal
              visible={modalExcluirVisible}
              onConfirm={handleExcluirConfirm}
              onCancel={handleExcluirCancel}
              message="Deseja excluir esse item?"
            />
            
          </Modal>
          
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    color: '#000000',
  },
  headerText2: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dayText: {
    width: daySize,
    textAlign: 'center',
    color: '#555',
    fontWeight: 'bold',
  },
  day: {
    width: daySize,
    height: daySize,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  emptyDay: {
    width: daySize,
    height: daySize,
    backgroundColor: 'transparent',
  },
  currentDay: {
    backgroundColor: '#007bff',
  },
  currentDayText: {
    color: '#fff',
  },
  daysOfMonth: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
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
  linha:{
    backgroundColor: Colors.colors.success,
    flexDirection: 'row'
  },
  btn3: {
    width: '100%',
    alignContent:'center',
    verticalAlign:'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.colors.success,
    marginBottom: 20,
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10
  },
  btn2: {
    width: '46%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: '2.5%'
  },
});

export default Calendar;

