import { Platform , Modal, Pressable, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from '@/components/Themed';
import sqlTbConta, {IConta} from './Tabela';
import sqlTbProdutos, {IProduto} from '../Produtos/Tabela';
import sqlTbClientes, {IClient} from '../Clientes/Tabela';
import React, { useEffect, useState } from 'react';
import { Loading } from '../../Loading';
import * as S from './styles';
import { Layout } from '../../Layout';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import ConfirmationModal from '@/components/Confirmacao';
import Toast from '@/components/Toast';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import InfoItem from '@/components/ItemList';
//import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker, { DateTimePickerEvent }  from '@react-native-community/datetimepicker';
import moment from 'moment';
import { formatNumber } from '@/app/utils/utils';
import { CustomPickerScreen } from '@/components/CustomPickerScreen';
import { CustomPicker } from '@/components/CustomPicker';
import styles from '../../style'
import { InputNumeric } from '@/components/InputNumeric';
import db from '@/app/db';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Option {
  key       : string;
  name      : string;
  descricao : string; 
  dados     : any;
}

export default function Contas() {

  const [state, setState] = useState({});
  const [contas, setContas] = useState([] as IConta[]);
  const [selectedItem, setSelectedItem] = useState({} as IConta);
  
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [temporarySearch, setTemporarySearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'alert'>('success');
  const [toastMsg, setToastMsg] = useState('');
  
  const options_status = [
    { label: 'Pendente', value: 1 },
    { label: 'Pago'    , value: 2 }
  ];

  const options_tipo = [
    { label: 'Pagar'  , value: 1 },
    { label: 'Receber', value: 2 }
  ];

  const showToast = (msg:string, type: 'success' | 'error' | 'alert') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastVisible(true);

    // Esconde o toast após 2 segundos
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  async function filtrarLista(pagina:number){
    setLoading(true);
    setPage(pagina);

    let limit = 30;

    let total :any = await sqlTbConta.length(temporarySearch, 0);
    let itens :any = await sqlTbConta.pagination(temporarySearch, limit, ((pagina-1) * limit), 0);

    const totalPages = Math.ceil(total / limit);
    setTotalPages(totalPages);
    setContas(itens);
    setLoading(false);
    setTemporarySearch('');
  }

  async function handleSearch() {
    filtrarLista(1);
  }

  useEffect(() => {
    
    filtrarLista(1);

    return () => {
      setState({}); // This worked for me
    };
  }, []);
  
  async function gravar() {
    
    let itemGravar = {
      DESCRICAO       : selectedItem.DESCRICAO,
      PESSOA_ID       : cliente.dados.ID,
      PRODUTO_ID      : produto.dados.ID,
      VALOR_PAGAR     : selectedItem.VALOR_PAGAR,
      VALOR_PAGO      : selectedItem.VALOR_PAGO,
      DATA_PAGAMENTO  : moment(selectedItem.DATA_PAGAMENTO).format('YYYY-MM-DD'),
      DATA_PREVISAO   : moment(selectedItem.DATA_PREVISAO).format('YYYY-MM-DD'),
      DATA_REGISTRO   : moment(selectedItem.DATA_REGISTRO).format('YYYY-MM-DD'), 
      STATUS          : selectedItem.STATUS,
      TIPO            : selectedItem.TIPO,
      ID              : selectedItem.ID,
    }

    db.logAdd(itemGravar);

    await sqlTbConta.create(itemGravar);
    filtrarLista(1);

    showToast('Gravado com sucesso', 'success');
    setModalVisible(false);
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

    finalItem = {
      key: `${item.PRODUTO_ID}`,
      name: `${(item.PRODUTO_ID+'').padStart(4, "0")} - ${item.DESC_PRODUTO}`,
      descricao: `${(item.PRODUTO_ID+'').padStart(4, "0")} - ${item.DESC_PRODUTO}`,
      dados: {ID: item.PRODUTO_ID, RAZAO_SOCIAL: item.DESC_PRODUTO},
    };

    setProduto(finalItem);

    setSelectedItem(item);
    setModalVisible(true);
  }

  async function adicionar() {
    setSelectedItem({
      DESCRICAO: '',
      PESSOA_ID: 0,
      PRODUTO_ID: 0,
      VALOR_PAGAR: 0,
      VALOR_PAGO: 0,
      DATA_PAGAMENTO: moment().toDate(),
      DATA_PREVISAO: moment().toDate(),
      DATA_REGISTRO: moment().toDate(),
      STATUS: 1,
      TIPO: 2,
      ID: 0,
      DESC_CLIENTE: '',
      DESC_PRODUTO: '',
      VALOR_PENDENTE: 0
    });

    let finalItem = {
      key: ``,
      name: ``,
      descricao: ``,
      dados: {ID: 0, RAZAO_SOCIAL: ''}
    };

    setCliente(finalItem);

    finalItem = {
      key: ``,
      name: ``,
      descricao: ``,
      dados: {ID: 0, RAZAO_SOCIAL: ''}
    };

    setProduto(finalItem);
    setModalVisible(true);
  }

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);

  const handleExcluirConfirm = async () => {
    // Lógica a ser executada quando o botão "Sim" for pressionado

    await sqlTbConta.deleteItem(selectedItem.ID);
    filtrarLista(1);

    showToast('Excluído com sucesso', 'alert');
    setModalExcluirVisible(false);
    setModalVisible(false);

  };

  const handleExcluirCancel = () => {
    // Lógica a ser executada quando o botão "Não" for pressionado
    setModalExcluirVisible(false);
  };

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
    
    setSelectedItem({
      ...selectedItem,
      DATA_PAGAMENTO: date,
    });

    hideDatePicker1();
  };

  const handleConfirm2 = (date: Date) => {
    setSelectedItem({
      ...selectedItem,
      DATA_PREVISAO: date,
    });

    hideDatePicker2();
  };

  const handleConfirm3 = (date: Date) => {
    setSelectedItem({
      ...selectedItem,
      DATA_REGISTRO: date,
    });

    hideDatePicker3();
  };

  //produtos
  const [produtoList, setProdutoList] = useState([] as Option[]);
  const [produtoModalOpen, setProdutoModalOpen] = useState(false);

  async function handleOpenProdutoModal() {

    let finalProdutoList: { key: string; name: string, descricao: string, dados: any }[] = [];
    const produtos : any = await sqlTbProdutos.list();

    produtos.map((tipo: any) => {
        finalProdutoList.push({
          key: `${tipo.ID}`,
          name: `${(tipo.ID+'').padStart(4, "0")} - ${tipo.DESCRICAO}`,
          descricao: `${(tipo.ID+'').padStart(4, "0")} - ${tipo.DESCRICAO}`,
          dados: tipo,
        });
    });
    
    setProdutoList(finalProdutoList);
    setProdutoModalOpen(true);
  }

  function handleCloseProdutoModal() {
    setProdutoModalOpen(false);
  }

  const [produto, setProduto] = useState({
    key: '',
    name: '',
    descricao: '',
    dados: {},
  });

  async function changeProduto(itemValue : any, itemIndex : any){

  }

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

  return (
    <View>

      <View style={styles.menuTopSeach}>
        <View style={styles.linha}>

          <TouchableOpacity style={styles.btn} onPress={function(){adicionar()}}>
            <FontAwesome size={40} name="plus-circle" color={'#ffffff'} />
          </TouchableOpacity>

          <TouchableOpacity  style={styles.Search}>

            <TextInput
              style={styles.Input}
              autoCorrect={false}
              value={temporarySearch}
              defaultValue={temporarySearch}
              onChangeText={setTemporarySearch}
            />

          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btn} onPress={function(){handleSearch()}}>
            <FontAwesome size={40} name="search" color={'#ffffff'} />
          </TouchableOpacity>

        </View>
      </View>

      {loading ? (
        <Loading />
      ) : (
        <>
          <S.Content>
            <S.Container>
              {contas.length === 0 && (
                <S.NoResults>
                  Nenhum Item encontrado. Verifique os filtros.
                </S.NoResults>
              )}
              {contas &&
                contas.map((conta) => {
                  return (
                    <S.ListItem
                      key={conta.ID}
                      onPress={() => {  }}
                    >
                      <S.ListItemStatus>
                        {conta.TIPO == 2 ?
                          <FontAwesome size={28} style={{ marginBottom: -3 }} name="plus" color={Colors.colors.success} /> :
                          <FontAwesome size={28} style={{ marginBottom: -3 }} name="minus" color={Colors.colors.danger} /> 
                        }

                        {conta.VALOR_PENDENTE == 0 ?
                          <FontAwesome size={28} style={{ marginBottom: -3 }} name="money" color={Colors.colors.success} /> :
                          <FontAwesome size={28} style={{ marginBottom: -3 }} name="money" color={Colors.colors.danger} /> 
                        }

                      </S.ListItemStatus>

                      <S.ListItemInfo>
                        <S.ListItemInfoTitle>
                          {conta.ID} - {conta.DESC_CLIENTE}
                        </S.ListItemInfoTitle>

                        <S.ListItemInfoContainer>
                          <InfoItem id={conta.ID+'_01'} descricao={'Produto:'} valor={conta.DESC_PRODUTO} />
                          <InfoItem id={conta.ID+'_02'} descricao={'Vlr. Conta:'} valor={'R$ '+formatNumber(conta.VALOR_PAGAR)} />
                          <InfoItem id={conta.ID+'_03'} descricao={'Vlr. Saldo:'} valor={'R$ '+formatNumber(conta.VALOR_PENDENTE)} />
                          <InfoItem id={conta.ID+'_04'} descricao={'Pagamento:'} valor={moment(conta.DATA_PAGAMENTO).format('DD/MM/YYYY')} />
                          <InfoItem id={conta.ID+'_05'} descricao={'Vencimento:'} valor={moment(conta.DATA_PREVISAO).format('DD/MM/YYYY')} />
                          <InfoItem id={conta.ID+'_06'} descricao={'Registro:'} valor={moment(conta.DATA_REGISTRO).format('DD/MM/YYYY')} />
                        </S.ListItemInfoContainer>

                      </S.ListItemInfo>

                      <S.ListItemLink>
                        <TouchableOpacity onPress={function(){abrirItem(conta)}}>
                          <FontAwesome size={40} style={{ marginBottom: -3 }} name="pencil-square" color={'#000000'} />
                        </TouchableOpacity>
                      </S.ListItemLink>

                    </S.ListItem>
                  );
                })}

              {contas.length > 0 && (
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
                              !active ? () => filtrarLista(itemPage) : () => {}
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

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={{ flex: 1}}>
              
              <View style={styles.menuTop}>
                <Text style={{marginTop: 45,  color: '#FFFFFF', fontSize:22, textAlign: 'center', width: '100%', fontWeight: 'bold'}}>Contas</Text>
              </View>

              <View style={styles.menuTopBotao}>
                <View style={styles.linha}>

                  { selectedItem.ID > 0 ? 
                  <>
                    <TouchableOpacity style={styles.btn2} onPress={function(){setModalVisible(false)}}>
                      <FontAwesome size={28} name="arrow-left" color={styles.iconeVoltar.color} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn2} onPress={function(){gravar()}}>
                      <FontAwesome size={28} name="save" color={styles.iconeGravar.color} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.btn2} onPress={function(){excluir()}}>
                      <FontAwesome size={28} name="trash" color={styles.iconeExcluir.color} /> 
                    </TouchableOpacity>
                  </> : 
                  <>
                    <TouchableOpacity style={styles.btn3} onPress={function(){setModalVisible(false)}}>
                      <FontAwesome size={28} name="arrow-left" color={styles.iconeVoltar.color} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn3} onPress={function(){gravar()}}>
                      <FontAwesome size={28} name="save" color={styles.iconeGravar.color} />
                    </TouchableOpacity>
                  </> 
                  } 
                </View>
              </View>

              <KeyboardAwareScrollView 
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
                style={{flex: 1, padding: 10, paddingBottom: 20}}>

                { selectedItem.ID > 0 ? 
                <Input
                  label='ID'
                  placeholder='ID'
                  autoCorrect={false}
                  autoCapitalize='none'
                  keyboardType={'default'}
                  defaultValue={selectedItem.ID+''}
                  editable={false}
                  disabled={true}
                /> : <></>}

                { false ? 
                  <Select
                    options={options_status}
                    label="Status"
                    onValueChange={(text) => {
                      setSelectedItem({
                        ...selectedItem,
                        STATUS: text,
                      });
                    }}
                    selectedValue={selectedItem.STATUS} // Valor inicial selecionado
                /> : <></>}

                <Select
                  options={options_tipo}
                  label="Tipo"
                  onValueChange={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      TIPO: text,
                    });
                  }}
                  selectedValue={Number(selectedItem.TIPO)} // Valor inicial selecionado
                />
                
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
                  <S.BodyTextLeft>Produto:</S.BodyTextLeft>
                    <CustomPicker
                      title={produto.name}
                      onPress={handleOpenProdutoModal}
                    />
                </S.BodyOption2>

                <S.BodyOption2>
                  <S.BodyTextLeft>Cliente:</S.BodyTextLeft>
                    <CustomPicker
                      title={cliente.name}
                      onPress={handleOpenClienteModal}
                    />
                </S.BodyOption2>

                <Input
                  label='Valor'
                  placeholder='Valor'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      VALOR_PAGAR: Number(text),
                    });
                  }}
                  keyboardType={'numeric'}
                  defaultValue={selectedItem.VALOR_PAGAR+''}
                  editable={true}
                  disabled={false}
                />

                <Input
                  label='Valor Pago'
                  placeholder='Valor Pago'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      VALOR_PAGO: Number(text),
                    });
                  }}
                  keyboardType={'numeric'}
                  defaultValue={selectedItem.VALOR_PAGO+''}
                  editable={true}
                  disabled={false}
                />

                {Platform.OS === 'ios' ?
                  <S.BodyOption>
                    <S.BodyTextLeft4>Data Pagamento: {}</S.BodyTextLeft4>
                    <S.BodyTextRight>
                      <S.Calendar2>
                        <DateTimePicker 
                          mode={'date'}
                          style={{width: 100, backgroundColor: '#FFFFFF'}}
                          value={new Date(moment(selectedItem.DATA_PAGAMENTO).toISOString())}
                          onChange={function(event: DateTimePickerEvent, date: Date){
                            setDatePickerVisibility1(false);
                            setSelectedItem({
                              ...selectedItem,
                              DATA_PAGAMENTO: date,
                            });
                            return date;
                          }}
                        />
                        <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                      </S.Calendar2>
                    </S.BodyTextRight>
                  </S.BodyOption> :

                  <S.BodyOption>
                    <S.BodyTextLeft4>Data Pagamento: {}</S.BodyTextLeft4>
                    <S.BodyTextRight>
                      <S.Calendar2 onPress={showDatePicker1}>
                        <S.CalendarText2>
                          {moment(selectedItem.DATA_PAGAMENTO).format('DD/MM/YYYY')}
                        </S.CalendarText2>
                        <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                      </S.Calendar2>
                    </S.BodyTextRight>
                  </S.BodyOption>
                  }
                
               
                {Platform.OS === 'ios' ?
                  <S.BodyOption>
                    <S.BodyTextLeft4>Data Vencimento: {}</S.BodyTextLeft4>
                    <S.BodyTextRight>
                      <S.Calendar2>
                        <DateTimePicker 
                          mode={'date'}
                          style={{width: 100, backgroundColor: '#FFFFFF'}}
                          value={new Date(moment(selectedItem.DATA_PREVISAO).toISOString())}
                          onChange={function(event: DateTimePickerEvent, date: Date){
                            setDatePickerVisibility1(false);
                            setSelectedItem({
                              ...selectedItem,
                              DATA_PREVISAO: date,
                            });
                            return date;
                          }}
                        />
                        <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                      </S.Calendar2>
                    </S.BodyTextRight>
                  </S.BodyOption> :
                  <S.BodyOption>
                    <S.BodyTextLeft4>Data Vencimento: {}</S.BodyTextLeft4>
                    <S.BodyTextRight>
                      <S.Calendar2 onPress={showDatePicker2}>
                        <S.CalendarText2>
                          {moment(selectedItem.DATA_PREVISAO).format('DD/MM/YYYY')}
                        </S.CalendarText2>
                        <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                      </S.Calendar2>
                    </S.BodyTextRight>
                  </S.BodyOption>
                }

                {Platform.OS === 'ios' ?
                  <S.BodyOption>
                    <S.BodyTextLeft4>Data Registro: {}</S.BodyTextLeft4>
                    <S.BodyTextRight>
                      <S.Calendar2>
                        <DateTimePicker 
                          mode={'date'}
                          style={{width: 100, backgroundColor: '#FFFFFF'}}
                          value={new Date(moment(selectedItem.DATA_REGISTRO).toISOString())}
                          onChange={function(event: DateTimePickerEvent, date: Date){
                            setDatePickerVisibility1(false);
                            setSelectedItem({
                              ...selectedItem,
                              DATA_REGISTRO: date,
                            });
                            return date;
                          }}
                        />
                        <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                      </S.Calendar2>
                    </S.BodyTextRight>
                  </S.BodyOption> :
                  <S.BodyOption>
                    <S.BodyTextLeft4>Data Registro: {}</S.BodyTextLeft4>
                    <S.BodyTextRight>
                      <S.Calendar2 onPress={showDatePicker3}>
                        <S.CalendarText2>
                          {moment(selectedItem.DATA_REGISTRO).format('DD/MM/YYYY')}
                        </S.CalendarText2>
                        <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                      </S.Calendar2>
                    </S.BodyTextRight>
                  </S.BodyOption>
                }

              </KeyboardAwareScrollView >
              
            </View>

            <ConfirmationModal
              visible={modalExcluirVisible}
              onConfirm={handleExcluirConfirm}
              onCancel={handleExcluirCancel}
              message="Deseja excluir esse item?"
            />

            

              {isDatePickerVisible2 ? 
              <DateTimePicker 
                mode={'date'}
                value={new Date(moment(selectedItem.DATA_PREVISAO).toISOString())}
                onChange={function(event: DateTimePickerEvent, date: Date){
                  setDatePickerVisibility2(false);
                  setSelectedItem({
                    ...selectedItem,
                    DATA_PREVISAO: date,
                  });
                  return date;
                }}
              /> : <></>}

              {isDatePickerVisible3 ? 
                <DateTimePicker 
                  mode={'date'}
                  value={new Date(moment(selectedItem.DATA_REGISTRO).toISOString())}
                  onChange={function(event: DateTimePickerEvent, date: Date){
                    setDatePickerVisibility3(false);
                    setSelectedItem({
                      ...selectedItem,
                      DATA_REGISTRO: date,
                    });
                    return date;
                  }}
              /> : <></>}

            <Modal visible={produtoModalOpen}>
              <CustomPickerScreen
                title='Produto'
                option={produto}
                setOption={setProduto}
                onValueChange={(itemValue, itemIndex) => changeProduto(itemValue, itemIndex)}
                optionList={produtoList}
                closeCustomPickerScreen={handleCloseProdutoModal}
              />
            </Modal>

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

          </Modal>
          <Toast
              message={toastMsg}
              isVisible={isToastVisible}
              type={toastType}
              onHide={() => setIsToastVisible(false)}
            />

        </>
      )}
    </View>

    
  );
}


