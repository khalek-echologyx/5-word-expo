import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Alert } from "react-native";
import { getApiErrorMessage } from "../api/apiError";

export default function ForgotPasswordScreen({
  onGoToLogin,
}) {
  const [email, setEmail] = useState("");

  function handleSubmit() {
    console.log(
      "Password reset requested for:",
      email
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Forgot Password?
      </Text>

      <Text style={styles.subtitle}>
        Enter your email address and we'll help you
        reset your password.
      </Text>

      <Text style={styles.label}>
        Email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.button}>
        <Button
          title="Send reset link"
          onPress={handleSubmit}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Back to Login"
          onPress={onGoToLogin}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
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