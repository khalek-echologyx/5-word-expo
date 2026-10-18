import { useState } from "react";

import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { resetPassword } from "../api/register";

export default function ResetPasswordScreen({
  uid,
  token,
  onResetSuccess,
  onGoToLogin,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  async function handleResetPassword() {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(
        uid,
        token,
        newPassword
      );

      console.log(
        "Password reset successfully."
      );

      onResetSuccess();

    } catch (error) {
      console.error(
        "Password reset error:",
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
        Reset Password
      </Text>

      <Text style={styles.subtitle}>
        Enter your new password.
      </Text>

      <Text style={styles.label}>
        New password
      </Text>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showPassword}
        />

        <Button
          title={showPassword ? "Hide" : "Show"}
          onPress={() =>
            setShowPassword(!showPassword)
          }
        />
      </View>

      <Text style={styles.label}>
        Confirm password
      </Text>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />

        <Button
          title={
            showConfirmPassword
              ? "Hide"
              : "Show"
          }
          onPress={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
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
          title={
            loading
              ? "Resetting..."
              : "Reset Password"
          }
          onPress={handleResetPassword}
          disabled={loading}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Back to Login"
          onPress={onGoToLogin}
          disabled={loading}
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
    marginTop: 12,
  },

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
  },

  error: {
    color: "red",
    marginTop: 12,
  },

  button: {
    marginTop: 16,
  },
});