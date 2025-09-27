const API_URL = "https://localhost:7240/user";

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  
  const data = await response.json();
  if (!data.token) {
    throw new Error("Erro Interno: Token não retornado");
  }

  return data.token;
}

export async function register(username: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
