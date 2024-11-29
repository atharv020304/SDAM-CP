import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    requestForAllApplications(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllApplications(state, action) {
      state.loading = false;
      state.error = null;
      state.applications = action.payload;
    },
    failureForAllApplications(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForMyApplications(state) {
      state.loading = true;
      state.error = null;
    },
    successForMyApplications(state, action) {
      state.loading = false;
      state.error = null;
      state.applications = action.payload;
    },
    failureForMyApplications(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForPostApplication(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForPostApplication(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    failureForPostApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    requestForDeleteApplication(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteApplication(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    failureForDeleteApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    clearAllErrors(state) {
      state.error = null;
      state.message = null;
    },
    resetApplicationSlice(state) {
      return {
        ...state,
        applications: [],
        loading: false,
        error: null,
        message: null,
      };
    },
  },
});

export const postApplication = (data, jobId) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForPostApplication());
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/post/${jobId}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(applicationSlice.actions.successForPostApplication(response.data.message));
  } catch (error) {
    dispatch(applicationSlice.actions.failureForPostApplication(error.response?.data?.message || error.message));
  }
};

export const fetchJobSeekerApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForMyApplications());
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/employee/getall`,
      {
        withCredentials: true,
      }
    );
    dispatch(applicationSlice.actions.successForMyApplications(response.data.applications));
  } catch (error) {
    dispatch(applicationSlice.actions.failureForMyApplications(error.response?.data?.message || error.message));
  }
};

export const fetchEmployerApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForAllApplications());
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/employer/getall`,
      {
        withCredentials: true,
      }
    );
    dispatch(applicationSlice.actions.successForAllApplications(response.data.applications));
  } catch (error) {
    dispatch(applicationSlice.actions.failureForAllApplications(error.response?.data?.message || error.message));
  }
};

export const deleteApplication = (id) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForDeleteApplication());
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/delete/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(applicationSlice.actions.successForDeleteApplication(response.data.message));
    dispatch(clearAllapplicationErrors());
  } catch (error) {
    dispatch(applicationSlice.actions.failureForDeleteApplication(error.response?.data?.message || error.message));
  }
};

export const clearAllapplicationErrors = () => (dispatch) => {
  dispatch(applicationSlice.actions.clearAllErrors());
};

export const resetApplicationSlice = () => (dispatch) => {
  dispatch(applicationSlice.actions.resetApplicationSlice());
};

export default applicationSlice.reducer;
