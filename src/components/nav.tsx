import "../styles/components/nav.scss"

interface NavProps{
  isLoggedIn: boolean,
  setPage: (page: string) => void;
  onLoggout: () => void;
}

export default function NavElement({isLoggedIn, setPage, onLoggout}: NavProps) {
  return (
    <>
      <nav>
        <div className="logo">
          <span className="logoLabel">Beetomation</span>
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
                <a onClick={onLoggout}>Sair</a>
              </>
            )
          }
        </div>
      </nav>
    </>
  );
}
