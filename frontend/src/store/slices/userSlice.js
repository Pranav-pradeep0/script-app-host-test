import { createSlice } from '@reduxjs/toolkit';

const scriptSlice = createSlice({
  name: 'user',
  initialState: { isLoggedIn: false },
  reducers: {
    setLogin: (state, { payload }) => {
      return { ...state, isLoggedIn: payload };
    },
  },
});

export const { setLogin } = scriptSlice.actions;
export default scriptSlice.reducer;
