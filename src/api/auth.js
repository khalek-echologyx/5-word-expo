import API_BASE_URL from "../config/api";
import { getApiErrorMessage } from "./apiError";

export async function loginUser(username, password) {
    const response = await fetch(
        `${API_BASE_URL}/login/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            getApiErrorMessage(
                data,
                "Login failed."
            )
        );
    }

    return data;
}

export async function getCurrentUser(token) {
    const response = await fetch(
        `${API_BASE_URL}/auth/me/`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            getApiErrorMessage(
                data,
                "Unable to verify user."
            )
        );
    }

    return data;
}

export async function logoutUser(token) {
    const response = await fetch(
        `${API_BASE_URL}/auth/logout/`,
        {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            getApiErrorMessage(
                data,
                "Logout failed."
            )
        );
    }

    return data;
}