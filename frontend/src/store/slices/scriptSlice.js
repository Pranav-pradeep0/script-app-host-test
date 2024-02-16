import { createSlice } from '@reduxjs/toolkit';

const scriptSlice = createSlice({
  name: 'scripts',
  initialState: { characters: [] },
  reducers: {
    setCharacters: (state, { payload }) => {
      return { ...state, characters: payload };
    },
  },
});

export const { setCharacters } = scriptSlice.actions;
export default scriptSlice.reducer;
