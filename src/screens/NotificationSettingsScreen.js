/**
 * NotificationSettingsScreen
 *
 * Lets the user toggle daily reminders on/off and change the preferred
 * reminder time (defaults to 08:00).  Changes are saved to the Django
 * backend via PUT /api/notifications/settings/.
 */
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    getNotificationSettings,
    updateNotificationSettings,
} from "../api/notifications";

// Simple time-picker rendered as two numeric buttons (hour / minute).
// A full DateTimePicker library would need extra native setup, so we use
// an inline custom picker that works in Expo Go for preview.
function TimePicker({ value, onChange }) {
    const [hour, minute] = value.split(":").map(Number);

    function adjustHour(delta) {
        const newHour = ((hour + delta + 24) % 24)
            .toString()
            .padStart(2, "0");
        onChange(`${newHour}:${minute.toString().padStart(2, "0")}`);
    }

    function adjustMinute(delta) {
        const newMinute = ((minute + delta + 60) % 60)
            .toString()
            .padStart(2, "0");
        onChange(`${hour.toString().padStart(2, "0")}:${newMinute}`);
    }

    return (
        <View style={timeStyles.container}>
            <View style={timeStyles.unit}>
                <TouchableOpacity
                    style={timeStyles.btn}
                    onPress={() => adjustHour(1)}
                    accessibilityLabel="Increase hour"
                >
                    <Text style={timeStyles.btnText}>▲</Text>
                </TouchableOpacity>
                <Text style={timeStyles.value}>
                    {hour.toString().padStart(2, "0")}
                </Text>
                <TouchableOpacity
                    style={timeStyles.btn}
                    onPress={() => adjustHour(-1)}
                    accessibilityLabel="Decrease hour"
                >
                    <Text style={timeStyles.btnText}>▼</Text>
                </TouchableOpacity>
            </View>

            <Text style={timeStyles.colon}>:</Text>

            <View style={timeStyles.unit}>
                <TouchableOpacity
                    style={timeStyles.btn}
                    onPress={() => adjustMinute(5)}
                    accessibilityLabel="Increase minute"
                >
                    <Text style={timeStyles.btnText}>▲</Text>
                </TouchableOpacity>
                <Text style={timeStyles.value}>
                    {minute.toString().padStart(2, "0")}
                </Text>
                <TouchableOpacity
                    style={timeStyles.btn}
                    onPress={() => adjustMinute(-5)}
                    accessibilityLabel="Decrease minute"
                >
                    <Text style={timeStyles.btnText}>▼</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const timeStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
    },
    unit: {
        alignItems: "center",
        width: 60,
    },
    btn: {
        padding: 10,
    },
    btnText: {
        fontSize: 20,
        color: "#4A90E2",
    },
    value: {
        fontSize: 36,
        fontWeight: "700",
        color: "#1a1a2e",
        minWidth: 52,
        textAlign: "center",
    },
    colon: {
        fontSize: 36,
        fontWeight: "700",
        color: "#1a1a2e",
        marginBottom: 4,
        paddingHorizontal: 4,
    },
});

// ---------------------------------------------------------------------------

export default function NotificationSettingsScreen() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [isEnabled, setIsEnabled] = useState(true);
    const [notificationTime, setNotificationTime] = useState("08:00");
    const [timezone, setTimezone] = useState("UTC");

    // ------------------------------------
    // Load current settings from backend
    // ------------------------------------
    const loadSettings = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem("auth_token");
            if (!token) return;

            const data = await getNotificationSettings(token);

            setIsEnabled(data.is_enabled);
            // Backend sends "HH:MM:SS" — we only need "HH:MM"
            setNotificationTime(
                data.notification_time
                    ? data.notification_time.slice(0, 5)
                    : "08:00"
            );
            setTimezone(data.timezone || "UTC");
        } catch (error) {
            console.log("Failed to load notification settings:", error.message);
            Alert.alert(
                "Error",
                "Could not load your notification settings. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    // ------------------------------------
    // Save settings to backend
    // ------------------------------------
    async function handleSave() {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem("auth_token");
            if (!token) return;

            await updateNotificationSettings(token, {
                is_enabled: isEnabled,
                notification_time: notificationTime,
                timezone,
            });

            Alert.alert(
                "Saved",
                isEnabled
                    ? `Daily reminder set for ${notificationTime}.`
                    : "Daily reminders disabled."
            );
        } catch (error) {
            Alert.alert(
                "Error",
                error.message || "Could not save settings. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {/* Toggle */}
            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.rowText}>
                        <Text style={styles.label}>Daily Reminders</Text>
                        <Text style={styles.sublabel}>
                            Get a push notification when your new words are
                            ready.
                        </Text>
                    </View>
                    <Switch
                        trackColor={{
                            false: "#d0d0d0",
                            true: "#4A90E2",
                        }}
                        thumbColor={
                            Platform.OS === "android" ? "#fff" : undefined
                        }
                        value={isEnabled}
                        onValueChange={setIsEnabled}
                        accessibilityLabel="Toggle daily reminders"
                    />
                </View>
            </View>

            {/* Time picker — only shown when reminders are enabled */}
            {isEnabled && (
                <View style={styles.card}>
                    <Text style={styles.label}>Reminder Time</Text>
                    <Text style={styles.sublabel}>
                        Notifications will be sent at this time in your local
                        timezone ({timezone}).
                    </Text>

                    <TimePicker
                        value={notificationTime}
                        onChange={setNotificationTime}
                    />
                </View>
            )}

            {/* Save button */}
            <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
                accessibilityLabel="Save notification settings"
            >
                {saving ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveBtnText}>Save Settings</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f7fa",
    },
    content: {
        padding: 20,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rowText: {
        flex: 1,
        marginRight: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a2e",
        marginBottom: 4,
    },
    sublabel: {
        fontSize: 13,
        color: "#666",
        lineHeight: 18,
    },
    saveBtn: {
        backgroundColor: "#4A90E2",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
