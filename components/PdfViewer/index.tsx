import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
//import { FileSystem } from 'expo-file-system';
import PDFReader from 'react-native-pdf';

const PdfViewer = ({ uri }) => {
    const [localUri, setLocalUri] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLocalUri(uri);
        setLoading(false);
    }, [uri]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={{ flex: 1 }}>
            { (uri+'').length > 0 ?
            <PDFReader
                source={{ uri: localUri }}
                style={{ flex: 1 }}
            /> : <></>}
        </View>
    );
};

export default PdfViewer;
