import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import registerImage from "../../assets/images/register-customer.jpg";
import FormField from "../../components/common/FormField";
import { customerValidationSchema } from "../../utils/customerValidationSchema";
import { authPageStyle } from "../../utils/pageBackground";
import { errorToast, successToast } from "../../utils/appToast";
import { api } from "../../utils/api";

const Register = () => {
  "use no memo";
  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(customerValidationSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      email: "",
      mobile: "",
      password: "",
      aadhaar_number: "",
      pan_number: "",
    },
  });

  const submit = async (data) => {
    try {
      const { data: res } = await api.post("/customer/register", data);

      // Create the bank account for the new customer
      await api.post("/account", {
        name: `${res.user.first_name} ${res.user.last_name}`,
        email: res.user.email,
      });
      successToast(res.message);
      reset();
      navigate("/login");
    } catch (error) {
      errorToast(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center px-3 py-5"
      style={authPageStyle(registerImage)}
    >
      <div className="card border-0 shadow-lg w-100" style={{ maxWidth: 720 }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold mb-1">Create your account</h1>
            <p className="text-body-secondary mb-0">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit(submit)} noValidate>
            <div className="row g-3">
              {/* Name */}
              <FormField
                id="firstName"
                label="First Name"
                className="col-md-4"
                autoComplete="given-name"
                error={errors.first_name}
                registration={register("first_name")}
              />
              <FormField
                id="middleName"
                label="Middle Name (optional)"
                className="col-md-4"
                autoComplete="additional-name"
                error={errors.middle_name}
                registration={register("middle_name")}
              />
              <FormField
                id="lastName"
                label="Last Name"
                className="col-md-4"
                autoComplete="family-name"
                error={errors.last_name}
                registration={register("last_name")}
              />

              {/* Gender */}
              <div className="col-12">
                <span className="form-label d-block">Gender</span>
                {["Male", "Female"].map((g) => (
                  <div className="form-check form-check-inline" key={g}>
                    <input
                      className={`form-check-input ${errors.gender ? "is-invalid" : ""}`}
                      type="radio"
                      id={`gender${g}`}
                      value={g}
                      {...register("gender")}
                    />
                    <label className="form-check-label" htmlFor={`gender${g}`}>
                      {g}
                    </label>
                  </div>
                ))}
                {errors.gender && (
                  <div className="text-danger small mt-1" role="alert">
                    {errors.gender.message}
                  </div>
                )}
              </div>

              {/* Contact */}
              <FormField
                id="email"
                label="Email address"
                type="email"
                className="col-md-6"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email}
                registration={register("email")}
              />
              <FormField
                id="mobile"
                label="Mobile Number"
                type="tel"
                className="col-md-6"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                error={errors.mobile}
                registration={register("mobile")}
              />

              {/* Security */}
              <FormField
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                error={errors.password}
                registration={register("password")}
              />

              {/* Identity */}
              <FormField
                id="aadhaar"
                label="Aadhaar Number"
                className="col-md-6"
                inputMode="numeric"
                maxLength={12}
                error={errors.aadhaar_number}
                registration={register("aadhaar_number")}
              />
              <FormField
                id="pan"
                label="PAN Number"
                className="col-md-6 text-uppercase"
                maxLength={10}
                error={errors.pan_number}
                registration={register("pan_number")}
              />
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-primary flex-grow-1" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Reset
              </button>
            </div>
          </form>

          <p className="text-center text-body-secondary mt-4 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;