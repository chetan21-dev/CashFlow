import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const Layout = () => {
  return (
    <>
    <div className="d-flex flex-column vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
    </div>
    </>
  );
};

export default Layout;
