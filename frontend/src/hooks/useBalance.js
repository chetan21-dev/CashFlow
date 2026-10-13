// hooks/useBalance.js
import { useEffect, useState } from "react";
import axios from "axios";
import { authHeader } from "../utils/auth";

export const useBalance = (refreshKey) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    let ignore = false;
    axios
      .get("http://localhost:4000/account/me", { headers: authHeader() })
      .then((res) => !ignore && setBalance(res.data.balance))
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  return balance;
};