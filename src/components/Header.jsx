"use client";

import { Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink từ react-router-dom
import { onLogout } from "../Redux/features/userSlice";

export default function Component() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    // Dispatch logout action để xóa thông tin người dùng trong Redux
    dispatch(onLogout());

    // Điều hướng người dùng về trang đăng nhập
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="bg-white py-3">
      <Container>
        {/* Left navigation */}
        <Nav className="me-auto">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-warning" : "text-dark"
            }
            style={{ textDecoration: "none" }}
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "text-warning" : "text-dark"
            }
            style={{ textDecoration: "none", marginLeft: "20px" }}
          >
            Shop
          </NavLink>
        </Nav>

        <Navbar.Brand
          href="/"
          className="position-absolute start-50 translate-middle-x"
        >
          <span className="fst-italic">BOUTIQUE</span>
        </Navbar.Brand>

        <Nav className="ms-auto">
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `d-flex align-items-center gap-1 ${
                isActive ? "text-warning" : "text-dark"
              }`
            }
            style={{ textDecoration: "none", marginRight: "20px" }}
          >
            <i className="fas fa-dolly-flatbed mr-1 text-gray"></i>
            Cart
          </NavLink>

          {currentUser ? (
            <div className="d-flex align-items-center">
              <span>{currentUser.fullname}</span>
              <button className="bg-transparent btn" onClick={handleLogout}>
                (Logout)
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `d-flex align-items-center gap-1 ${
                  isActive ? "text-warning" : "text-dark"
                }`
              }
              style={{ textDecoration: "none" }}
            >
              <i className="fas fa-user-alt mr-1 text-gray"></i>
              Login
            </NavLink>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
