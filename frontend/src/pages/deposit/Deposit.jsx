import styles from "../deposit/deposit.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ErrorToast, SuccessToast } from "../../utils/globalFunctions";
import { useNavigate } from "react-router-dom";
import { depositBalanceSchema } from "../../utils/customerValidationSchema";
import { Bounce, ToastContainer } from "react-toastify";

const Deposit = () => {

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(depositBalanceSchema),
    defaultValues: {
      account_number: "",
      balance: "",
    },
  });

  const submit = async (data) => {
    await axios
      .post(`http://localhost:4000/account/${data.account_number}`,{
        balance : data.balance
      })
      .then((res) => {
        SuccessToast(res.data.message);
        reset();
      })
      .catch((error) => {
        ErrorToast(error.response.data?.message);
      });
  };
  
  return (
    <div
      className={`container-fluid box d-flex justify-content-center align-items-center h-100 ${styles.backgroundImage}`}
    >
      <form
        onSubmit={handleSubmit(submit)}
        className={`row g-3 bg-dark bg-opacity-25 bg-radient rounded p-4 ${styles.formContainer}`}
      >
        <div>
          <label htmlFor="accountNumberInput" className="form-label text-light">
            Account Number
          </label>
          <input
            type="number"
            className="form-control shadow p-2 bg-body-tertiary rounded"
            id="accountNumberInput"
            {...register("account_number")}
          />
          <div id="accountNumberInput" className="form-text">
            <p className="error-message">{errors.account_number?.message}</p>
          </div>
        </div>
        <div className="input-group mb-3">
          <label htmlFor="balanceInput" className="form-label text-light">
            Enter Amount
          </label>
          <div className="input-group mb-3">
            <span className="input-group-text">₹</span>
            <input
              type="number"
              className="form-control shadow p-2 bg-body-tertiary rounded"
              id="balanceInput"
              {...register("balance")}
              aria-label="Amount (to the nearest rupee)"
            />
          </div>

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
