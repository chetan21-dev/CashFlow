import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { Bounce, ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <>
      <div className="d-flex flex-column vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Outlet />
        </main>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
          style={{ zIndex: 9999 }}
        />
      </div>
    </>
  );
};

export default Layout;
