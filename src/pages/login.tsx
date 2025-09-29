import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/AuthService";
import TextTyper from "../components/textTyper";
import "../styles/login.scss";

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
  setPage: (value: string) => void;
  setUserEmail: (email: string) => void;
}

export default function LoginElement({ setIsLoggedIn, setPage, setUserEmail }: LoginProps) {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, SetError] = useState("");
  const { setToken } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = await login(email, password);
      setToken(token);
      setUserEmail(email);
      setIsLoggedIn(true);
      setPage("status");
      localStorage.setItem("authToken", token);
    } catch (err: any) {
      SetError(`${err}`);
    }
  }

  return (
    <div className="form-login">
      <TextTyper text="Login" speed={150} />
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="E-mail"
          value={email}
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
