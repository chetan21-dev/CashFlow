import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ErrorToast, SuccessToast } from "../../utils/globalFunctions";
import { useNavigate } from "react-router-dom";
import { depositBalanceSchma } from "../../utils/customerValidationSchema";
import "../deposit/deposit.css";
import { Bounce, ToastContainer } from "react-toastify";

const Deposit = () => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(depositBalanceSchma),
    defaultValues: {
      email: "",
      balance: "",
    },
  });

  const submit = async (data) => {
    await axios
      .post("http://localhost:4000/account/deposit", data)
      .then((res) => {
        SuccessToast(res.data.message);
        reset();
      })
      .catch((error) => {
        console.log("easa",error.response)
        ErrorToast(error.response.data?.message);
      });
  };
  return (
    <div className="container-fluid box d-flex justify-content-center align-items-center h-100">
      <form onSubmit={handleSubmit(submit)} className="form-container">
        <div>
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
        <div>
          <label htmlFor="balanceInput" className="form-label">
            Enter Amount
          </label>
          <input
            type="number"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="balanceInput"
            {...register("balance")}
            aria-describedby="emailHelp"
          />
          <div id="balanceInput" className="form-text">
            <p className="error-message">{errors.balance?.message}</p>
          </div>
        </div>
        <div className="col-12 text-center">
          <button className="btn btn-primary" type="submit">
            Deposit
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

export default Deposit;
