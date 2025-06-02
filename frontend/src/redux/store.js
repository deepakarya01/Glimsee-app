import {configureStore} from "@reduxjs/toolkit"

import authReducer from '../feeatures/authSlice';
import homeReducer from '../feeatures/homeSlice'

export const store = configureStore({
   reducer: {
      auth: authReducer,
      home: homeReducer,
   },
});
