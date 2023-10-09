import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {Button, Text} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native'

const Home : React.FC = () : React.ReactElement => {
    const {setAddYarnView, setAddPatternView} = useContext(AppContext);

    return (
        <SafeAreaView style={styles.container}>
            <Text 
                variant='headlineMedium' 
                style={{textAlign: "center", marginBottom: 5}}
            >
                Yarn stash
            </Text>
            <Button mode="contained" onPress={() => setAddYarnView(true)}>Add new yarn</Button>
            <Button mode="contained" onPress={() => setAddPatternView(true)}>Add new pattern</Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 5
    }
})

export default Home;