import { useContext, useState } from "react";
import { AppContext, Pattern, Yarn } from "../context/AppContext";
import { FAB, List, PaperProvider, Portal, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import YarnView from "./YarnView";

export interface ActiveYarn {
    open: boolean,
    yarn?: Yarn,
    patterns: Pattern[]
}

const Yarns : React.FC = () : React.ReactElement => {
    const {yarns, findMatchingPatterns, setAddYarnView} = useContext(AppContext);
    const [activeYarn, setActiveYarn] = useState<ActiveYarn>({open: false, patterns: []});

    const openYarn = (yarn : Yarn) => {
        setActiveYarn({
            open: true,
            yarn: yarn,
            patterns: findMatchingPatterns(yarn.weight)
        });
    }

    return (
        <PaperProvider>
        <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                   
            <List.Section>
                <List.Subheader style={{fontSize: 26}}>Your yarns</List.Subheader>
                {yarns.map((yarn : Yarn) => {
                    return(
                        <List.Item 
                            key={yarn.id}
                            title={`${yarn.name} (${yarn.brand})`}
                            description={`${yarn.weight}, ${yarn.grams} g`}
                            style={{backgroundColor: "rgb(240, 219, 255)", marginBottom: 1, width:"100%"}}
                            onPress={() => openYarn(yarn)}
                        />
                    )
                })}
            </List.Section>
            <FAB 
                icon="heart-plus"
                label="New yarn"
                onPress={() => setAddYarnView(true)}
            />
    
            <YarnView activeYarn={activeYarn} setActiveYarn={setActiveYarn}/>
        </SafeAreaView>
        </PaperProvider>
        
    )
}

export default Yarns;