import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { transactionSchema } from "../../utils/customerValidationSchema";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { useBalance } from "../../hooks/useBalance";
import { errorToast, transferToast } from "../../utils/appToast";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
const LIMIT = 10; // outside the component so it never triggers the effect

const Transact = () => {
  "use no memo";
  const { account, refreshAccount } = useAuth();
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0); // bump this to refetch

  useEffect(() => {
    let ignore = false; // prevents setting state after unmount or a newer request

    const loadHistory = async () => {
      try {
        const res = await api.get("/transact/history", {
          params: { page, limit: LIMIT },
        });
        if (!ignore) {
          setHistory(res.data.data ?? []);
          setTotalPages(res.data.totalPages ?? 1);
          setTotal(res.data.total ?? 0);
        }
      } catch (error) {
        // ErrorToast(error.response?.data?.message);
      }
    };

    loadHistory();

    return () => {
      ignore = true;
    };
  }, [page, refreshKey]);

  const {
    register,
    formState: { errors, isSubmitting },
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
    try {
        const res = await api.post("/transact", {
      receiver_account_number: Number(data.account_number),
      amount: Number(data.amount),
    });
        transferToast({ amount: data.amount, balance: res.data.balance });
    reset();
    setPage(1);
    setRefreshKey((k) => k + 1); // reloads the history
    refreshAccount();            // reloads the balance
    } catch (error) {
         errorToast(error.response?.data?.message || "Transfer failed. Please try again.");
    }
  };

  return (
    <div className="container-fluid">
      <div>
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 p-2">
          <form
            className="flex-grow-1"
            onSubmit={handleSubmit(submit)}
            noValidate
          >
            <div className="row g-3 align-items-start">
              {/* Account number */}
              <div className="col-12 col-md-5">
                <div className="input-group shadow-sm">
                  <label
                    className="input-group-text"
                    htmlFor="accountNumberInput"
                  >
                    Account Number
                  </label>
                  <input
                    type="number"
                    id="accountNumberInput"
                    className={`form-control ${errors.account_number ? "is-invalid" : ""}`}
                    aria-invalid={!!errors.account_number}
                    aria-describedby="accountNumberError"
                    {...register("account_number")}
                  />
                </div>
                {errors.account_number && (
                  <div
                    id="accountNumberError"
                    className="text-danger small mt-1"
                    role="alert"
                  >
                    {errors.account_number.message}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="col-12 col-md-5">
                <div className="input-group shadow-sm">
                  <label className="input-group-text" htmlFor="amountInput">
                    Amount
                  </label>
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    id="amountInput"
                    step="0.01"
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
              </div>

              {/* Submit */}
              <div className="col-12 col-md-2">
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Transferring..." : "Transfer"}
                </button>
              </div>
            </div>
          </form>

          <div
            className="d-flex align-items-center fw-semibold text-nowrap me-2"
            style={{ height: "38px" }}
          >
           Balance : ₹{account?.balance ?? 0}
          </div>
        </div>

        <div className="mt-3">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Counterparty</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {history?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  history?.map((t) => (
                    <tr key={t.id}>
                      <td>
                        {t.counterpartyName}
                        <small className="text-muted d-block">
                          {t.counterpartyAccount}
                        </small>
                      </td>
                      <td
                        className={
                          t.type === "credit" ? "text-success" : "text-danger"
                        }
                      >
                        {t.type === "credit" ? "+" : "-"}₹{t.amount}
                      </td>
                      <td>{new Date(t.date).toLocaleString("en-IN")}</td>
                      <td>
                        <span
                          className={`badge ${t.type === "credit" ? "bg-success" : "bg-danger"}`}
                        >
                          {t.type === "credit" ? "Credit" : "Debit"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              {total === 0
                ? "0 transactions"
                : `Showing ${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, total)} of ${total}`}
            </span>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transact;
