import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance";

// Safely parse user data from localStorage
let localData = {};
try {
  localData = JSON.parse(localStorage.getItem("data") || "{}");
} catch (e) {
  localData = {};
}

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  role: localStorage.getItem("role") || "",
  data: localData
};

// 🟢 Signup
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const res = axiosInstance.post("user/register", data);
    toast.promise(res, {
      loading: "Creating your account...",
      success: (data) => data?.data?.message,
      error: "Failed to create account"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Signup failed");
  }
});

// 🟢 Login
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = axiosInstance.post("user/login", data);
    toast.promise(res, {
      loading: "Authenticating...",
      success: (data) => data?.data?.message,
      error: "Login failed"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Login failed");
  }
});

// 🟢 Logout
export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = axiosInstance.post("user/logout");
    toast.promise(res, {
      loading: "Logging out...",
      success: (data) => data?.data?.message,
      error: "Logout failed"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Logout failed");
  }
});

// 🟢 Update Profile
export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
  try {
    const res = axiosInstance.put("user/update", data);
    toast.promise(res, {
      loading: "Updating profile...",
      success: (data) => data?.data?.message,
      error: "Profile update failed"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Profile update failed");
  }
});

// 🟢 Get User Data
export const getuserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = axiosInstance.get("user/me");
    return (await res).data;
  } catch (error) {
    toast.error(error?.message || "Failed to fetch user data");
  }
});

// 🟢 Forget Password
export const forgetPassword = createAsyncThunk("/auth/forget-password", async (data) => {
  try {
    const res = axiosInstance.post("user/reset", data);
    toast.promise(res, {
      loading: "Sending reset link...",
      success: (data) => data?.data?.message,
      error: "Failed to send reset link"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error during password reset");
  }
});

// 🟢 Change Password
export const changePassword = createAsyncThunk("/auth/changePassword", async (userPassword) => {
  try {
    const res = axiosInstance.post("/user/change-password", userPassword);
    toast.promise(res, {
      loading: "Changing password...",
      success: (data) => data?.data?.message,
      error: "Failed to change password"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Password change failed");
  }
});

// 🟢 Reset Password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    const res = axiosInstance.post(`/user/reset/${data.resetToken}`, { password: data.password });
    toast.promise(res, {
      loading: "Resetting password...",
      success: (data) => data?.data?.message,
      error: "Failed to reset password"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Password reset failed");
  }
});

// 🔧 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (user) {
          localStorage.setItem("data", JSON.stringify(user));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", user.role);
          state.data = user;
          state.role = user.role;
          state.isLoggedIn = true;
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (user) {
          localStorage.setItem("data", JSON.stringify(user));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", user.role);
          state.data = user;
          state.role = user.role;
          state.isLoggedIn = true;
        }
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = "";
      })
      .addCase(getuserData.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user.role);
        state.data = user;
        state.role = user.role;
        state.isLoggedIn = true;
      });
  }
});

// No extra actions exported
export default authSlice.reducer;
