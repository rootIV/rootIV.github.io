import { useState, useEffect } from "react";
import HeroElement from "./components/hero";
import NavElement from "./components/nav";
import LoginElement from "./pages/login";
import PriceElement from "./pages/price";
import RegisterElement from "./pages/register";
import StatusElement from "./pages/status";
import HeroLayout from "./components/herolayout";
import "./styles/App.scss";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("home");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
    setPage("status");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setPage("home");
  };

  return (
    <>
      <header>
        <NavElement isLoggedIn={isLoggedIn} setPage={setPage} onLoggout={handleLogout}/>
      </header>
      <main>
        <HeroLayout>
          {page === "home" && <HeroElement />}

          {page === "prices" && (
            <PriceElement setPage={setPage} isLogged={isLoggedIn} />
          )}

          {!isLoggedIn && page === "login" && (
            <LoginElement
              setIsLoggedIn={() => handleLogin("meuTokenFake")} // 🔹 use o token real aqui
              setPage={setPage}
            />
          )}

          {!isLoggedIn && page === "register" && (
            <RegisterElement setIsLoggedIn={() => handleLogin("meuTokenFake")} />
          )}

          {isLoggedIn && page === "status" && <StatusElement />}
        </HeroLayout>
      </main>
    </>
  );
}
