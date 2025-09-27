import { useState } from "react";
import HeroElement from "./components/hero";
import NavElement from "./components/nav";
import LoginElement from "./pages/login";
import PriceElement from "./pages/price";
import RegisterElement from "./pages/register";
import HeroLayout from "./components/herolayout";
import "./styles/App.scss";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("home");

  return (
    <>
      <header>
        <NavElement isLoggedIn={isLoggedIn} setPage={setPage} />
      </header>
      <main>
        <HeroLayout>
          {page === "home" && <HeroElement />}

          {page === "prices" && <PriceElement />}

          {!isLoggedIn && page === "login" && (
            <LoginElement setIsLoggedIn={setIsLoggedIn} />
          )}
          {!isLoggedIn && page === "register" && (
            <RegisterElement setIsLoggedIn={setIsLoggedIn} />
          )}
        </HeroLayout>
      </main>
    </>
  );
}

export default App;
