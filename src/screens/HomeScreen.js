import { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import VocabularyCard from "../components/VocabularyCard";
import { logoutUser } from "../api/auth";

import {
    getTodayVocabulary,
    openTodayVocabulary,
} from "../api/client";

export default function HomeScreen({ onLogout, navigation: navProp }) {
    const navigation = navProp || useNavigation();
    const [vocabulary, setVocabulary] = useState(null);
    const [loading, setLoading] = useState(true);

    // Add a bell icon to the navigation header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("NotificationSettings")
                    }
                    style={{ marginRight: 4, padding: 6 }}
                    accessibilityLabel="Notification settings"
                >
                    <Text style={{ fontSize: 20 }}>🔔</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        loadVocabulary();
    }, []);

    async function handleLogout() {
        try {
            const token = await AsyncStorage.getItem(
                "auth_token"
            );

            if (token) {
                await logoutUser(token);
            }
        } catch (error) {
            console.log(
                "Logout API error:",
                error.message
            );
        } finally {
            await AsyncStorage.removeItem(
                "auth_token"
            );

            onLogout();
        }
    }

    async function loadVocabulary() {
        try {
            const token = await AsyncStorage.getItem(
                "auth_token"
            );

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const data = await getTodayVocabulary(token);

            setVocabulary(data);

            console.log(
                "Today's vocabulary:",
                data
            );

            const openData = await openTodayVocabulary(token);

            console.log(
                "Vocabulary open:",
                openData
            );

        } catch (error) {
            console.error(
                "Vocabulary error:",
                error.message
            );

        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View>
                <ActivityIndicator />
                <Text>Loading today's words...</Text>
            </View>
        );
    }

    if (!vocabulary) {
        return (
            <View>
                <Text>
                    Unable to load today's vocabulary.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
            >
                <Text style={styles.title}>
                    5 Words Per Day
                </Text>

                <Text style={styles.date}>
                    {vocabulary.date}
                </Text>

                <Text style={styles.subtitle}>
                    Learn five new words today
                </Text>

                {vocabulary.words.map((word) => (
                    <VocabularyCard
                        key={word.id}
                        word={word}
                    />
                ))}

                <Button
                    title="Logout"
                    onPress={handleLogout}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },

    content: {
        padding: 20,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 20,
    },

    date: {
        fontSize: 14,
        marginTop: 6,
    },

    subtitle: {
        fontSize: 16,
        marginTop: 8,
        marginBottom: 20,
    },
});