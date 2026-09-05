import { Outlet } from "react-router-dom";
import Wrapper from "./Wrapper";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Layout for every public-facing page: Home, About, Contact, Login, Signup.
 * Navbar and Footer render once here and are shared by all of them through
 * <Outlet />, instead of each page importing its own copy.
 */
export default function UnauthLayout() {
  return (
    <Wrapper>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </Wrapper>
  );
}