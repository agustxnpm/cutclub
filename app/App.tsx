import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
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
import { RolProvider, useRol } from './src/context/RolContext';

function DebugRolBubble() {
  const { rol, setRol } = useRol();
  const isBarbero = rol === 'barbero';
  return (
    <TouchableOpacity
      style={[styles.debugBubble, isBarbero ? styles.debugBubbleBarbero : styles.debugBubbleCliente]}
      onPress={() => setRol(isBarbero ? 'cliente' : 'barbero')}
      activeOpacity={0.8}
    >
      <Text style={styles.debugBubbleText}>
        {isBarbero ? '✂ BARBERO' : '👤 CLIENTE'}
      </Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <RolProvider>
      <AppContent />
    </RolProvider>
  );
}

function AppContent() {
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
        <DebugRolBubble />
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
  debugBubble: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  debugBubbleBarbero: {
    backgroundColor: colors.primaryContainer,
  },
  debugBubbleCliente: {
    backgroundColor: colors.secondaryContainer,
  },
  debugBubbleText: {
    color: colors.onSurface,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
