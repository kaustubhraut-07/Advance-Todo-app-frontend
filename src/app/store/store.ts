import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themslice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});
