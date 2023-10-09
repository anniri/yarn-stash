import { Dispatch, useContext, useRef, useState } from "react";
import { AddPic } from "./AddYarn";
import { Button,FAB, SegmentedButtons, Text, TextInput } from "react-native-paper";
import { Image, View } from "react-native";
import { AppContext } from "../context/AppContext";
import {Camera, CameraCapturedPicture} from 'expo-camera'

interface Props {
    setAddPic: Dispatch<React.SetStateAction<AddPic>>
}

const AddPicView : React.FC<Props> = (props : Props) : React.ReactElement => {
    const {handleCameraPermissions, cameraPermission} = useContext(AppContext);
    
    const [mode, setMode] = useState<string>("input"); //mode options: input or camera
    const [picSource, setPicSource] = useState<string>("");
    const [urlInput, setUrlInput] = useState<string>("");
    const cameraRef : any = useRef<Camera>();

    const acceptImg = () : void => {
        props.setAddPic({
            open: false,
            picUrl: picSource,
            picSrcType: (mode === "input") ? "web" : "local"
        })
    }

    const takePicture = async () : Promise<void> => {
        let cameraPic : CameraCapturedPicture = await cameraRef.current.takePictureAsync();
        setPicSource(cameraPic.uri);
    }

    return (
        <View style={{minHeight: 400}}>
        {Boolean(picSource)
        ? <>
            <Image source={{uri: picSource}} style={{width: 300, height: 300}}/>
            <Button onPress={acceptImg}>Add image</Button>
            <Button onPress={() => setPicSource("")}>Cancel image</Button>
        </>
        : <>
        <SegmentedButtons 
                value={mode}
                onValueChange={setMode}
                buttons={[
                    {
                        value: "input",
                        label: "Image from url",
                        icon: "web-box"
                    },
                    {
                        value: "camera",
                        label: "Take a photo",
                        icon: "camera"
                    }
                ]}
            />
            {(mode === "input")
            ? <>
            <TextInput 
                style={{width: "100%", marginVertical: 10}}
                label="Paste image address"
                value={urlInput}
                onChangeText={(text : string) => setUrlInput(text)}
                />
                <Button disabled={urlInput.length < 5} onPress={() => setPicSource(urlInput)}>Get image</Button>
                </>
            : (!cameraPermission)
            ? <>
                <Text>App doesn't have a permission to use the camera.</Text>
                <Button onPress={handleCameraPermissions}>Ask permission</Button>
            </>
            :<>
                <Camera 
                    style={{width: 300, height: 300, marginVertical: 10}} ratio="1:1"
                    ref={cameraRef}
                >
                </Camera>
                <FAB 
                    icon="camera"
                    style={{marginBottom: 15, width: 50, alignSelf: "center"}}
                    onPress={takePicture}
                />
            </>}
            <Button mode="contained-tonal" onPress={() => props.setAddPic({open: false, picUrl: "", picSrcType: ""})}>Cancel adding image</Button></>}
        </View>
    )
}

export default AddPicView;