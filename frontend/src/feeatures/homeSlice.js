import { createSlice } from "@reduxjs/toolkit";

const homeSlice = createSlice({
   name: "home",
   initialState:{
      mainContent: 'posts'
   },
   reducers:{
      setMainContent: (state, action) => {
         state.mainContent = action.payload;
      },
      resetMainContent: (state) => {
         state.mainContent = 'posts';
      }
   }
})

export const {setMainContent, resetMainContent} = homeSlice.actions;

export default homeSlice.reducer;