import { Link } from "react-router-dom";
import heroImage from "../../assets/images/bank-transfer.jpg";
import { FEATURES, STATS } from "../../constants/home.data";
import { useAuth } from "../../context/AuthContext";

// Bootstrap has no utility for an image with a gradient overlay, so this one inline style stays
const heroStyle = {
  minHeight: "calc(100vh - 56px)", // 56px = default navbar height
  backgroundImage: `linear-gradient(135deg, rgba(10,25,60,0.9), rgba(60,30,120,0.75)), url(${heroImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const Home = () => {
  const { isLoggedIn, account } = useAuth();

  return (
    <>
      {/* Hero */}
      <section
        className="d-flex align-items-center text-white text-center py-5"
        style={heroStyle}
        data-bs-theme="dark"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <span className="badge rounded-pill bg-light bg-opacity-25 border border-light border-opacity-25 fw-normal px-3 py-2 mb-3">
                {isLoggedIn && account
                  ? `Welcome back, ${account.name}`
                  : "Digital banking made simple"}
              </span>

              <h1 className="display-4 fw-bold mb-3">
                Secure Money Transfers, Anytime
              </h1>
              <p className="lead mb-4 opacity-75">
                Transfer funds instantly and securely between accounts. Fast
                transactions, reliable protection, and complete peace of mind.
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-2">
                {isLoggedIn ? (
                  <>
                    <Link to="/transact" className="btn btn-primary btn-lg">
                      Transfer Money
                    </Link>
                    <Link to="/deposit" className="btn btn-outline-light btn-lg">
                      Deposit
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg">
                      Login
                    </Link>
                  </>
                )}
              </div>

              <div className="d-flex flex-wrap justify-content-center gap-5 mt-5">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <div className="fs-2 fw-bold">{value}</div>
                    <small className="opacity-75">{label}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">Why choose us</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {FEATURES.map(({ icon, title, text }) => (
            <div className="col" key={title}>
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="fs-1 mb-2">{icon}</div>
                  <h3 className="h5 card-title">{title}</h3>
                  <p className="card-text text-body-secondary mb-0">{text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;