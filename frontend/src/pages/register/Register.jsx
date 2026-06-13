import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from "react-toastify";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import "../register/register.css";
import { customerValidationSchema } from "../../utils/customerValidationSchema";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
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
      pan_number: "",
      aadhaar_number: "",
      password: "",
    },
  });

  const submit = async (data) => {
    await axios
      .post("http://localhost:4000/customer/register", data)
      .then((res) => {
        toast.success(res?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        reset();
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center background-image h-100">
      <form
        className="form-container p-4 row g-4 bg-light rounded z-1"
        onSubmit={handleSubmit(submit)}
      >
        <div className="col-md-4">
          <label htmlFor="firstNameInput" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="firstNameInput"
            {...register("first_name")}
          />
          <div id="firstNameInput" className="form-text">
            <p className="error-message">{errors.first_name?.message}</p>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="middleNameInput" className="form-label">
            Middle Name
          </label>
          <input
            type="text"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="middleNameInput"
            {...register("middle_name")}
          />
          <div id="middleNameInput" className="form-text">
            <p className="error-message">{errors.middle_name?.message}</p>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="lastNameInput" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="lastNameInput"
            {...register("last_name")}
          />
          <div id="lastNameInput" className="form-text">
            <p className="error-message">{errors.last_name?.message}</p>
          </div>
        </div>
        <div className="col-md-4 flex align-items-center">
          <label className="me-3">Gender</label>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              {...register("gender")}
              value="male"
              id="inlineRadio1"
            />
            <label className="form-check-label" htmlFor="inlineRadio1">
              Male
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              {...register("gender")}
              id="inlineRadio2"
              value="female"
            />
            <label className="form-check-label" htmlFor="inlineRadio2">
              Female
            </label>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="emailInput" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="emailInput"
            {...register("email")}
            aria-describedby="emailHelp"
          />
          <div id="emailInput" className="form-text">
            <p className="error-message">{errors.email?.message}</p>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="exampleInputPassword1"
            {...register("password")}
          />
          <div id="exampleInputPassword1" className="form-text">
            <p className="error-message">{errors.password?.message}</p>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="mobileInput" className="form-label">
            Mobile Number
          </label>
          <input
            type="number"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="mobileInput"
            {...register("mobile")}
            aria-describedby="emailHelp"
          />
          <div id="mobileInput" className="form-text">
            <p className="error-message">{errors.mobile?.message}</p>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="aadharInput" className="form-label">
            Aadhaar Number
          </label>
          <input
            type="text"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="aadharInput"
            {...register("aadhaar_number")}
          />
          <div id="aadharInput" className="form-text">
            <p className="error-message">{errors.aadhaar_number?.message}</p>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="panInput" className="form-label">
            PAN Number
          </label>
          <input
            type="text"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="panInput"
            {...register("pan_number")}
          />
          <div id="panInput" className="form-text">
            <p className="error-message">{errors.pan_number?.message}</p>
          </div>
        </div>
        <div className="col-12 text-center">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default Register;
