import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen'

const Stack = createNativeStackNavigator();
export default RootNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown:false,}}>
            <Stack.Screen name="Welcome" component={MainScreen} />
        </Stack.Navigator>
    );
}