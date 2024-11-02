import DateTimePicker, { DateTimePickerEvent }  from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as S from './styles';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';

interface Props {
    setData: (date: string) => void;
    vdata: string;
    descricao: string;
}

export default function dataGeral({ setData, vdata, descricao }: Props) {

    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [dataReg, setDataReg] = useState('');

    const hideDatePicker1 = () => {
        setDatePickerVisibility1(false);
    };

    const showDatePicker1 = () => {
        setDatePickerVisibility1(true);
    };
    
    useEffect(() => {
        const dataPadronizada = moment(vdata, 'YYYY-MM-DD').format('YYYY-MM-DD');
        setDataReg(dataPadronizada);
    }, [vdata]);

    function setarData(dataReg:string){
        moment.utc();
        moment.tz.setDefault('America/Fortaleza');

        const dataPadronizada = moment(dataReg, 'YYYY-MM-DD').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        const novaData = new Date(dataPadronizada);
        return novaData;
    }

    return (
        <>

        {isDatePickerVisible1 ?
            <DateTimePicker 
                mode={'date'}
                value={setarData(dataReg)}
                onChange={(event: DateTimePickerEvent, date: Date) => {
                    hideDatePicker1();
                    setData(moment(date).format('YYYY-MM-DD'));
                    setDataReg(moment(date).format('YYYY-MM-DD'));
                }}
            /> 
        : <></>}

        {Platform.OS === 'ios' ?
            <S.BodyOption>
                <S.BodyTextLeft>{descricao}</S.BodyTextLeft>
                <S.BodyTextRight>
                <S.Calendar>
                    <DateTimePicker 
                        mode={'date'}
                        style={{width: 100, backgroundColor: '#FFFFFF'}}
                        value={setarData(dataReg)}
                        onChange={(event: DateTimePickerEvent, date: Date) => {
                            hideDatePicker1();
                            setData(moment(date).format('YYYY-MM-DD'));
                            setDataReg(moment(date).format('YYYY-MM-DD'));
                        }}
                    />
                    <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                </S.Calendar>
                </S.BodyTextRight>
            </S.BodyOption> 
        :
            <S.BodyOption>
                <S.BodyTextLeft>{descricao}</S.BodyTextLeft>
                <S.BodyTextRight>
                <S.Calendar onPress={showDatePicker1}>
                    <S.CalendarText>
                    {moment(dataReg).format('DD/MM/YYYY')}
                    </S.CalendarText>
                    <FontAwesome size={25} style={{ marginBottom: -3 }} name="calendar" color={'#000000'} />
                </S.Calendar>
                </S.BodyTextRight>
            </S.BodyOption>
        }

        </>
    );
}
