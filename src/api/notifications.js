/**
 * Notification API helper.
 * Calls the Django backend to register a push token and manage settings.
 */
import { NOTIFICATIONS_BASE_URL as NOTIFICATIONS_BASE } from "../config/api";

/**
 * POST /api/notifications/token/
 * Registers or updates the Expo push token for the authenticated user.
 *
 * @param {string} authToken  - DRF auth token
 * @param {string} pushToken  - Expo push token string
 * @param {string} timezone   - IANA timezone string (e.g. "Asia/Dhaka")
 */
export async function registerPushTokenWithBackend(
  authToken,
  pushToken,
  timezone
) {
  const response = await fetch(`${NOTIFICATIONS_BASE}/token/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ push_token: pushToken, timezone }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || data.errors || "Failed to register push token."
    );
  }

  return data;
}

/**
 * GET /api/notifications/settings/
 * Returns the user's current notification settings.
 *
 * @param {string} authToken - DRF auth token
 */
export async function getNotificationSettings(authToken) {
  const response = await fetch(`${NOTIFICATIONS_BASE}/settings/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch notification settings."
    );
  }

  return data;
}

/**
 * PUT /api/notifications/settings/
 * Updates the user's notification preferences (partial update).
 *
 * @param {string} authToken - DRF auth token
 * @param {object} settings  - Fields to update: { is_enabled, notification_time, timezone }
 */
export async function updateNotificationSettings(authToken, settings) {
  const response = await fetch(`${NOTIFICATIONS_BASE}/settings/`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || data.errors || "Failed to update notification settings."
    );
  }

  return data;
}
