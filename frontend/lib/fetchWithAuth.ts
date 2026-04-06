export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // 🔥 AUTO LOGOUT ON EXPIRE
  if (res.status === 401) {
    const data = await res.json().catch(() => ({}));

    if (data.code === "TOKEN_EXPIRED") {
      window.dispatchEvent(new Event("session-expired"));
    } else {
      window.dispatchEvent(new Event("unauthorized"));
    }
  }

  return res;
};