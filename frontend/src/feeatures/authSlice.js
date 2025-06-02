import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   user: null,
   isLoading: false,
   error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
   reducers: {
      loginSuccess: (state, action) => {
         state.user = action.payload;
         state.isLoading = false;
         state.error = null;
      },

      logoutSuccess: (state) => {
         state.user = null;
         state.isLoading = false;
         state.error = null;
      },

      setLoading: (state, action) => {
         state.isLoading = action.payload;
      },
      setError: (state, action) => {
         state.error = action.payload;
         state.isLoading = false;
      },
   },
});

export const {loginSuccess, logoutSuccess, setError, setLoading} = authSlice.actions;

export default authSlice.reducer;