import { Modal, Pressable, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from '@/components/Themed';
import sqlTbProduto, {IProduto} from './Tabela';
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
import { formatNumber } from '@/app/utils/utils';
import styles from '../../style'
import { InputNumeric } from '@/components/InputNumeric';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Produtos() {

  const [state, setState] = useState({});
  const [produtos, setProdutos] = useState([] as IProduto[]);
  const [selectedItem, setSelectedItem] = useState({} as IProduto);
  
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

  const options_um = [
    { label: 'Milímetro'      , value: 'mm' },
    { label: 'Centímetro'     , value: 'cm' },
    { label: 'Metro'          , value: 'm'  },
    { label: 'Quilograma'     , value: 'kg' },
    { label: 'Grama'          , value: 'g'  },
    { label: 'Litro'          , value: 'L'  },
    { label: 'Mililitro'      , value: 'ml' },
    { label: 'Unidade'        , value: 'un' },
    { label: 'Par'            , value: 'pr' },
    { label: 'Pacote'         , value: 'pc' },
    { label: 'Caixa'          , value: 'cx' },
    { label: 'Peça'           , value: 'pç' },
    { label: 'Metro Quadrado' , value: 'm²' },
    { label: 'Metro Cúbico'   , value: 'm³' },
    { label: 'Tonelada'       , value: 't'  },
    { label: 'Pote'           , value: 'pt' },
    { label: 'Rolo'           , value: 'rl' },
    { label: 'Saco'           , value: 'sc' },
    { label: 'Garrafa'        , value: 'gf' },
    { label: 'Cartela'        , value: 'ct' },
    { label: 'Kit'            , value: 'kt' },
    { label: 'Fardo'          , value: 'frd'},
    { label: 'Dúzia'          , value: 'dz' },
    { label: 'Envelope'       , value: 'env'},
    { label: 'Tambor'         , value: 'tb' },
    { label: 'Bandeja'        , value: 'bdj'},
    { label: 'Balde'          , value: 'bd' },
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

    let total :any = await sqlTbProduto.length(temporarySearch, 0);
    let itens :any = await sqlTbProduto.pagination(temporarySearch, limit, ((pagina-1) * limit), 0);

    const totalPages = Math.ceil(total / limit);
    setTotalPages(totalPages);
    setProdutos(itens);
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
    
    await sqlTbProduto.create(selectedItem);
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
      DESCRICAO: '',
      EAN: '',
      MARCA: '',
      UM: 'un',
      VALOR_VENDA: 0.0,
      VALOR_COMPRA: 0.0,
      STATUS: 1,
      ID: 0,
    });
    setModalVisible(true);
  }

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);

  const handleExcluirConfirm = async () => {
    // Lógica a ser executada quando o botão "Sim" for pressionado

    await sqlTbProduto.deleteItem(selectedItem.ID);
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
              {produtos.length === 0 && (
                <S.NoResults>
                  Nenhum Item encontrado. Verifique os filtros.
                </S.NoResults>
              )}
              {produtos &&
                produtos.map((produto) => {
                  return (
                    <S.ListItem
                      key={produto.ID}
                      onPress={() => {  }}
                    >
                      <S.ListItemStatus>
                        {produto.STATUS == 1 ?
                          <FontAwesome size={28} style={{ marginBottom: -3 }} name="check" color={Colors.colors.success} /> :
                          <FontAwesome size={28} style={{ marginBottom: -3 }} name="times" color={Colors.colors.danger} /> 
                        }
                      </S.ListItemStatus>

                      <S.ListItemInfo>
                        <S.ListItemInfoTitle>
                          {produto.ID} - {produto.DESCRICAO}
                        </S.ListItemInfoTitle>

                        <S.ListItemInfoContainer>
                          <InfoItem id={produto.ID+'_01'} descricao={'EAN:'} valor={produto.EAN} />
                          <InfoItem id={produto.ID+'_02'} descricao={'Marca:'} valor={produto.MARCA} />
                          <InfoItem id={produto.ID+'_03'} descricao={'Vlr. Venda:'} valor={'R$ '+formatNumber(produto.VALOR_VENDA)} />
                          <InfoItem id={produto.ID+'_04'} descricao={'Vlr. Compra:'} valor={'R$ '+formatNumber(produto.VALOR_COMPRA)} />
                        </S.ListItemInfoContainer>

                      </S.ListItemInfo>

                      <S.ListItemLink>
                        <TouchableOpacity onPress={function(){abrirItem(produto)}}>
                          <FontAwesome size={40} style={{ marginBottom: -3 }} name="pencil-square" color={'#000000'} />
                        </TouchableOpacity>
                      </S.ListItemLink>

                    </S.ListItem>
                  );
                })}

              {produtos.length > 0 && (
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
                <Text style={{marginTop: 45,  color: '#FFFFFF', fontSize:22, textAlign: 'center', width: '100%', fontWeight: 'bold'}}>Produtos</Text>
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
                  options={options_um}
                  label="Medida"
                  onValueChange={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      UM: text,
                    });
                  }}
                  selectedValue={selectedItem.UM} // Valor inicial selecionado
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
                
                <Input
                  label='EAN'
                  placeholder='Código EAN'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      EAN: text,
                    });
                  }}
                  keyboardType={'default'}
                  defaultValue={selectedItem.EAN}
                  editable={true}
                  disabled={false}
                />
                
                <Input
                  label='Marca'
                  placeholder='Marca ou Fabricante'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      MARCA: text,
                    });
                  }}
                  keyboardType={'default'}
                  defaultValue={selectedItem.MARCA}
                  editable={true}
                  disabled={false}
                />
                
                <Input
                  label='Valor de Compra'
                  placeholder='Valor de Compra'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      VALOR_COMPRA: Number((text+'').replace('.','').replace('R$ ','').replace('R$','').replace(' ','').replace(',','.')),
                    });
                  }}
                  keyboardType={'numeric'}
                  defaultValue={selectedItem.VALOR_COMPRA+''}
                  editable={true}
                  disabled={false}
                />

                <Input
                  label='Valor de Venda'
                  placeholder='Valor de Venda'
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    setSelectedItem({
                      ...selectedItem,
                      VALOR_VENDA: Number((text+'').replace('.','').replace('R$ ','').replace('R$','').replace(' ','').replace(',','.')),
                    });
                  }}
                  keyboardType={'numeric'}
                  defaultValue={selectedItem.VALOR_VENDA+''}
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

