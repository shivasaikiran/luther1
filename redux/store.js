import { configureStore } from '@reduxjs/toolkit' 
import cartSlice from './cartSlice'
import wishSlice from './wishSlice'

export const store = configureStore({
  reducer: {
    cart:cartSlice,
    wish:wishSlice
  },
})