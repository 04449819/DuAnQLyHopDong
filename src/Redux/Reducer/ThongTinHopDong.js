import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hopdong: {},
};

export const ThongTinHopDong = createSlice({
  name: "thongtinhopdong",
  initialState,
  reducers: {
    sethopdong: (state, action) => {
      state.hopdong = action.payload;
    },
  },
});

export const { sethopdong } = ThongTinHopDong.actions;
export default ThongTinHopDong.reducer;
