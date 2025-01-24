import {View,Text} from 'react-native';
import RootNavigator from '../navigators/RootNavigator';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1}}>
       <RootNavigator />
    </View>
  );
}