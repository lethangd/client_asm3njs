import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { onLogin } from "../../Redux/features/userSlice";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const data = await response.json();

      // Lưu user vào Redux và token vào cookie
      dispatch(onLogin({ user: data.user, token: data.token }));

      // Chuyển hướng người dùng đến trang chủ hoặc trang muốn
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="banner-bg row justify-content-center align-items-center">
      <div className="col-md-5 card shadow p-5">
        <h2 className="text-center text-body-secondary mb-5 fw-normal">
          Sign In
        </h2>
        <form className="mt-5" onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control p-4 rounded-0"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            className="form-control p-4 rounded-0"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {error && <p className="text-danger mt-3">{error}</p>}
          <button
            type="submit"
            className="btn btn-dark rounded-0 mt-5 w-100 py-4"
          >
            SIGN IN
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-decoration-none">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
