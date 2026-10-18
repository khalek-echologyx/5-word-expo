import API_BASE_URL from "../config/api";
import { getApiErrorMessage } from "./apiError";


export async function registerUser(
    username,
    email,
    password
) {
    const response = await fetch(
        `${API_BASE_URL}/auth/register/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            getApiErrorMessage(
                data,
                "Registration failed."
            )
        );
    }

    return data;
}

export async function resetPassword(
  uid,
  token,
  newPassword
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/reset-password/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: Number(uid),
        token,
        new_password: newPassword,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(
        data,
        "Password reset failed."
      )
    );
  }

  return data;
}