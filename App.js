import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { initDB } from './src/db/database';

import HikeListScreen from './src/screens/HikeScreen/HikeListScreen';
import HikeFormScreen from './src/screens/HikeScreen/HikeFormScreen';
import HikeDetailScreen from './src/screens/HikeScreen/HikeDetailScreen';
import ObservationFormScreen from './src/screens/ObservationScreen/ObservationFormScreen';
import SearchScreen from './src/screens/SearchScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import ObservationDetailScreen from "./src/screens/ObservationScreen/ObservationDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    (async () => { await initDB(); })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HikeList"
          component={HikeListScreen}
          options={{ title: "M-Hike" }}
        />
        <Stack.Screen name="HikeForm" component={HikeFormScreen} />
        <Stack.Screen name="HikeDetail" component={HikeDetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="ObservationForm" component={ObservationFormScreen} />
        <Stack.Screen name="ObservationDetail" component={ObservationDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
