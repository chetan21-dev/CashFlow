import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import heroImage from "../../assets/images/bank-transfer.jpg";
import { customerLoginSchema } from "../../utils/customerValidationSchema";
import { useAuth } from "../../context/AuthContext";
import { errorToast, successToast } from "../../utils/appToast";
import { api } from "../../utils/api";

// Same background treatment as the Home hero (no Bootstrap utility exists for this)
const pageStyle = {
  minHeight: "calc(100vh - 56px)", // 56px = default navbar height
  backgroundImage: `linear-gradient(135deg, rgba(10,25,60,0.9), rgba(60,30,120,0.75)), url(${heroImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const Login = () => {
  "use no memo";
  const { isLoggedIn, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      console.log("res",res)
      successToast(res.data.message);
      login(res.data.accessToken); // renamed from `token`
    } catch (error) {
      errorToast(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to login. Please try again.",
      );
    }
  };

  // Already logged in (or just logged in): go to the app
  if (isLoggedIn) return <Navigate to="/transact" replace />;

  return (
    <div
      className="d-flex align-items-center justify-content-center px-3 py-5"
      style={pageStyle}
    >
      <div className="card border-0 shadow-lg w-100" style={{ maxWidth: 420 }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold mb-1">Welcome back</h1>
            <p className="text-body-secondary mb-0">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit(submit)} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="emailInput"
                autoComplete="email"
                placeholder="you@example.com"
                className={`form-control shadow ${errors.email ? "is-invalid" : ""}`}
                aria-invalid={!!errors.email}
                aria-describedby="emailError"
                {...register("email")}
              />
              {errors.email && (
                <div
                  id="emailError"
                  className="text-danger small mt-1"
                  role="alert"
                >
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="passwordInput" className="form-label">
                Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="passwordInput"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`form-control shadow ${errors.password ? "is-invalid" : ""}`}
                  aria-invalid={!!errors.password}
                  aria-describedby="passwordError"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <div
                  id="passwordError"
                  className="text-danger small mt-1"
                  role="alert"
                >
                  {errors.password.message}
                </div>
              )}
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-body-secondary mt-4 mb-0">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
