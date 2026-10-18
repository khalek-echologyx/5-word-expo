import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "../screens/HomeScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen";

const Stack = createNativeStackNavigator();

/**
 * Main app navigator.
 *
 * @param {object}   props.navigationRef  - Ref forwarded from App.js so the
 *                                          notification tap listener can call
 *                                          navigationRef.current.navigate().
 * @param {Function} props.onLogout       - Called when the user logs out.
 */
export default function AppNavigator({ navigationRef, onLogout }) {
    return (
        <NavigationContainer
            ref={navigationRef}
        >
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    options={{
                        title: "5 Words Per Day",
                    }}
                >
                    {(props) => (
                        <HomeScreen
                            {...props}
                            onLogout={onLogout}
                        />
                    )}
                </Stack.Screen>

                <Stack.Screen
                    name="NotificationSettings"
                    options={{
                        title: "Reminder Settings",
                    }}
                    component={NotificationSettingsScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}