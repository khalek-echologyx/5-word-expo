import { useState } from "react";
import {
    Button,
    Text,
    TextInput,
    View,
    StyleSheet
} from "react-native";

import { loginUser } from "../api/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({
    onLogin,
    onGoToRegister,
    onForgotPassword,
}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin() {
        setError("");

        if (!username || !password) {
            setError("Please enter username and password.");
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser(
                username,
                password
            );

            await AsyncStorage.setItem(
                "auth_token",
                data.token
            );

            console.log("Login successful.");

            onLogin();

        } catch (error) {
            console.error(
                "Login error:",
                error.message
            );

            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                5 Words Per Day
            </Text>

            <Text style={styles.subtitle}>
                Login to continue learning
            </Text>

            <Text style={styles.label}>
                Username
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <Text style={styles.label}>
                Password
            </Text>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />

                <Button
                    title={showPassword ? "Hide" : "Show"}
                    onPress={() => setShowPassword(!showPassword)}
                />
            </View>

            {error ? (
                <Text style={styles.error}>
                    {error}
                </Text>
            ) : null}

            <View style={styles.button}>
                <Button
                    title={loading ? "Logging in..." : "Login"}
                    onPress={handleLogin}
                    disabled={loading}
                />
            </View>

            <View style={styles.button}>
                <Button
                    title="Forgot password?"
                    onPress={onForgotPassword}
                />
            </View>

            <View style={styles.button}>
                <Button
                    title="Create a new account"
                    onPress={onGoToRegister}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#cccccc",
        borderRadius: 8,
    },

    passwordInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        borderWidth: 0,
    },

    error: {
        color: "red",
        marginTop: 12,
        marginBottom: 4,
    },

    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 12,
    },

    input: {
        borderWidth: 1,
        borderColor: "#cccccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },

    button: {
        marginTop: 16,
    },
});