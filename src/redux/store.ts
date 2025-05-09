import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './slice/cart';

const store = configureStore({
  reducer: {
    cartInfo: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
