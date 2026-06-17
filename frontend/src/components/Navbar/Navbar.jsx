import { NAVBAR_CONST } from "../../constants/Navbar.data";
import { removeLocalStorage } from "../../utils/localStorage";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeLocalStorage("jwt-token");
    navigate("/login");
  };
  return (
    <nav
      className="navbar navbar-expand-lg bg-dark bg-gradient"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          {NAVBAR_CONST.TITLE}
        </a>
        <div
          className="collapse navbar-collapse d-flex justify-space-between"
          id="navbarSupportedContent"
        >
          <div className="d-flex flex-grow-1">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                {" "}
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/transact">
                  Transact
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/deposit">
                  Deposit
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li> 
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
