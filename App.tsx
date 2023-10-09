import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Text, View } from 'react-native';
import { AppProvider } from './context/AppContext';
import { BottomNavigation, PaperProvider, Portal } from 'react-native-paper';
import { useState } from 'react';
import Home from './components/Home';
import Yarns from './components/Yarns';
import AddYarn from './components/AddYarn';
import Patterns from './components/Patterns';
import AddPattern from './components/AddPattern';

const HomeRoute = () => <Home />;
const YarnsRoute = () => <Yarns />;
const PatternsRoute = () => <Patterns />;

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline"},
    { key: "yarns", title: "Yarns", focusedIcon: "heart", unfocusedIcon: "heart-outline"},
    { key: "patterns", title: "Patterns", focusedIcon: "file-document", unfocusedIcon: "file-document-outline"}
  ])

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    yarns: YarnsRoute,
    patterns: PatternsRoute
  })


  return (
    
    <AppProvider>
      <SafeAreaProvider>
        <PaperProvider>
        <Portal>
          <AddYarn />
          <AddPattern />
        </Portal>
        <BottomNavigation 
          navigationState={{index, routes}}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
        </PaperProvider>
      </SafeAreaProvider>
    </AppProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
