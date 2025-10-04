import { useState } from "react";
import { register } from "../services/AuthService";
import RegisterConfirmElement from "./registerConfirm";
import TextTyper from "../components/textTyper";
import "../styles/register.scss";

export default function RegisterElement() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateInputs(): string | null {
    if (!emailRegex.test(username)) {
      return "E-mail inválido.";
    }
    if (username.length < 6 || username.length > 50) {
      return "O e-mail deve ter entre 6 e 50 caracteres.";
    }

    if (password.length < 8 || password.length > 32) {
      return "A senha deve ter entre 8 e 32 caracteres.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,32}$/;

    if (!passwordRegex.test(password)) {
      return "A senha deve conter maiúscula, minúscula, número e caractere especial.";
    }

    return null;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await register(username, password);
      setIsRegistered(true);
    } catch (err: any) {
      setError("Falha ao conectar.");
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
          placeholder="E-mail"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
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
