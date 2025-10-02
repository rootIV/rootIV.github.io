import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import TextTyper from "../components/textTyper";
import "../styles/login.scss";

interface LoginProps {
  setPage: (value: string) => void;
}

export default function LoginElement({ setPage }: LoginProps) {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = await fetch("https://api.beetomation.shop/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Username: emailInput, Password: password }),
      }).then(async (res) => {
        console.log("HTTP login status:", res.status);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        console.log("Token recebido:", data.token);
        if (!data.token) throw new Error("Token não retornado");
        return data.token;
      });

      login(token);

      setPage("status");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    }
  }

  return (
    <div className="form-login">
      <TextTyper text="Login" speed={150} />
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="E-mail"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
