
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:2000";

const jobSlice = createSlice({
    name: "jobs",
    initialState: {
        jobs: [],
        loading: false,
        error: null,
        message: null,
        singleJob: {},
        myJobs: [],
    },
    reducers: {
        requestForAllJobs(state) {
            state.loading = true;
            state.error = null;
        },
        successForAllJobs(state, action) {
            state.loading = false;
            state.jobs = action.payload;
            state.error = null;
        },
        failureForAllJobs(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        requestForSingleJob(state) {
            state.message = null;
            state.error = null;
            state.loading = true;
        },
        successForSingleJob(state, action) {
            state.loading = false;
            state.singleJob = action.payload;
            state.error = null;
        },
        failureForSingleJob(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        requestForPostJob(state) {
            state.message = null;
            state.error = null;
            state.loading = true;
        },
        successForPostJob(state, action) {
            state.message = action.payload;
            state.error = null;
            state.loading = false;
        },
        failureForPostJob(state, action) {
            state.message = null;
            state.error = action.payload;
            state.loading = false;
        },
        requestForMyJobs(state) {
            state.loading = true;
            state.error = null;
            state.myJobs = [];
        },
        successForMyJobs(state, action) {
            state.loading = false;
            state.error = null;
            state.myJobs = action.payload;
        },
        failureForMyJobs(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        requestForDeleteJobs(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        successForDeleteJobs(state, action) {
            state.loading = false;
            state.error = null;
            state.message = action.payload;
        },
        failureForDeleteJobs(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },
        clearAllErrors(state) {
            state.error = null;
        },
        resetJobSlice(state) {
            state.error = null;
            state.loading = false;
            state.jobs = state.jobs;
            state.message = null;
            state.singleJob = {};
            state.myJobs = state.myJobs;
        }
    }
});

export const fetchJobs = (city, domain, searchKeyword = "") => async (dispatch) => {
    try {
        dispatch(jobSlice.actions.requestForAllJobs());
        let link = `${BACKEND_URL}/api/v1/job/getall?`;
        let queryParams = [];

        if (searchKeyword) queryParams.push(`searchKeyword=${searchKeyword}`);
        if (city) queryParams.push(`city=${city}`);
        if (domain) queryParams.push(`domain=${domain}`);

        link += queryParams.join("&");

        const response = await axios.get(link, { withCredentials: true });
        dispatch(jobSlice.actions.successForAllJobs(response.data.jobs));
        dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(jobSlice.actions.failureForAllJobs(error.response?.data?.message || "Failed to fetch jobs"));
    }
};

export const fetchSingleJob = (jobId) => async (dispatch) => {
    dispatch(jobSlice.actions.requestForSingleJob());
    try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/job/get/${jobId}`, {
            withCredentials: true,
        });
        dispatch(jobSlice.actions.successForSingleJob(response.data.job));
        dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(jobSlice.actions.failureForSingleJob(error.response?.data?.message || "Failed to fetch job"));
    }
};

export const PostJob = (data) => async (dispatch) => {
    dispatch(jobSlice.actions.requestForPostJob());
    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/job/post`, data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
        });
        dispatch(jobSlice.actions.successForPostJob(response.data.message));
        dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(jobSlice.actions.failureForPostJob(error.response?.data?.message || "Failed to post job"));
    }
};

export const getMyJobs = () => async (dispatch) => {
    dispatch(jobSlice.actions.requestForMyJobs());
    try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/job/getmyjobs`, {
            withCredentials: true,
        });
        dispatch(jobSlice.actions.successForMyJobs(response.data.myJobs));
        dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(jobSlice.actions.failureForMyJobs(error.response?.data?.message || "Failed to fetch my jobs"));
    }
};

export const deleteJob = (id) => async (dispatch) => {
    dispatch(jobSlice.actions.requestForDeleteJobs());
    try {
        const response = await axios.delete(`${BACKEND_URL}/api/v1/job/delete/${id}`, {
            withCredentials: true,
        });
        dispatch(jobSlice.actions.successForDeleteJobs(response.data.message));
        dispatch(clearAllJobErrors());
    } catch (error) {
        dispatch(jobSlice.actions.failureForDeleteJobs(error.response?.data?.message || "Failed to delete job"));
    }
};

export const clearAllJobErrors = () => (dispatch) => {
    dispatch(jobSlice.actions.clearAllErrors());
};

export const resetJobSlice = () => (dispatch) => {
    dispatch(jobSlice.actions.resetJobSlice());
};

export default jobSlice.reducer;
