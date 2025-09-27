import "../styles/components/nav.scss"

interface NavProps{
  isLoggedIn: boolean,
  setPage: (page: string) => void;
}

export default function NavElement({isLoggedIn, setPage}: NavProps) {
  return (
    <>
      <nav>
        <div className="logo">
          <span className="logoLabel">Betomation</span>
        </div>
        <div className="menu">
          <a onClick={() => setPage("home")}>Início</a>
          <a onClick={() => setPage("prices")}>Preços</a>

          {
            !isLoggedIn && (
              <>
                <a onClick={() => setPage("login")}>Login</a>
                <a onClick={() => setPage("register")}>Registro</a>
              </>
            )
          }
          {
            isLoggedIn && (
              <>
                <a onClick={() => setPage("status")}>Status</a>
                <a onClick={() => setPage("leave")}>Sair</a>
              </>
            )
          }
        </div>
      </nav>
    </>
  );
}
