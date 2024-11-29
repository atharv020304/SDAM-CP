import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuth: false,
    user: {},
    error: null,
    message: null,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.isAuth = false;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuth = true;
      state.user = action.payload.user;
      state.error = null;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuth = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },
    loginRequest(state) {
      state.loading = true;
      state.isAuth = false;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuth = true;
      state.user = action.payload.user;
      state.error = null;
      state.message = action.payload.message;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuth = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },
    fetchUserRequest(state) {
      state.loading = true;
      state.isAuth = false;
      state.user = {};
      state.error = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuth = true;
      state.user = action.payload;
      state.error = null;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuth = false;
      state.user = {};
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.isAuth = false;
      state.user = {};
      state.error = null;
    },
    logoutFailed(state, action) {
      state.isAuth = true;
      state.user = state.user;
      state.error = action.payload;
    },
    clearAllErrors(state) {
      state.error = null;
      state.user = state.user;
    },
  },
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/register`, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(userSlice.actions.registerSuccess(response.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.registerFailed(error.response.data.message));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/login`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(userSlice.actions.loginSuccess(response.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loginFailed(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  console.log("getUser: Dispatching fetchUserRequest");
  dispatch(userSlice.actions.fetchUserRequest());

  try {
    console.log("getUser: Sending request to API...");
    const response = await axios.get(`${BACKEND_URL}/api/v1/user/getuser`, {
      withCredentials: true,
    });

    console.log("getUser: Response received from API", response.data);
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));

    console.log("getUser: Clearing all errors");
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    console.error("getUser: Error occurred", error.response?.data?.message || error.message);
    dispatch(userSlice.actions.fetchUserFailed(error.response?.data?.message || "An error occurred"));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/user/logout`, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.logoutSuccess());
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed(error.response.data.message));
  }
};

export const clearAllUserErrors = () => (dispatch) => {
  dispatch(userSlice.actions.clearAllErrors());
};

export default userSlice.reducer;
