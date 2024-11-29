import { configureStore } from "@reduxjs/toolkit";
import jobSlice from "./slices/jobSlice.js";
import userSlice from "./slices/userSlice.js";
import applicationSlice from "./slices/applicationSlice.js";
import updateProfileslice, { updateProfile } from "./slices/updateProfileslice.js";

const store = configureStore({
    reducer: {
        user:userSlice,
        jobs: jobSlice,
        applications: applicationSlice,
        updateProfile: updateProfileslice
    },
});

export default store;
