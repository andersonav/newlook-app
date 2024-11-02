import { Modal, Pressable, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from '@/components/Themed';
import sqlTbCliente, {IClient} from './Tabela';
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
import styles from '../../style'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Clientes() {

  const [state, setState] = useState({});
  const [clients, setClients] = useState([] as IClient[]);
  const [selectedItem, setSelectedItem] = useState({} as IClient);
  
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [temporarySearch, setTemporarySearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'alert'>('success');
  const [toastMsg, setToastMsg] = useState('');
  
  const options_status = [
    { label: 'Ativo', value: 1 },
    { label: 'Inativo', value: 0 }
  ];

  const options_tipo = [
    { label: 'Pessoa Física', value: 1 },
    { label: 'Pessoa Jurídica', value: 2 }
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

    let total :any = await sqlTbCliente.length(temporarySearch, 0);
    let itens :any = await sqlTbCliente.pagination(temporarySearch, limit, ((pagina-1) * limit), 0);

    const totalPages = Math.ceil(total / limit);
    setTotalPages(totalPages);
    setClients(itens);
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
    
    await sqlTbCliente.create(selectedItem);
    filtrarLista(1);

    showToast('Gravado com sucesso', 'success');
    setModalVisible(false);
  } 

  async function excluir() {
  
    setModalExcluirVisible(true);
    
  } 

  async function abrirItem(item:any) {
    setSelectedItem(item);
    setModalVisible(true);
  }

  async function adicionar() {
    setSelectedItem({
      ID: 0,
      DESCRICAO: '',
      STATUS: 1,
      TIPO: 1,
      CEP: '',
      ENDERECO: '',
      NOME_FANTAZIA: '',
      NUMERO: '',
      RAZAO_SOCIAL: '',
      CPF_CNPJ: ''
    });
    setModalVisible(true);
  }

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);

  const handleExcluirConfirm = async () => {
    // Lógica a ser executada quando o botão "Sim" for pressionado

    await sqlTbCliente.deleteItem(selectedItem.ID);
    filtrarLista(1);

    showToast('Excluído com sucesso', 'alert');
    setModalExcluirVisible(false);
    setModalVisible(false);

  };

  const handleExcluirCancel = () => {
    // Lógica a ser executada quando o botão "Não" for pressionado
    setModalExcluirVisible(false);
  };

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
              {clients.length === 0 && (
                <S.NoResults>
                  Nenhum item encontrado. Verifique os filtros.
                </S.NoResults>
              )}
              {clients &&
                clients.map((client) => {
                  return (
                    <S.ListItem
                      key={client.ID}
                      onPress={() => {  }}
                    >
                      <S.ListItemStatus>
                        {client.STATUS == 1 ?
                          <FontAwesome size={28} style={{ marginBottom: -3 }} name="check" color={Colors.colors.success} /> :
                          <FontAwesome size={28} style={{ marginBottom: -3 }} name="times" color={Colors.colors.danger} /> 
                        }
                      </S.ListItemStatus>

                      <S.ListItemInfo>
                        <S.ListItemInfoTitle>
                          {client.ID} - {client.RAZAO_SOCIAL}
                        </S.ListItemInfoTitle>

                        <S.ListItemInfoContainer>
                          <InfoItem id={client.ID+'_01'} descricao={'Nome Fant.:'} valor={client.NOME_FANTAZIA} />
                          <InfoItem id={client.ID+'_02'} descricao={'CPF/CNPJ:'} valor={client.CPF_CNPJ} />
                          <InfoItem id={client.ID+'_03'} descricao={'Tipo:'} valor={client.TIPO == 1 ? 'Pessoa Física' : 'Pessoa Jurídica'} />
                          <InfoItem id={client.ID+'_04'} descricao={'Endereço:'} valor={client.ENDERECO} />
                        </S.ListItemInfoContainer>

                      </S.ListItemInfo>

                      <S.ListItemLink>
                        <TouchableOpacity onPress={function(){abrirItem(client)}}>
                          <FontAwesome size={40} style={{ marginBottom: -3 }} name="pencil-square" color={'#000000'} />
                        </TouchableOpacity>
                      </S.ListItemLink>

                    </S.ListItem>
                  );
                })}

              {clients.length > 0 && (
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
                <Text style={{marginTop: 45, color: '#FFFFFF', fontSize:22, textAlign: 'center', width: '100%', fontWeight: 'bold'}}>Pessoas</Text>
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

                <Select
                  options={options_tipo}
                  label="Tipo"
                  onValueChange={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      TIPO: text,
                    });
                  }}
                  selectedValue={selectedItem.TIPO} // Valor inicial selecionado
                />

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
                />

                <Input
                  label='CPF/CNPJ'
                  placeholder='CPF ou CNPJ'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      CPF_CNPJ: text,
                    });
                  }}
                  keyboardType={'default'}
                  defaultValue={selectedItem.CPF_CNPJ}
                  editable={true}
                  disabled={false}
                />
                
                <Input
                  label='Razão Social'
                  placeholder='Razão Social'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      RAZAO_SOCIAL: text,
                    });
                  }}
                  keyboardType={'default'}
                  defaultValue={selectedItem.RAZAO_SOCIAL}
                  editable={true}
                  disabled={false}
                />
                
                <Input
                  label='Nome Fantasia'
                  placeholder='Nome Fantasia'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      NOME_FANTAZIA: text,
                    });
                  }}
                  keyboardType={'default'}
                  defaultValue={selectedItem.NOME_FANTAZIA}
                  editable={true}
                  disabled={false}
                />
                
                <Input
                  label='Endereço'
                  placeholder='Endereço'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      ENDERECO: text,
                    });
                  }}
                  keyboardType={'default'}
                  defaultValue={selectedItem.ENDERECO}
                  editable={true}
                  disabled={false}
                />
                
                <Input
                  label='Número'
                  placeholder='Número'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      NUMERO: text,
                    });
                  }}
                  keyboardType={'default'}
                  defaultValue={selectedItem.NUMERO}
                  editable={true}
                  disabled={false}
                />
                
                <Input
                  label='CEP'
                  placeholder='CEP'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      CEP: text,
                    });
                  }}
                  keyboardType={'default'}
                  defaultValue={selectedItem.CEP}
                  editable={true}
                  disabled={false}
                />

              </KeyboardAwareScrollView >
              
            </View>

            <ConfirmationModal
              visible={modalExcluirVisible}
              onConfirm={handleExcluirConfirm}
              onCancel={handleExcluirCancel}
              message="Deseja excluir esse item?"
            />
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


