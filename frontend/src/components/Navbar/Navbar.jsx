import { NAVBAR_CONST } from "../../constants/Navbar.data";

const Navbar = () => {
  return (
      <nav className="navbar navbar-expand-lg bg-dark bg-gradient" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            {NAVBAR_CONST.TITLE}
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li>
               <li className="nav-item">
                <a className="nav-link" href="/transact">
                  Transact
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/register">
                  Register
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
               <li className="nav-item">
                <a className="nav-link" href="/logout">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
