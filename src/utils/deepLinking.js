import * as Linking from "expo-linking";

export const parseDeepLink = (url) => {
  const parsed = Linking.parse(url);

  return {
    path: parsed.path,
    uid: parsed.queryParams?.uid,
    token: parsed.queryParams?.token,
  };
};

export const setupDeepLinkListener = (callback) => {
  const handleUrl = (event) => {
    callback(event.url);
  };

  const subscription = Linking.addEventListener("url", handleUrl);

  return () => {
    subscription.remove();
  };
};