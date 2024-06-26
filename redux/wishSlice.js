import { createSlice } from '@reduxjs/toolkit';

const wishSlice = createSlice({
  name: 'wish',
  initialState: [],
  reducers: {
    addToWish: (state, action) => {
      const item = action.payload;
      if (!state.some(wishItem => wishItem.id === item.id)) {
        state.push({ ...item, quantity: 1 });
      }
    },
    deleteFromWish: (state, action) => {
      const itemId = action.payload.id;
      return state.filter(wishItem => wishItem.id !== itemId);
    },
    incrementQuantity: (state, action) => {
      const item = state.find(wishItem => wishItem.id === action.payload);
      if (item) {
        item.quantity++;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.find(wishItem => wishItem.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    }
  }
});

export const { addToWish, deleteFromWish, incrementQuantity, decrementQuantity } = wishSlice.actions;

export default wishSlice.reducer;
