import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./src/screens/LoginScreen";
import AppNavigator from "./src/navigation/AppNavigator";
import { getCurrentUser } from "./src/api/auth";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import { setupNotifications } from "./src/utils/notifications";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showRegister, setShowRegister] =
    useState(false);

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [showResetPassword, setShowResetPassword] =
    useState(false);

  const [resetUid, setResetUid] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Ref to the AppNavigator's navigation object so the notification
  // tap listener can navigate to Home without prop-drilling.
  const navigationRef = useRef(null);

  // ------------------------------------------------------------------
  // Session check on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    try {
      const token = await AsyncStorage.getItem(
        "auth_token"
      );

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      await getCurrentUser(token);

      setIsLoggedIn(true);

      // Restore session: register push token in the background.
      setupNotifications(token).catch(() => {});
    } catch (error) {
      console.log(
        "Session check failed:",
        error.message
      );

      await AsyncStorage.removeItem(
        "auth_token"
      );

      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------------------------------------
  // Called after a fresh login — register push token too
  // ------------------------------------------------------------------
  async function handleLogin() {
    setIsLoggedIn(true);

    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        setupNotifications(token).catch(() => {});
      }
    } catch {
      // non-fatal
    }
  }

  // ------------------------------------------------------------------
  // Notification tap handler — navigate to the Home (Today's 5 Words) screen
  // ------------------------------------------------------------------
  useEffect(() => {
    // Foreground notification tap (app was open)
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      () => {
        if (navigationRef.current?.navigate) {
          navigationRef.current.navigate("Home");
        }
      }
    );

    return () => responseSub.remove();
  }, []);

  // ------------------------------------------------------------------
  // Deep-link handler (password reset + notification tap via fivewords://)
  // ------------------------------------------------------------------
  function handleDeepLink(url) {
    if (!url) {
      return;
    }

    console.log("Received deep link:", url);

    const parsedUrl = Linking.parse(url);

    console.log("Parsed deep link:", parsedUrl);

    if (parsedUrl.path === "reset-password") {
      const uid = parsedUrl.queryParams?.uid;
      const token = parsedUrl.queryParams?.token;

      if (uid && token) {
        setResetUid(String(uid));
        setResetToken(String(token));
        setShowResetPassword(true);
      }
    }

    // Notification deep link: fivewords://home
    if (parsedUrl.path === "home" || parsedUrl.hostname === "home") {
      if (navigationRef.current?.navigate) {
        navigationRef.current.navigate("Home");
      }
    }
  }

  // Handle deep link when the app is opened from a link
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      handleDeepLink(url);
    });
  }, []);

  // Handle deep link when the app is already running
  useEffect(() => {
    const subscription = Linking.addEventListener(
      "url",
      ({ url }) => {
        handleDeepLink(url);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  // Reset Password
  if (!isLoggedIn && showResetPassword) {
    return (
      <ResetPasswordScreen
        uid={resetUid}
        token={resetToken}
        onResetSuccess={() => {
          setShowResetPassword(false);
          setResetUid("");
          setResetToken("");
          setShowForgotPassword(false);
          setShowRegister(false);
        }}
        onGoToLogin={() => {
          setShowResetPassword(false);
          setResetUid("");
          setResetToken("");
          setShowForgotPassword(false);
          setShowRegister(false);
        }}
      />
    );
  }

  // Forgot Password
  if (!isLoggedIn && showForgotPassword) {
    return (
      <ForgotPasswordScreen
        onGoToLogin={() =>
          setShowForgotPassword(false)
        }
      />
    );
  }

  // Register
  if (!isLoggedIn && showRegister) {
    return (
      <RegisterScreen
        onRegister={() => {
          setShowRegister(false);
          handleLogin();
        }}
        onGoToLogin={() =>
          setShowRegister(false)
        }
      />
    );
  }

  // Login
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onGoToRegister={() =>
          setShowRegister(true)
        }
        onForgotPassword={() =>
          setShowForgotPassword(true)
        }
      />
    );
  }

  // Logged-in application
  return (
    <AppNavigator
      navigationRef={navigationRef}
      onLogout={() => setIsLoggedIn(false)}
    />
  );
}