import { Dispatch } from "react";
import { List, Modal, Portal, Text } from "react-native-paper";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { Yarn } from "../context/AppContext";
import { ActivePattern } from "./Patterns";

interface Props {
    activePattern : ActivePattern
    setActivePattern: Dispatch<React.SetStateAction<ActivePattern>>
}

const PatternView : React.FC<Props> = (props : Props) : React.ReactElement => {
    const closeYarn = () : void => {
        props.setActivePattern({open: false, yarns: []});
    }

    return (
            <Portal>
                {Boolean(props.activePattern.pattern)
                ? <Modal visible={props.activePattern.open} onDismiss={closeYarn} contentContainerStyle={styles.modalView}>
                    <ScrollView style={{width: "100%"}}>
                        <Text variant="titleLarge">{props.activePattern.pattern!.name}</Text>
                        {Boolean (props.activePattern.pattern!.picUrl)
                        ? <Image source={{uri: props.activePattern.pattern!.picUrl}} style={{width: 200, height: 200}} />
                        : null}
                        <Text variant="labelLarge">
                            Yarn weight: 
                            <Text variant="bodyLarge">{props.activePattern.pattern!.yarnWeight}</Text>
                        </Text>
                        <Text variant="labelLarge">
                            Yarn demand: 
                            <Text variant="bodyLarge">{props.activePattern.pattern!.yarnDemand}</Text>
                        </Text>
                        {(props.activePattern.pattern!.sourceType === "web")
                        ? <Text>{props.activePattern.pattern!.source}</Text>
                        : (props.activePattern.pattern!.sourceType === "book")
                          ? <Text>Pattern from book {props.activePattern.pattern!.source}</Text>
                          : (props.activePattern.pattern!.sourceType === "magazine")
                            ? <Text>Pattern from magazine {props.activePattern.pattern!.source}</Text>
                            : <Text>Pattern is a pdf file: {props.activePattern.pattern!.source}</Text>
                        }
                        <Text variant="titleLarge" style={{marginTop: 10}}>Yarns matching this pattern:</Text>
                        {(props.activePattern.yarns.length > 0)
                        ? <List.Section style={{width: "100%"}}>
                            {props.activePattern.yarns.map((yarn : Yarn) => {
                                return(
                                    <List.Item 
                                        titleNumberOfLines={5}
                                        descriptionNumberOfLines={2}
                                        style={{width: "100%"}}
                                        key={yarn.id}
                                        title={`${yarn.name} (${yarn.brand})`}
                                        description={`${yarn.grams} g of yarn left`}
                                        left={() => <Image 
                                                        source={{uri: yarn.picUrl}} 
                                                        style={{width: 100, height: 100}}
                                                    />}
                                    />
                                )
                            })}
                        </List.Section>
                        : <Text>Ei sopivia lankoja</Text>}
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

export default PatternView;