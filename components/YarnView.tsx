import { Dispatch } from "react";
import { ActiveYarn } from "./Yarns";
import { List, Modal, Portal, Text } from "react-native-paper";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { Pattern } from "../context/AppContext";

interface Props {
    activeYarn : ActiveYarn
    setActiveYarn: Dispatch<React.SetStateAction<ActiveYarn>>
}

const YarnView : React.FC<Props> = (props : Props) : React.ReactElement => {
    const closeYarn = () : void => {
        props.setActiveYarn({open: false, patterns: []});
    }

    return (
            <Portal>
                {Boolean(props.activeYarn.yarn)
                ? <Modal visible={props.activeYarn.open} onDismiss={closeYarn} contentContainerStyle={styles.modalView}>
                    <ScrollView>
                        <Text variant="titleSmall">{props.activeYarn.yarn!.brand}</Text>
                        <Text variant="titleLarge">{props.activeYarn.yarn!.name}</Text>
                        {Boolean(props.activeYarn.yarn!.picUrl)
                        ? <Image style={{width: 200, height: 200}} source={{uri: props.activeYarn.yarn!.picUrl}}/>
                        : null}
                        <Text variant="labelLarge">
                            Fibre: 
                            <Text variant="bodyLarge">{props.activeYarn.yarn!.fibre}</Text>
                        </Text>
                        <Text variant="labelLarge">
                            Weight: 
                            <Text variant="bodyLarge">{props.activeYarn.yarn!.weight}</Text>
                        </Text>
                        <Text variant="labelLarge">
                            Amount: 
                            <Text variant="bodyLarge">{props.activeYarn.yarn!.grams} g</Text>
                        </Text>
                        <Text variant="titleLarge" style={{marginTop: 10}}>Lankaan sopivat ohjeet:</Text>
                        {(props.activeYarn.patterns.length > 0)
                        ? <List.Section>
                            {props.activeYarn.patterns.map((pattern : Pattern) => {
                                return (
                                    <List.Item 
                                        titleNumberOfLines={5}
                                        descriptionNumberOfLines={5}
                                        key={pattern.id}
                                        title={pattern.name}
                                        description={pattern.source}
                                        left={() => <Image source={{uri: pattern.picUrl}} style={{width: 100, height: 100}} />}
                                    />
                                )
                            })}
                        </List.Section>
                        : <Text>Ei sopivia ohjeita</Text>}
                    </ScrollView>
                </Modal>
                : null}
            </Portal>
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
        height: 400
    }
});

export default YarnView;