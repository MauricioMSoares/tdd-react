import i18n from "../locale/i18n";

export const signup = (body) => {
  return fetch("/api/1.0/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": i18n.language,
    },
    body: JSON.stringify(body),
  });
};