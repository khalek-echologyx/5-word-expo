import { useState } from "react";

import {
    Alert,
    Button,
    Text,
    TextInput,
    View,
    StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { registerUser } from "../api/register";

export default function RegisterScreen({ onRegister, onGoToLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");

    async function handleRegister() {
        setError("");

        if (
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const data = await registerUser(
                username,
                email,
                password
            );

            await AsyncStorage.setItem(
                "auth_token",
                data.token
            );

            console.log("Registration successful.");

            onRegister();

        } catch (error) {
            console.error(
                "Registration error:",
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
                Create an account
            </Text>

            <Text style={styles.label}>
                Username
            </Text>

            <TextInput
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={styles.input}
            />

            <Text style={styles.label}>
                Email
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>

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

            <Text style={styles.label}>Confirm password</Text>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                />

                <Button
                    title={showConfirmPassword ? "Hide" : "Show"}
                    onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                    }
                />
            </View>

            {error ? (
                <Text style={styles.error}>
                    {error}
                </Text>
            ) : null}

            <View style={styles.button}>
                <Button
                    title="Register"
                    onPress={handleRegister}
                    disabled={loading}
                />
            </View>

            <View style={styles.button}>
                <Button
                    title="Already have an account? Login"
                    onPress={onGoToLogin}
                    disabled={loading}
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