import { Button, Modal, RadioButton, Text, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import { AppContext, Yarn } from "../context/AppContext";
import { ScrollView, StyleSheet } from "react-native";
import { View } from "react-native";
import uuid from 'react-native-uuid';
import AddPicView from "./AddPicView";

export interface AddPic {
    open: boolean
    picUrl: string,
    picSrcType: string
}

const AddYarn : React.FC = () : React.ReactElement => {
    const {yarnWeights, addYarnToDB, addYarnView, setAddYarnView, saveImage} = useContext(AppContext)
    const [yarnInput, setYarnInput] = useState<Yarn>({
        id: 0,
        name: "",
        brand: "",
        fibre: "",
        weight: yarnWeights[0],
        grams: 0,
        picUrl: ""
    })

    const [addPic, setAddPic] = useState<AddPic>({
        open: false,
        picUrl: "",
        picSrcType: ""
        })

    const saveYarn = async () : Promise<void> => {
        let picUrl : string = ""

        if(Boolean(addPic.picUrl) && Boolean(addPic.picSrcType)) {
            picUrl = await saveImage(addPic.picSrcType, addPic.picUrl, "yarnImgs", uuid.v4());
        }
        addYarnToDB({...yarnInput, picUrl: picUrl});
        closeAddYarn();
    }

    const closeAddYarn = () : void => {
        setYarnInput({
            id: 0,
            name: "",
            brand: "",
            fibre: "",
            weight: yarnWeights[0],
            grams: 0,
            picUrl: ""
        });
        setAddPic({
            open: false,
            picUrl: "",
            picSrcType: ""
        });
        setAddYarnView(false);
    }

    return (
        <Modal visible={addYarnView} contentContainerStyle={styles.modalView} onDismiss={() => setAddYarnView(false)}>
           {(addPic.open) 
            ? <AddPicView setAddPic={setAddPic}/>
            :<>
            <Text variant="titleMedium">Add new yarn to your stash</Text>
            <TextInput
                label="Yarn name" 
                mode="outlined"
                value={yarnInput.name}
                onChangeText={(text) => setYarnInput({...yarnInput, name: text})}
                style={{width: "100%"}}
            />
            <TextInput
                label="Brand" 
                mode="outlined"
                value={yarnInput.brand}
                onChangeText={(text) => setYarnInput({...yarnInput, brand: text})}
                style={{width: "100%"}}
            />
            <TextInput
                label="Fibre" 
                mode="outlined"
                value={yarnInput.fibre}
                onChangeText={(text) => setYarnInput({...yarnInput, fibre: text})}
                style={{width: "100%"}}
            />
            <TextInput
                label="Amount in grams" 
                mode="outlined"
                inputMode="numeric"
                value={String(yarnInput.grams)}
                onChangeText={(text) => setYarnInput({...yarnInput, grams: Number(text)})}
                style={{width: "100%"}}
            />
            <Text variant="titleSmall">Choose yarn weight:</Text>
            <ScrollView style={{width: "100%"}}>
            <RadioButton.Group 
                onValueChange={value => setYarnInput({...yarnInput, weight: value})}
                value={yarnInput.weight}
            >
                {yarnWeights.map((weight : string) => {
                    return(
                        <RadioButton.Item 
                            value={weight}
                            label={weight}
                            key={weight}
                        />
                    )
                })}
            </RadioButton.Group>
            </ScrollView>
            {Boolean(addPic.picUrl)
            ? <Text variant="labelMedium">Image added to yarn!</Text>
            : <Button 
                    mode="elevated" 
                    icon="camera" 
                    style={styles.fullButton}
                    onPress={() => setAddPic({...addPic, open: true})}
                >
                Add picture
                </Button>
            }

            <View style={{flexDirection: "row"}}>
                <Button mode="contained" onPress={saveYarn}>Add yarn</Button>
                <Button mode="contained-tonal" onPress={closeAddYarn}>Cancel</Button>
            </View>
            </>}
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalView : {
        alignSelf: "center", 
        backgroundColor: "white", 
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        padding: 10,
        marginVertical: 100
    },
    fullButton: {
        width: "100%",
        marginVertical: 5
    }
});

export default AddYarn;