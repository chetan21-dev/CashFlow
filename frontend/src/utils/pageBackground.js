import { } from "react"; // not needed, remove if your linter complains

export const authPageStyle = (image) => ({
  minHeight: "calc(100vh - 56px)", // 56px = default navbar height
  backgroundImage: `linear-gradient(135deg, rgba(10,25,60,0.9), rgba(60,30,120,0.75)), url(${image})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});