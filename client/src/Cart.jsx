import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeFromCart, updateItemQuantity } from './store/slices/globalSlice.js'; // Assuming the slice is in globalSlice.js
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';

function Cart() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.global.cartItems); // Get cart items from the Redux store
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            // No token found, redirect to login page
            navigate('/login');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }), // Pass token to backend
                });

                const data = await response.json();

                if (data.success) {
                    console.log('Token is valid', data.data.userId);
                } else {
                    console.error(data.message);
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        verifyToken();

    }, [navigate]);

    // Function to handle removing items from the cart
    const handleRemoveFromCart = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    // Function to handle updating item quantity
    const handleUpdateQuantity = (itemId, quantity) => {

        if (quantity == 0) {
            handleRemoveFromCart(itemId);
            return;
        }

        dispatch(updateItemQuantity({ id: itemId, quantity }));
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        createOrder(cartItems);
        dispatch(clearCart());
        navigate('/');
    }

    const createOrder = async (products) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in local storage');
            return;
        }

        const validProducts = [];  // Array to store valid products that exist or are created.

        try {
            // Step 1: Ensure all products exist and add valid ones to validProducts array
            for (const product of products) {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/product/${product.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                let existingProduct = null;

                if (response.status === 200) {
                    // If the product exists, push it to validProducts array with the quantity
                    existingProduct = await response.json();
                    validProducts.push({ id: existingProduct.data.id, quantity: product.quantity });
                } else {
                    // If the product doesn't exist, we create it without sending the `id`
                    const createResponse = await fetch(`${import.meta.env.VITE_API_URL}/product`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: product.name,
                            price: product.price,
                        })
                    });

                    if (createResponse.status === 201) {
                        const newProduct = await createResponse.json();
                        validProducts.push({ id: newProduct.data.id, quantity: product.quantity });
                    } else {
                        console.error(`Failed to create product with ID ${product.id}`);
                    }
                }
            }

            if (validProducts.length === 0) {
                console.error('No valid products to add to the order.');
                return;
            }

            console.log(JSON.stringify({
                products: validProducts
            }));

            // Step 2: Create the order with valid products' IDs
            const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/order`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    products: validProducts  // Send the list of product IDs and quantities
                })
            });

            if (orderResponse.status === 201) {
                const orderData = await orderResponse.json();
                console.log('Order created successfully:', orderData);
            } else {
                const errorData = await orderResponse.json();
                console.error('Failed to create order:', errorData);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="cart-page">
                <h1>Your Cart</h1>
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">${item.price}</span>
                                <div className="quantity-controls">
                                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <span className="item-quantity">{item.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <button
                                    className="remove-item"
                                    onClick={() => handleRemoveFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="cart-summary">
                        <h2>Total: ${getTotalPrice().toFixed(2)}</h2>
                        <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;