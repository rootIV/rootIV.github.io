import { useState, useEffect } from "react";
import HeroElement from "../components/hero";
import NavElement from "../components/nav";
import LoginElement from "./login";
import PriceElement from "./price";
import RegisterElement from "./register";
import StatusElement from "./status";
import HeroLayout from "../components/herolayout";
import "../styles/App.scss";
import { useAuth } from "../context/AuthContext";

export default function App() {
  const { token, email, logout } = useAuth();
  const [page, setPage] = useState("home");

  const isLoggedIn = !!token;

  const handleLogout = () => {
    logout();
    setPage("home");
  };

  useEffect(() => {
    if (isLoggedIn && (page === "login" || page === "register")) {
      setPage("status");
    }
  }, [isLoggedIn, page]);


  return (
    <>
      <header>
        <NavElement isLoggedIn={isLoggedIn} setPage={setPage} onLogout={handleLogout}/>
      </header>
      <main>
        <HeroLayout>
          {page === "home" && <HeroElement />}

          {page === "prices" && <PriceElement setPage={setPage} isLogged={isLoggedIn}/>}

          {!isLoggedIn && page === "login" && <LoginElement setPage={setPage}/>}

          {!isLoggedIn && page === "register" && <RegisterElement/>}

          {isLoggedIn && page === "status" && <StatusElement email={email ?? ""}/>}
        </HeroLayout>
      </main>
    </>
  );
}
