import { Modal, Pressable, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from '@/components/Themed';
import sqlTbProduto, {IProduto} from './Tabela';
import React, { useEffect, useState } from 'react';
import { Loading } from '../../Loading';
import * as S from './styles';
import { Layout } from '../../Layout';
import Colors from '@/constants/Colors';
import { Link, router } from 'expo-router';
import ConfirmationModal from '@/components/Confirmacao';
import Toast from '@/components/Toast';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import InfoItem from '@/components/ItemList';
import db from '@/app/db';
import Dialog from "react-native-dialog";

export default function Produtos() {

  const [state, setState] = useState({});
  const [produtos, setProdutos] = useState([] as IProduto[]);
  const [selectedItem, setSelectedItem] = useState({} as IProduto);
  
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [temporarySearch, setTemporarySearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRelatorioVisible, setModalRelatorioVisible] = useState(false);
  
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

  const toggleRelatorioModal = () => {
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

  const [logText, setLogText] = useState('');
  const [progressoDowload, setProgressoDowload] = useState('');
  const [visible, setVisible] = useState(false);
  const [valorUrl, onChangeValorUrl] = React.useState('');

  async function handleCancel(){
    setVisible(false);
  };

  async function handleDelete(){
    setVisible(false);
    db.restoreFile2(valorUrl, 0, setLogText, setProgressoDowload, true);
  };

  return (
    <View>

      <View style={styles.container}>
        <Dialog.Container visible={visible}>
          <Dialog.Title style={styles.titulo}>Link Do Arquivo</Dialog.Title>          
          <TextInput autoFocus={true} value={valorUrl} onChangeText={onChangeValorUrl} placeholder="Link do Arquivo"/>
          <Dialog.Button label="Cancelar" onPress={handleCancel} />
          <Dialog.Button label="Confirmar" onPress={handleDelete} />
        </Dialog.Container>
      </View>

      {loading ? (
        <Loading />
      ) : (
        <>
          <View style={{width: '100%', padding: 20}}>
            <TouchableOpacity style={styles.btn3} onPress={function(){router.push('../../Relatorios/Faturamento');}}>
              <FontAwesome size={35} name="print" color={'#FFFFFF'} /><Text style={{fontSize:20, color: '#FFFFFF', width: '90%', textAlign: "center", paddingRight: '10%'}}> Movimentações Financeiras</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn3} onPress={function(){setModalVisible(true);}}>
              <FontAwesome size={35} name="cog" color={'#FFFFFF'} /><Text style={{fontSize:20, color: '#FFFFFF', width: '90%', textAlign: "center", paddingRight: '10%'}}> Configurações</Text>
            </TouchableOpacity>
          </View>

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
                <Text style={{marginTop: 30, color: '#FFFFFF', fontSize:22, textAlign: 'center', width: '100%', fontWeight: 'bold'}}>Configurações</Text>
              </View>

              <View style={styles.menuTopBotao}>
                <View style={styles.linha}>
                  <>
                    <TouchableOpacity style={styles.btn2} onPress={function(){setModalVisible(false)}}>
                      <FontAwesome size={28} name="arrow-left" color={'#FFFFFF'} />
                    </TouchableOpacity>
                  </> 
                </View>
              </View>

              <ScrollView style={{padding: 10, paddingBottom: 20}}>
                <TouchableOpacity style={styles.btn3} onPress={function(){db.backupFile();}}>
                  <FontAwesome size={35} name="database" color={'#FFFFFF'} /><Text style={{fontSize:20, color: '#FFFFFF', width: '90%', textAlign: "center", paddingRight: '10%'}}> Backup</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn3} onPress={function(){db.restoreFile();}}>
                  <FontAwesome size={35} name="cloud-upload" color={'#FFFFFF'} /><Text style={{fontSize:20, color: '#FFFFFF', width: '90%', textAlign: "center", paddingRight: '10%'}}> Restore File</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn3} onPress={function(){setVisible(true);}}>
                  <FontAwesome size={35} name="cloud-download" color={'#FFFFFF'} /><Text style={{fontSize:20, color: '#FFFFFF', width: '90%', textAlign: "center", paddingRight: '10%'}}> Restore URL</Text>
                </TouchableOpacity>
              </ScrollView >
              
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalRelatorioVisible}
            onRequestClose={() => {
              setModalVisible(!modalRelatorioVisible);
            }}
          >
            <View style={{ flex: 1}}>
              
              <View style={styles.menuTop}>
                <Text style={{marginTop: 45, color: '#FFFFFF', fontSize:22, textAlign: 'center', width: '100%', fontWeight: 'bold'}}>Relatórios</Text>
              </View>

              <View style={styles.menuTopBotao}>
                <View style={styles.linha}>
                  <>
                    <TouchableOpacity style={styles.btn2} onPress={function(){setModalRelatorioVisible(false)}}>
                      <FontAwesome size={28} name="arrow-left" color={'#FFFFFF'} />
                    </TouchableOpacity>
                  </> 
                </View>
              </View>

              <ScrollView style={{padding: 10, paddingBottom: 20}}>
                <TouchableOpacity style={styles.btn3} onPress={function(){}}>
                  <FontAwesome size={35} name="money" color={'#FFFFFF'} /><Text style={{fontSize:20, color: '#FFFFFF', width: '90%', textAlign: "center", paddingRight: '10%'}}> Faturamento por período</Text>
                </TouchableOpacity>

                
                <Link style={styles.btn3} push href="../../Relatorios/Faturamento">Login</Link>
                

                <TouchableOpacity style={styles.btn3} onPress={function(){}}>
                  <FontAwesome size={35} name="money" color={'#FFFFFF'} /><Text style={{fontSize:20, color: '#FFFFFF', width: '90%', textAlign: "center", paddingRight: '10%'}}> Valores a Pagar</Text>
                </TouchableOpacity>
              </ScrollView >
              
            </View>
          </Modal>
        </>
      )}
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    textAlign: "center", 
    alignItems: "center",
    justifyContent: "center",
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
    width: '96%',
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
    alignContent:'center',
    verticalAlign:'auto',
    justifyContent: 'center',
    alignItems: 'center'
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
  Search: {
    width: '70%'
  },
  Input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    margin: 1,
    width: '100%'
  }
});

