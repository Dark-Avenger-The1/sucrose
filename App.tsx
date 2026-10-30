import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type LinkingOptions,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { EligibilityNoticeModal } from '@/components/results/eligibility-notice-modal';
import { Icon } from '@/components/ui/icon';
import type { Palette } from '@/constant/theme';
import {
  ROUTES,
  type AboutStackParams,
  type CheckStackParams,
  type HistoryStackParams,
  type TabParams,
} from '@/constant/routes';
import { EligibilityNoticeProvider, useEligibilityNotice } from '@/context/eligibility-notice-context';
import { ServicesProvider } from '@/context/services-context';
import { usePalette } from '@/hooks/use-theme';
import { AboutScreen } from '@/screens/about-screen';
import { CheckScreen } from '@/screens/check-screen';
import { HistoryScreen } from '@/screens/history-screen';
import { ResultsScreen } from '@/screens/results-screen';

/** Navigation: three tabs, each with its own stack. Every route in the app is declared in this file. */
const Tabs = createBottomTabNavigator<TabParams>();
const CheckStack = createNativeStackNavigator<CheckStackParams>();
const HistoryStack = createNativeStackNavigator<HistoryStackParams>();
const AboutStack = createNativeStackNavigator<AboutStackParams>();

/** Shared header look for every stack. */
function stackOptions(palette: Palette): NativeStackNavigationOptions {
  return {
    // iOS 26 draws a Liquid Glass header only when no background colour is set; elsewhere paint the ground.
    headerStyle: Platform.OS === 'ios' ? undefined : { backgroundColor: palette.ground },
    headerTintColor: palette.accent,
    headerTitleStyle: { color: palette.ink },
    headerLargeTitleStyle: { color: palette.ink },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: palette.ground },
  };
}

const topLevel = (title: string): NativeStackNavigationOptions => ({ title, headerLargeTitle: true });

function CheckStackScreens() {
  const palette = usePalette();
  return (
    <CheckStack.Navigator screenOptions={stackOptions(palette)}>
      <CheckStack.Screen name={ROUTES.checkHome} component={CheckScreen} options={topLevel('Food check')} />
      <CheckStack.Screen name={ROUTES.checkResults} component={ResultsScreen} options={{ title: 'Suggestions' }} />
    </CheckStack.Navigator>
  );
}

function HistoryStackScreens() {
  const palette = usePalette();
  return (
    <HistoryStack.Navigator screenOptions={stackOptions(palette)}>
      <HistoryStack.Screen name={ROUTES.historyHome} component={HistoryScreen} options={topLevel('History')} />
      <HistoryStack.Screen name={ROUTES.historyResults} component={ResultsScreen} options={{ title: 'Suggestions' }} />
    </HistoryStack.Navigator>
  );
}

function AboutStackScreens() {
  const palette = usePalette();
  return (
    <AboutStack.Navigator screenOptions={stackOptions(palette)}>
      <AboutStack.Screen name={ROUTES.aboutHome} component={AboutScreen} options={topLevel('About')} />
    </AboutStack.Navigator>
  );
}

/** Web URLs and deep links. A link to results gets its tab's home screen as the back destination. */
const linking: LinkingOptions<TabParams> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      [ROUTES.checkTab]: {
        path: '',
        initialRouteName: ROUTES.checkHome,
        screens: { [ROUTES.checkHome]: '', [ROUTES.checkResults]: 'results' },
      },
      [ROUTES.historyTab]: {
        path: 'history',
        initialRouteName: ROUTES.historyHome,
        screens: { [ROUTES.historyHome]: '', [ROUTES.historyResults]: 'results' },
      },
      [ROUTES.aboutTab]: { path: 'about', screens: { [ROUTES.aboutHome]: '' } },
    },
  },
};

/** Shows the eligibility notice above everything else while the provider says it is open. */
function EligibilityNoticeHost() {
  const { visible, hide } = useEligibilityNotice();
  return <EligibilityNoticeModal visible={visible} onClose={hide} />;
}

export default function App() {
  const palette = usePalette();
  const dark = useColorScheme() === 'dark';

  const theme = useMemo<Theme>(
    () => ({
      ...(dark ? DarkTheme : DefaultTheme),
      colors: {
        ...(dark ? DarkTheme : DefaultTheme).colors,
        primary: palette.accent,
        background: palette.ground,
        card: palette.surface,
        text: palette.ink,
        border: palette.border,
      },
    }),
    [dark, palette],
  );

  return (
    <ServicesProvider>
      <EligibilityNoticeProvider>
        <StatusBar style="auto" />
        <NavigationContainer theme={theme} linking={linking}>
          <Tabs.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: palette.accent,
              tabBarInactiveTintColor: palette.inkTertiary,
              tabBarLabelStyle: { color: palette.inkSecondary },
              tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border },
            }}
          >
            <Tabs.Screen
              name={ROUTES.checkTab}
              component={CheckStackScreens}
              options={{ title: 'Check', tabBarIcon: ({ color, size }) => <Icon name="check" size={size} color={color} /> }}
            />
            <Tabs.Screen
              name={ROUTES.historyTab}
              component={HistoryStackScreens}
              options={{ title: 'History', tabBarIcon: ({ color, size }) => <Icon name="history" size={size} color={color} /> }}
            />
            <Tabs.Screen
              name={ROUTES.aboutTab}
              component={AboutStackScreens}
              options={{ title: 'About', tabBarIcon: ({ color, size }) => <Icon name="info" size={size} color={color} /> }}
            />
          </Tabs.Navigator>
        </NavigationContainer>
        <EligibilityNoticeHost />
      </EligibilityNoticeProvider>
    </ServicesProvider>
  );
}
