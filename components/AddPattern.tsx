import { useContext, useState } from "react";
import { AppContext, Pattern } from "../context/AppContext";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Modal, Text, TextInput, RadioButton, SegmentedButtons } from "react-native-paper";
import { AddPic } from "./AddYarn";
import AddPicView from "./AddPicView";
import uuid from "react-native-uuid";

const AddPattern : React.FC = () : React.ReactElement => {
    const {addPatternToDB, addPatternView, setAddPatternView, yarnWeights, patternTypes, saveImage} = useContext(AppContext);
    const [patternInput, setPatternInput] = useState<Pattern>({
        id: 0,
        name: "",
        source: "",
        sourceType: patternTypes[0],
        yarnWeight: yarnWeights[0],
        yarnDemand: 0,
        picUrl: ""
    });

    const [addPic, setAddPic] = useState<AddPic>({
        open: false,
        picUrl: "",
        picSrcType: ""
    })

    const savePattern = async () : Promise<void> => {
        let picUrl : string = "";

        if(Boolean(addPic.picUrl) && Boolean(addPic.picSrcType)) {
            picUrl = await saveImage(addPic.picSrcType, addPic.picUrl, "patternImgs", uuid.v4());
        }

        addPatternToDB({...patternInput, picUrl: picUrl});
        closeAddPattern();
    }

    const closeAddPattern = () : void => {
        setPatternInput({
            id: 0,
            name: "",
            source: "",
            sourceType: patternTypes[0],
            yarnWeight: yarnWeights[0],
            yarnDemand: 0,
            picUrl: ""
        });

        setAddPic({
            open: false,
            picUrl: "",
            picSrcType: ""
        })

        setAddPatternView(false);
    }

    return (
        <Modal visible={addPatternView} contentContainerStyle={styles.modalView} onDismiss={() => setAddPatternView(false)}>
            {(addPic.open)
            ? <AddPicView setAddPic={setAddPic} />
            : <>
            <Text variant="titleMedium">Add new pattern that you want to do</Text>
            <TextInput 
                label="Pattern name"
                mode="outlined"
                value={patternInput.name}
                onChangeText={(text) => setPatternInput({...patternInput, name: text})}
                style={{width: "100%"}}
            />
            <TextInput 
                label="Pattern source"
                mode="outlined"
                value={patternInput.source}
                onChangeText={(text) => setPatternInput({...patternInput, source: text})}
                style={{width: "100%"}}
            />
            <Text variant="labelMedium" style={{marginTop: 5}}>What is the type of pattern's source?</Text>
            <SegmentedButtons 
                value={patternInput.sourceType}
                onValueChange={(value) => setPatternInput({...patternInput, sourceType: value})}
                buttons={patternTypes.map((type : string) => {return {value: type, label: type}} )}
                style={{marginBottom: 8}}
            />
            <TextInput
                label="Yarn demand (in grams)"
                mode="outlined"
                inputMode="numeric"
                value={String(patternInput.yarnDemand)}
                onChangeText={(text) => setPatternInput({...patternInput, yarnDemand: Number(text)})}
                style={{width: "100%"}}
            />
             <Text variant="titleSmall">Choose yarn weight:</Text>
            <ScrollView style={{width: "100%"}}>
            <RadioButton.Group 
                onValueChange={value => setPatternInput({...patternInput, yarnWeight: value})}
                value={patternInput.yarnWeight}
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
            ? <Text variant="labelMedium">Image added to pattern!</Text>
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
                <Button mode="contained" onPress={savePattern}>Add pattern</Button>
                <Button mode="contained-tonal" onPress={closeAddPattern}>Cancel</Button>
            </View>
            </>
            }
            
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

export default AddPattern;
