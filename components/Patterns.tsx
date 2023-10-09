import { useContext, useState } from "react";
import { AppContext, Pattern, Yarn } from "../context/AppContext";
import { FAB, List, PaperProvider, Portal, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import PatternView from "./PatternView";

export interface ActivePattern {
    open: boolean,
    pattern?: Pattern,
    yarns: Yarn[]
}

const Patterns : React.FC = () : React.ReactElement => {
    const {patterns, findMatchingYarns, setAddPatternView} = useContext(AppContext);
    const [activePattern, setActivePattern] = useState<ActivePattern>({open: false, yarns: []});

    const openPattern = (pattern : Pattern) => {
        setActivePattern({
            open: true,
            pattern: pattern,
            yarns: findMatchingYarns(pattern.yarnWeight)
        })
    }

    return (
        <PaperProvider>
            <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>       
                <List.Section style={{width: "100%"}}>
                    <List.Subheader style={{fontSize: 26, textAlign: "center"}}>Your patterns</List.Subheader>
                    <ScrollView>
                    {patterns.map((pattern : Pattern) => {
                        return(
                            <List.Item 
                                key={pattern.id}
                                title={pattern.name}
                                description={`For yarn weight: ${pattern.yarnWeight}`}
                                style={{backgroundColor: "rgb(240, 219, 255)", marginBottom: 1, width:"100%"}}
                                onPress={() => openPattern(pattern)}
                            />
                        )
                    })}
                    </ScrollView>
                </List.Section>
                <FAB 
                    icon="file-plus"
                    label="New pattern"
                    onPress={() => setAddPatternView(true)}
                />
                <PatternView activePattern={activePattern} setActivePattern={setActivePattern}/>
            </SafeAreaView>
        </PaperProvider>
    )
}

export default Patterns;