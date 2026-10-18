import API_BASE_URL from "../config/api";

export async function getTodayVocabulary(token) {
  const response = await fetch(
    `${API_BASE_URL}/today/`,
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
      data.detail || "Unable to fetch today's vocabulary."
    );
  }

  return data;
}

export async function openTodayVocabulary(token) {
  const response = await fetch(
    `${API_BASE_URL}/today/open/`,
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
      data.detail || "Unable to record vocabulary open."
    );
  }

  return data;
}