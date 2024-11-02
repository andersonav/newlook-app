import { Modal, Pressable, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePicker, { DateTimePickerEvent }  from '@react-native-community/datetimepicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import * as Print from 'expo-print';
import * as MediaLibrary from "expo-media-library";
import { Platform } from 'react-native';
import { shareAsync } from 'expo-sharing';
import Colors from '@/constants/Colors';
import { Text, View } from '@/components/Themed';
import DataGeral from '../../../components/Data';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';
import sqlTbContas from '../../(tabs)/Contas/Tabela';
import sqlTbClientes from '../../(tabs)/Clientes/Tabela';
import { formatNumber } from '@/app/utils/utils';
import * as S from './styles';
import moment from 'moment';
import { CustomPicker } from '@/components/CustomPicker';
import { CustomPickerScreen } from '@/components/CustomPickerScreen';
import { Select } from '@/components/Select';

interface Option {
    key       : string;
    name      : string;
    descricao : string; 
    dados     : any;
}

export default function RelatorioFaturamento() {

    const [nome, setNome] = useState('Movimentações Financeiras');
    const [html, setHTML] = useState('');
    const [loading, setLoading] = useState(false);
    const [verPDF, setVerPDF] = useState(false);

    async function gerarPDF(){

        setLoading(true);

        let listaDados:any = await sqlTbContas.getContas(dataInicial, dataFinal, Number(cliente.key));
        //console.log(listaDados);
        
        let cabecario = `
            <tr>
                <th></th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Valor</th>
                <th>Saldo</th>
            </tr>
        `;

        let linhas = ``;
        let totalValor  = 0;
        let totalSaldo  = 0;

        for (let index = 0; index < listaDados.length; index++) {
            const item = listaDados[index];
            
            if(tipo == 0 || item.TIPO == tipo){
                let linha = `
                    <tr>
                        <td>${ item.TIPO == 1 ? '-' : '+'}</td>
                        <td>${ moment(item.DATA_REGISTRO).format('DD/MM/YYYY')}</td>
                        <td>${item.CLIENTE}</td>
                        <td>${item.PRODUTO}</td>
                        <td>${'R$ '+formatNumber(item.VALOR_PAGAR)}</td>
                        <td>${'R$ '+formatNumber(item.VALOR_PENDENTE)}</td>
                    </tr>
                `;

                totalValor += item.TIPO == 1 ? (Number(item.VALOR_PAGAR)    * -1) : Number(item.VALOR_PAGAR);
                totalSaldo += item.TIPO == 1 ? (Number(item.VALOR_PENDENTE) * -1) : Number(item.VALOR_PENDENTE);
                
                linhas += linha;
            }
        }

        let total = `
            <tr style="font-weight: bold; background-color: #e9e9e9;">
                <td colspan="4">Total</td>
                <td>${'R$ '+formatNumber(totalValor)}</td>
                <td>${'R$ '+formatNumber(totalSaldo)}</td>
            </tr>
        `;

        let html = `
            <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title> ${nome} </title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #FFFFFF;
                            font-size: 15px;
                            width: 100%;
                        }
                        .container {
                            padding: 10px;
                            width: 100%;
                        }
                        h2 {
                            text-align: center;
                            color: #333;
                            margin-bottom: 10px;
                            width: calc(100% - 40px);
                        }
                        table {
                            border-collapse: collapse;
                            margin-bottom: 10px;
                            width: calc(100% - 40px);
                        }
                        th, td {
                            padding: 12px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
                        th {
                            background-color: #e9e9e9;
                        }
                        .total {
                            font-weight: bold;
                            font-size: 18px;
                            margin-top: 10px;
                        }
                        .observation {
                            margin-top: 10px;
                            font-style: italic;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2> ${nome} </h2>
                        <table>
                            ${cabecario}                            
                            ${linhas}
                            ${total}
                        </table>
                    </div>
                </body>
            </html>
        
        `;

        try {
            //console.log(html);
            setHTML(html);
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
        setVerPDF(true);
    }

    async function dowloadPDF(){

        try {
            const { uri } = await Print.printToFileAsync({ html });

            if (Platform.OS === "ios") {
                await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            } else {
                const permission = await MediaLibrary.requestPermissionsAsync();
                if (permission.granted) {
                    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
                }
            }
    
        } catch (error) {
            console.log(error);
        }

        setVerPDF(false);
    }

    const [dataInicial, setdataInicial] = useState(moment().format('YYYY-MM-01'));
    const [dataFinal, setdataFinal] = useState(moment().format('YYYY-MM-DD'));
    const [tipo, setTipo] = useState(0);

    //Cliente
    const [clienteList, setClienteList] = useState([] as Option[]);
    const [clienteModalOpen, setClienteModalOpen] = useState(false);

    async function handleOpenClienteModal() {

        let finalClienteList: { key: string; name: string, descricao: string, dados: any }[] = [];
        const clientes : any = await sqlTbClientes.list();

        finalClienteList.push({
            key: `0`,
            name: `Todos`,
            descricao: `Todos`,
            dados: {},
        });

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
        key: '0',
        name: 'Todos',
        descricao: 'Todos',
        dados: {},
    });

    async function changeCliente(itemValue : any, itemIndex : any){

    }

    const options_tipo = [
        { label: 'Todos'  , value: 0 },
        { label: 'Pagar'  , value: 1 },
        { label: 'Receber', value: 2 }
    ];

    return (
        <View style={{ flex: 1}}>
            
            <View style={styles.menuTop}>
                <Text style={{marginTop: 45, color: '#FFFFFF', fontSize:22, textAlign: 'center', width: '100%'}}>{nome}</Text>
            </View>

            <View style={styles.menuTopBotao}>
                <View style={styles.linha}>
                    { !verPDF ? 
                    <>
                        <TouchableOpacity style={styles.btn} onPress={function(){ router.back();}}>
                            <FontAwesome size={28} name="arrow-left" color={'#FFFFFF'} />
                        </TouchableOpacity>
                    </> : <>
                        <TouchableOpacity style={styles.btnFiltrar2} onPress={function(){router.back();}}>
                            <FontAwesome size={28} name="arrow-left" style={{color: '#FFFFFF'}} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnFiltrar2} onPress={function(){setVerPDF(false);}}>
                            <FontAwesome size={28} name="close" style={{color: '#FFFFFF'}} />
                        </TouchableOpacity>
                    </>
                    }
                </View>
            </View>

            { !verPDF ? 
                <>
                { loading ? 
                    <ActivityIndicator size="large" color="#006600" /> : 
                    <>
                        <ScrollView style={{padding: 10, paddingBottom: 20}}>

                            <DataGeral descricao={'Data Inicial:'} setData={setdataInicial} vdata={dataInicial}/>
                            <DataGeral descricao={'Data Final:'} setData={setdataFinal} vdata={dataFinal}/>
                            
                            <Select
                                options={options_tipo}
                                label="Tipo"
                                onValueChange={(text) => {
                                    setTipo(text);
                                }}
                                selectedValue={tipo}
                            />

                            <S.BodyOption2>
                                <S.BodyTextLeft>Cliente:</S.BodyTextLeft>
                                <CustomPicker
                                title={cliente.name}
                                onPress={handleOpenClienteModal}
                                />
                            </S.BodyOption2>

                            <TouchableOpacity style={styles.btnFiltrar} onPress={function(){gerarPDF()}}>
                                <FontAwesome size={35} name="print" color={'#FFFFFF'} /><Text style={{fontSize:20, color: '#FFFFFF', width: '90%', textAlign: "center", paddingRight: '10%'}}> Filtrar</Text>
                            </TouchableOpacity>
                        </ScrollView >

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
                    </>
                }
                </>
                :    
                <>   
                    <WebView 
                        originWhitelist={['*']} 
                        source={{ html: html }} 
                    />
                    <TouchableOpacity style={styles.btnDowload} onPress={function(){dowloadPDF()}}>
                        <FontAwesome size={35} name="download" color={'#FFFFFF'} /><Text style={{fontSize:20, color: '#FFFFFF', width: '90%', textAlign: "center", paddingRight: '10%'}}> Baixar</Text>
                    </TouchableOpacity>
                </>  
            }

        </View>
    );
}

const styles = StyleSheet.create({
    btn: {
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
    btnDowload: {
        width: '90%',
        alignContent:'center',
        verticalAlign:'auto',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.colors.success,
        margin: 20,
        borderRadius: 5,
        flexDirection: 'row',
        padding: 10
    },
    btnFiltrar: {
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
    btnFiltrar2: {
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
    menuTop: {
      backgroundColor: Colors.colors.success,
      width: '100%',
      padding: 5,
      height: 90
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
    }
});
  