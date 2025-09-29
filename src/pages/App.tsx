import { useState, useEffect } from "react";
import HeroElement from "../components/hero";
import NavElement from "../components/nav";
import LoginElement from "./login";
import PriceElement from "./price";
import RegisterElement from "./register";
import StatusElement from "./status";
import HeroLayout from "../components/herolayout";
import "../styles/App.scss";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("home");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setPage("home");
  };

  return (
    <>
      <header>
        <NavElement isLoggedIn={isLoggedIn} setPage={setPage} onLogout={handleLogout}/>
      </header>
      <main>
        <HeroLayout>
          {page === "home" && <HeroElement />}

          {page === "prices" && (
            <PriceElement setPage={setPage} isLogged={isLoggedIn} />
          )}

          {!isLoggedIn && page === "login" && (
            <LoginElement setIsLoggedIn={setIsLoggedIn} setPage={setPage} />
          )}

          {!isLoggedIn && page === "register" && (
            <RegisterElement setIsLoggedIn={setIsLoggedIn} />
          )}

          {isLoggedIn && page === "status" && <StatusElement />}
        </HeroLayout>
      </main>
    </>
  );
}
