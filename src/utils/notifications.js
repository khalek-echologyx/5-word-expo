/**
 * Notification permission + Expo push token setup utility.
 *
 * Call setupNotifications(authToken) once after a successful login or
 * session restore.  It:
 *  1. Requests OS notification permission (gracefully handles denial).
 *  2. Retrieves the Expo push token from Expo's service.
 *  3. Detects the device's IANA timezone.
 *  4. Registers the token with the Django backend.
 *
 * NOTE: Expo push tokens only work on physical devices and in development
 *       builds.  The function is a no-op (returns null silently) on the
 *       Expo Go simulator.
 */
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { registerPushTokenWithBackend } from "../api/notifications";

// Set foreground notification behaviour: show alert + play sound + badge.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Returns the IANA timezone string for the current device.
 * Falls back to "UTC" if unavailable.
 */
export function getDeviceTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Request notification permissions from the OS.
 *
 * Returns true if permissions were granted, false otherwise.
 * Handles the Android 13+ POST_NOTIFICATIONS runtime permission.
 * Never throws — any failure returns false.
 */
export async function requestNotificationPermission() {
  try {
    // Android 13+ only shows the permission prompt once a channel exists.
    // The backend sends to this channel id (see notifications/scheduler.py).
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily-reminder", {
        name: "Daily reminder",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }

    // On Android < 13 permissions are granted automatically.
    if (Platform.OS === "android" && Platform.Version < 33) {
      return true;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus === "granted") {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();

    return status === "granted";
  } catch (error) {
    console.log("[Notifications] Permission request failed:", error.message);
    return false;
  }
}

/**
 * Main entry point — request permission, get token, register with backend.
 *
 * @param {string} authToken - DRF auth token for the authenticated user
 * @returns {string|null} The Expo push token, or null on failure/denial
 */
export async function setupNotifications(authToken) {
  try {
    const granted = await requestNotificationPermission();

    if (!granted) {
      console.log(
        "[Notifications] Permission denied — skipping push token registration."
      );
      return null;
    }

    // getExpoPushTokenAsync requires a physical device or development build.
    // On Expo Go (simulator) this will throw — we catch it gracefully.
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    const pushToken = tokenData.data;

    if (!pushToken) {
      console.log("[Notifications] No push token returned.");
      return null;
    }

    console.log("[Notifications] Push token obtained:", pushToken);

    const timezone = getDeviceTimezone();

    await registerPushTokenWithBackend(authToken, pushToken, timezone);

    console.log(
      "[Notifications] Token registered with backend (tz:",
      timezone,
      ")"
    );

    return pushToken;
  } catch (error) {
    // Non-fatal: notification setup failure must never crash the app.
    console.log(
      "[Notifications] Setup failed (non-fatal):",
      error.message
    );
    return null;
  }
}
