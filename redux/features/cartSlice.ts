import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Extra, Size } from "@/app/generated/prisma/client";
import { json } from "stream/consumers";

export type CartItem = {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  quantity?: number;
  size?: Size;
  extras?: Extra[];
};
interface ICartState {
  items: CartItem[];
}

const initialCartState =
  typeof window !== "undefined" ? localStorage.getItem("cart") : null;

// const initialCartState = localStorage.getItem("cart");
const initialState: ICartState = {
  items: initialCartState ? JSON.parse(initialCartState) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const existItem = state.items.find((e) => e.id === action.payload.id);
      if (existItem) {
        existItem.quantity = (existItem.quantity || 0) + 1;
        existItem.size = action.payload.size;
        existItem.extras = action.payload.extras;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    removeItemFromCart: (state, action: PayloadAction<{ id: string }>) => {
      const existItem = state.items.find((e) => e.id === action.payload.id);
      if (existItem) {
        if (existItem.quantity === 1) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload.id,
          );
        } else {
          existItem.quantity = existItem.quantity! -= 1;
        }
      }
    },

    deleteSingleItemFromCart: (
      state,
      action: PayloadAction<{ id: string }>,
    ) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    deleteAllItemFromCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  deleteSingleItemFromCart,
  deleteAllItemFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items; //to use it insid componant useAppSelector(selectCartItems)
