import { useState } from "react";
import { login } from "../services/AuthService";
import TextTyper from "../components/textTyper";
import "../styles/login.scss";

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function LoginElement({ setIsLoggedIn }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, SetError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = await login(username, password);
      alert("Login bem-sucedido! Usuário: " + data.username);
      setIsLoggedIn(true);
    } catch (err: any) {
      SetError("Falha ao conectar");
    }
  }

  return (
    <div className="form-login">
      <TextTyper text="Login" speed={150} />
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
