// src/utils/auth.js
import { getLocalStorage } from "./localStorage"; // adjust to wherever getLocalStorage lives

export const authHeader = () => ({
  Authorization: `Bearer ${getLocalStorage("token")}`,
});