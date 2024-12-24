import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onLogin: (state, action) => {
      const { user, token } = action.payload;
      state.currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Lưu token vào cookie bằng js-cookie
      Cookies.set("token", token, {
        path: "/",
        domain: "localhost",
        secure: true,
        sameSite: "None",
        expires: 7,
      }); // Cookie hết hạn sau 7 ngày
    },
    onLogout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");

      // Xóa token cookie
      Cookies.remove("token", { path: "/" });
    },
  },
});

export const { onLogin, onLogout } = userSlice.actions;

export default userSlice.reducer;
