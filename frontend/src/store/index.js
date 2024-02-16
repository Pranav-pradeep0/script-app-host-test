import { configureStore } from '@reduxjs/toolkit';

import scriptSlice from './slices/scriptSlice';
import userSlice from './slices/userSlice';

const store = configureStore({
  reducer: { scripts: scriptSlice, user: userSlice },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
