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
import { useEffect, useState } from 'react';
import { useSession } from './src/hooks/useSession';
import { bootAuth } from './src/services/auth/authStore';
import { setOnUnauthorized } from './src/services/http/api';

export default function App() {
  return <AppContent />;
}

function AppContent() {
  // ─── Todos los hooks deben declararse antes de cualquier early return ───
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
  const session = useSession();
  const isBarbero = session?.roles.includes('BARBERO') ?? false;
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    bootAuth().then(() => setAuthReady(true));
    setOnUnauthorized(() => navigate({ name: 'preAuth' }));
    return () => setOnUnauthorized(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si un CLIENTE autenticado termina en la pantalla de directorio, redirigir a su perfil.
  useEffect(() => {
    if (screen.name === 'buscar' && session && !isBarbero) {
      navigate({ name: 'perfil', clienteId: session.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.name, session?.id, isBarbero]);

  if (!fontsLoaded || !authReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#B2C5FF" size="large" />
      </View>
    );
  }

  const isAuthScreen = screen.name === 'authCliente' || screen.name === 'preAuth';

  const activeTab: TabKey = isAuthScreen ? 'cuenta' : 'clients';

  const cuentaVariant = session ? 'logout' : 'login';

  const handleTabPress = (tab: TabKey) => {
    if (tab === 'cuenta') {
      if (session) {
        // Logout: limpiar sesión y volver al buscador
        import('./src/services/auth/authApi').then(({ logout }) => {
          logout().then(() => navigate({ name: 'preAuth' }));
        });
      } else {
        navigate({ name: 'preAuth' });
      }
    } else if (tab === 'clients') {
      if (!session) {
        navigate({ name: 'preAuth' });
        return;
      }
      if (isBarbero) {
        navigate({ name: 'buscar' });
      } else {
        navigate({ name: 'perfil', clienteId: session.id });
      }
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
            onAuthSuccess={(authSession) => {
              if (authSession.roles.includes('BARBERO')) {
                navigate({ name: 'buscar' });
              } else {
                navigate({ name: 'perfil', clienteId: authSession.id });
              }
            }}
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
            onBack={isBarbero ? () => navigate({ name: 'buscar' }) : undefined}
            onLogout={!isBarbero ? () => {
              import('./src/services/auth/authApi').then(({ logout }) => {
                logout().then(() => navigate({ name: 'preAuth' }));
              });
            } : undefined}
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
        {!isAuthScreen && isBarbero && (
          <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} cuentaVariant={cuentaVariant} showClientsTab={isBarbero} />
        )}
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
