// src/utils/auth.js
import { COMMON_CONST } from "../constants/common.data";
import { getLocalStorage } from "./localStorage"; // adjust to wherever getLocalStorage lives

export const authHeader = () => ({
  Authorization: `Bearer ${getLocalStorage(COMMON_CONST.TOKEN_KEY)}`,
});