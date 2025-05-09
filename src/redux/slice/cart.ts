import { notification } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type CartItem = {
  productId: number;
  productName: string;
  productSlug: string;
  price: number;
  qty: number;
  image: string;
};

type CartState = CartItem[];

const initialState: CartState = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCartItem: (state, action: PayloadAction<CartItem>) => {
            const index = state.findIndex(item => item.productId === action.payload.productId);
            
            if (index !== -1) {
                state[index] = {
                ...state[index],
                qty: state[index].qty + action.payload.qty,
                };
            } else {
                state.push(action.payload);
            }
        },

        increaseCartItemQty: (state, action: PayloadAction<{ productId: number; qty: number }>) => {
            const { productId, qty } = action.payload;
            const index = state.findIndex(item => item.productId === productId);
          
            if (index !== -1) {
              state[index] = {
                ...state[index],
                qty: state[index].qty + qty,
              }
            }
        },

        decreaseCartItemQty: (state, action: PayloadAction<{ productId: number; qty: number }>) => {
            const { productId, qty } = action.payload;
            const index = state.findIndex(item => item.productId === productId);
          
            if (index !== -1) {
              const newQty = state[index].qty - qty;
          
              if (newQty > 0) {
                state[index].qty = newQty;
              } else {
                notification.warning({
                    message:"ຈຳນວນສຸດທ້າຍແລ້ວ",
                    description:"ເປັນຈຳນວນທີ່ເຫຼືອສຸດທ້າຍແລ້ວ. ກົດລົບອອກຖ້າຫາກວ່າບໍ່ຕ້ອງການແລ້ວ1"
                })
              }
            }
        },

        removeCartItem: (state, action: PayloadAction<number>) => {
            return state.filter(item => item.productId !== action.payload);
        },

        resetCart: () => initialState,
    },
});

export const { addCartItem,increaseCartItemQty,decreaseCartItemQty, removeCartItem, resetCart } = cartSlice.actions;
export const cartState = (state: RootState) => state.cartInfo;

export default cartSlice.reducer;