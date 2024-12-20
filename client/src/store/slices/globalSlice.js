import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    token: null,
    checkTokenLoading: true,
    cartItems: [] // This will store the cart items
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setCheckTokenLoading: (state, action) => {
            state.checkTokenLoading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        // Add item to the cart
        addToCart: (state, action) => {
            const item = action.payload;
            const newCartItem = {
                id: item.id,
                name: item.title,
                price: item.price.toFixed(2),
                quantity: 1
            }
            const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id);

            if (existingItem) {
                // If item exists, increase the quantity
                existingItem.quantity += 1;
            } else {
                // Otherwise, add the new item to the cart
                state.cartItems.push(newCartItem);
            }
        },
        // Remove item from the cart by id q
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
        },
        // Update item quantity in the cart
        updateItemQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find(cartItem => cartItem.id === id);
            if (item) {
                item.quantity = quantity;
            }
        },
        // Clear the cart
        clearCart: (state) => {
            state.cartItems = [];
        }
    }
});

export const {
    setCheckTokenLoading,
    setLoggedIn,
    setToken,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart
} = globalSlice.actions;

export default globalSlice.reducer;