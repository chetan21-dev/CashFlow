import { toast, Bounce } from "react-toastify";
import ToastContent from "../components/common/ToastContent";

export const formatINR = (value) =>
  Number(value).toLocaleString("en-IN", { style: "currency", currency: "INR" });

const DEFAULTS = {
  icon: false, // the icon is drawn inside ToastContent
  position: "top-center",
  autoClose: 4000,
  transition: Bounce,
  className: "rounded-3 shadow-lg",
};

// Generic: use this for anything custom
export const showToast = ({ type = "success", title, message, details, icon, ...options }) =>
  toast[type](
    <ToastContent type={type} title={title} message={message} details={details} icon={icon} />,
    { ...DEFAULTS, ...options }
  );

// Shortcuts
export const successToast = (title, message) => showToast({ type: "success", title, message });

export const errorToast = (message, title = "Something went wrong") =>{
  console.log("show")
  showToast({ type: "error", title, message, autoClose: 5000 });
}

export const infoToast = (title, message) => showToast({ type: "info", title, message });

// Domain-specific
export const depositToast = ({ amount, balance }) =>
  showToast({
    type: "success",
    icon: "💰",
    title: "Deposit successful",
    message: `${formatINR(amount)} added to your account`,
    details: [{ label: "New balance", value: formatINR(balance) }],
  });

export const transferToast = ({ amount, receiverName, balance }) =>
  showToast({
    type: "success",
    icon: "💸",
    title: "Transfer successful",
    message: `${formatINR(amount)} sent${receiverName ? ` to ${receiverName}` : ""}`,
    details: [{ label: "Remaining balance", value: formatINR(balance) }],
  });