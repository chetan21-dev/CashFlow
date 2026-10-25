import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import depositImage from "../../assets/images/deposit-amount.jpg";
import { depositBalanceSchema } from "../../utils/customerValidationSchema";
import { authPageStyle } from "../../utils/pageBackground";
import { useAuth } from "../../context/AuthContext";
import { depositToast, errorToast } from "../../utils/appToast";
import { api } from "../../utils/api";

const QUICK_AMOUNTS = [500, 1000, 5000, 10000];

const Deposit = () => {
  "use no memo";
  const { account, refreshAccount } = useAuth();
  const {
    register,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
    getValues,
  } = useForm({
    resolver: zodResolver(depositBalanceSchema),
    defaultValues: { amount: "" },
  });
  const submit = async (data) => {
    try {
      const res = await api.post(`/account/${account.account_number}`, {
        balance: Number(data.amount),
      });
      depositToast({ amount: data.amount, balance: res.data.balance });
      reset();
      refreshAccount();
    } catch (error) {
      errorToast(
        error.response?.data?.message || "Deposit failed. Please try again.",
      );
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center px-3 py-5"
      style={authPageStyle(depositImage)}
    >
      <div className="card border-0 shadow-lg w-100" style={{ maxWidth: 460 }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold mb-1">Deposit Money</h1>
            <p className="text-body-secondary mb-0">
              Add funds to your account
            </p>
          </div>

          {/* Account summary */}
          <div className="bg-body-tertiary rounded p-3 mb-4">
            {account ? (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">{account.name}</div>
                  <small className="text-body-secondary">
                    A/C {account.account_number}
                  </small>
                </div>
                <div className="text-end">
                  <small className="text-body-secondary d-block">
                    Current balance
                  </small>
                  <span className="fw-bold">₹{account.balance}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-body-secondary">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
                Loading account...
              </div>
            )}
          </div>

          {/* <form onSubmit={handleSubmit(submit)} noValidate> */}
          <form
            onSubmit={handleSubmit(submit, (errs) =>
              console.log(errs, getValues()),
            )}
            noValidate
          >
            <label htmlFor="amountInput" className="form-label">
              Amount
            </label>
            <div className="input-group shadow">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                id="amountInput"
                step="0.01"
                inputMode="decimal"
                placeholder="Enter amount"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                aria-invalid={!!errors.amount}
                aria-describedby="amountError"
                {...register("amount")}
              />
            </div>
            {errors.amount && (
              <div
                id="amountError"
                className="text-danger small mt-1"
                role="alert"
              >
                {errors.amount.message}
              </div>
            )}

            {/* Quick amounts */}
            <div className="d-flex flex-wrap gap-2 mt-3">
              {QUICK_AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setValue("amount", String(value), { shouldValidate: true })
                  }
                >
                  +₹{value}
                </button>
              ))}
            </div>
            {console.log("as", isSubmitting, account)}
            <button
              className="btn btn-primary w-100 mt-4"
              type="submit"
              disabled={isSubmitting || !account}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Depositing...
                </>
              ) : (
                "Deposit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
