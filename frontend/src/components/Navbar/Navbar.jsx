import { Link, NavLink, useNavigate } from "react-router-dom";
import { NAVBAR_CONST, NAV_LINKS } from "../../constants/Navbar.data";
import { useAuth } from "../../context/AuthContext";

const maskAccount = (n) => `A/C •••• ${String(n).slice(-4)}`;

const Navbar = () => {
  const { isLoggedIn, account, logout } = useAuth();
  const navigate = useNavigate();

  const visibleLinks = NAV_LINKS.filter((l) => !l.protected || isLoggedIn);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-dark bg-gradient sticky-top shadow-sm"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          {NAVBAR_CONST.TITLE}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {visibleLinks.map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isLoggedIn ? (
              <>
                <div className="d-flex align-items-center gap-2 me-2">
                  <div
                    className="rounded-circle bg-primary text-white fw-semibold d-flex align-items-center justify-content-center"
                    style={{ width: 36, height: 36 }}
                    aria-hidden="true"
                  >
                    {account?.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div className="lh-sm text-light">
                    <div className="fw-semibold">{account?.name ?? "Loading..."}</div>
                    {account && (
                      <small className="text-secondary">
                        {maskAccount(account.account_number)}
                      </small>
                    )}
                  </div>
                </div>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary btn-sm" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;