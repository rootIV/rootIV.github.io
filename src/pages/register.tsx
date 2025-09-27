import { useState } from "react";
import { register } from "../services/AuthService";
import RegisterConfirmElement from "../pages/registerConfirm";
import TextTyper from "../components/textTyper";
import "../styles/register.scss";

interface RegisterProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function RegisterElement({ setIsLoggedIn }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, SetError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(username, password);
      setIsRegistered(true);
      setIsLoggedIn(false);
    } catch (err: any) {
      SetError("Falha ao conectar");
    }
  }

  if (isRegistered) {
    return <RegisterConfirmElement />;
  }

  return (
    <div className="form-register">
      <TextTyper text="Registrar" speed={150} />
      <form onSubmit={handleRegister}>
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
        <button type="submit">Registrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
