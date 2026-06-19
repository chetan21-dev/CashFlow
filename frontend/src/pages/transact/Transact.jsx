import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { transactionSchema } from "../../utils/customerValidationSchema";
import { Bounce, ToastContainer } from "react-toastify";

const Transact = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      account_number: "",
      amount: "",
    },
  });

  const submit = async (data) => {
    // await axios
    //   .post(`http://localhost:4000/account/${data.account_number}`,{
    //     balance : data.balance
    //   })
    //   .then((res) => {
    //     SuccessToast(res.data.message);
    //     reset();
    //   })
    //   .catch((error) => {
    //     ErrorToast(error.response.data?.message);
    //   });
  };

  return (
    <div className="container-fluid">
      <div>
        <div
          className="d-flex justify-content-between"
        >
          <div>
            <form onSubmit={handleSubmit(submit)}>
              <div className="d-flex gap-3 p-2">
                <div class="input-group">
                  <span class="input-group-text">Account Number</span>
                  <input
                    type="number"
                    className="form-control shadow bg-body-tertiary rounded-end"
                    id="accountNumberInput"
                    {...register("account_number")}
                  />
                  <div id="accountNumberInput" className="form-text">
                    <p className="error-message">
                      {errors.account_number?.message}
                    </p>
                  </div>
                </div>
                {/* <div className="input-group"> */}
                <div className="input-group">
                  <span class="input-group-text">Enter Amount</span>
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control shadow bg-body-tertiary rounded-end"
                    id="balanceInput"
                    {...register("balance")}
                    aria-label="Amount (to the nearest rupee)"
                  />
                  <div id="balanceInput" className="form-text">
                    <p className="error-message">{errors.balance?.message}</p>
                  </div>
                </div>
                {/* </div> */}
                <div className="d-flex align-items-center">
                  <button className="btn btn-primary" type="submit">
                    Transfer
                  </button>
                </div>
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
          <div className="d-flex align-items-center me-2">
            <div>Balance : 1000</div>
          </div>
        </div>
        <div style={{ backgroundColor: "skyblue", border: "1px solid black" }}>
          <p>Section 2</p>
        </div>
      </div>
    </div>
  );
};

export default Transact;
