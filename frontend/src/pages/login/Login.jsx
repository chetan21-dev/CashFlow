import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { customerLoginSchema } from "../../utils/customerValidationSchema";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { ErrorToast, SuccessToast } from "../../utils/globalFunctions";
import { setLocalStorage } from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = async (data) => {
    await axios
      .post("http://localhost:4000/customer/login", data)
      .then((res) => {
        setLocalStorage('jwt_token',res.data?.token)
        SuccessToast(res?.data?.message)
        reset();
        navigate('/transact')
      }).catch(error => {
        console.error("Login Error: ",error.response.data)
        ErrorToast(error.response.data.error)
      })
  };

  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <form
        className="form-container row g-3 bg-light rounded p-2"
        onSubmit={handleSubmit(submit)}
      >
        <div>
          <label htmlFor="emailInput" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            {...register("email")}
            aria-describedby="emailHelp"
          />
          <div className="form-text">
            <p className="error-message">{errors.email?.message}</p>
          </div>
        </div>
        <div>
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            {...register("password")}
          />
          <div className="form-text">
            <p className="error-message">{errors.password?.message}</p>
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

export default Login;
