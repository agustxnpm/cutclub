import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Epilogue_700Bold, Epilogue_900Black, Epilogue_700Bold_Italic, Epilogue_900Black_Italic } from '@expo-google-fonts/epilogue';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import RegistroClienteScreen from './src/screens/RegistroClienteScreen';
import BuscadorClientes from './src/screens/BuscadorClientes';
import PerfilClienteScreen from './src/screens/PerfilClienteScreen';
import AuthClienteScreen from './src/screens/AuthClienteScreen';
import PreAuthScreen from './src/screens/PreAuthScreen';
import TopNavBar from './src/components/TopNavBar';
import BottomNavBar, { TabKey } from './src/components/BottomNavBar';
import { useRouter } from './src/hooks/useRouter';
import { colors } from './src/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Epilogue_700Bold,
    Epilogue_900Black,
    Epilogue_700Bold_Italic,
    Epilogue_900Black_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { screen, navigate } = useRouter();

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#B2C5FF" size="large" />
      </View>
    );
  }

  const activeTab: TabKey =
    screen.name === 'authCliente' || screen.name === 'preAuth' ? 'vip' : 'clients';

  const handleTabPress = (tab: TabKey) => {
    if (tab === 'vip') {
      navigate({ name: 'preAuth' });
    } else if (tab === 'clients') {
      navigate({ name: 'buscar' });
    }
  };

  const renderScreen = () => {
    switch (screen.name) {
      case 'preAuth':
        return (
          <PreAuthScreen
            onRegistro={() => navigate({ name: 'authCliente', mode: 'registro' })}
            onLogin={() => navigate({ name: 'authCliente', mode: 'login' })}
          />
        );
      case 'authCliente':
        return (
          <AuthClienteScreen
            initialMode={screen.mode}
            onAuthSuccess={(id) => navigate({ name: 'perfil', clienteId: id })}
            onSwitchMode={(m) => navigate({ name: 'authCliente', mode: m })}
          />
        );
      case 'registro':
        return (
          <RegistroClienteScreen
            onBack={() => navigate({ name: 'buscar' })}
          />
        );
      case 'perfil':
        return (
          <PerfilClienteScreen
            clienteId={screen.clienteId}
            onBack={() => navigate({ name: 'buscar' })}
          />
        );
      case 'buscar':
      default:
        return (
          <BuscadorClientes
            onSelectCliente={(id) => navigate({ name: 'perfil', clienteId: id })}
            onNuevoCliente={() => navigate({ name: 'registro' })}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <TopNavBar />
        <View style={styles.content}>
          {renderScreen()}
        </View>
        <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
