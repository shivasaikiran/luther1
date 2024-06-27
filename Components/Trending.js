import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import myContext from "@/Context/myContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "@/redux/cartSlice";
import { addToWish, deleteFromWish } from "@/redux/wishSlice";
import { FaHeart } from 'react-icons/fa';
import { collection, addDoc } from 'firebase/firestore';
import { fireDB,auth } from "@/Firebase/config";// Adjust this import based on your Firebase setup
import salestag from '../Components/images/salestag.jpg'
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { NextArrow,PrevArrow } from "@/Components/arrow"; // Import custom arrows

const Trending = () => {
    const router = useRouter();
    const { category } = router.query;
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const cartItems = useSelector((state) => state.cart);
    const wishItems = useSelector((state) => state.wish);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: ''
    });
    const [currentUser, setCurrentUser] = useState(null); // State to hold current user
    const [paymentMethod, setPaymentMethod] = useState('online'); // State for selected payment method
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch current user on component mount
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return unsubscribe; // Cleanup function
    }, []);

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (category) {
            // Filter products based on the selected category
            const filtered = getAllProduct.filter(product => product.category === category);
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(getAllProduct.slice(0, 8)); // Default to first 8 products
        }
    }, [category, getAllProduct]);

    // Effect to handle search functionality for both title and price
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults(filteredProducts);
        } else {
            const searchWords = searchTerm.toLowerCase().split(/\s+/);
            const results = filteredProducts.filter(product =>
                searchWords.every(word =>
                    product.title.toLowerCase().includes(word) ||
                    product.price.toString().includes(word)
                )
            );
            setSearchResults(results);
        }
    }, [searchTerm, filteredProducts]);

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart");
    };

    const addWish = (item) => {
        dispatch(addToWish(item));
        toast.success("Added to wishlist");
    };

    const deleteWish = (item) => {
        dispatch(deleteFromWish(item));
        toast.success("Removed from wishlist");
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        localStorage.setItem('wish', JSON.stringify(wishItems)); // Store wishlist in localStorage
    }, [cartItems, wishItems]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBuyNow = (product) => {
        setSelectedProduct(product);
        setCartTotal(product.price);
        setIsModalOpen(true);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prevAddress => ({
            ...prevAddress,
            [name]: value
        }));
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            toast.success('Address saved!');
            setIsModalOpen(false);
            if (paymentMethod === 'cod') {
                handleCodPayment();
            } else {
                handlePayNow();
            }
        } catch (error) {
            console.error('Error saving address: ', error);
            toast.error('Failed to save address.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handlePayNow = () => {
        if (!currentUser) {
            toast.error('User not authenticated. Please log in.');
            return;
        }

        const options = {
            key: 'rzp_test_XQAiFEWVMKv0M6',
            key_secret: 'kZW37IsHRvafxcQp1p8dPGun', // Replace with your Razorpay key
            amount: cartTotal * 100, // Convert amount to paisa
            currency: 'INR',
            name: 'LUTHER',
            description: 'Test Transaction',
            image: 'https://your-logo-url.com', // Replace with your logo url
            handler: async function (response) {
                // Handle successful payment here
                try {
                    const orderData = {
                        address: newAddress,
                        cartItems: [selectedProduct],
                        totalAmount: cartTotal,
                        paymentMethod: 'Online',
                        paymentId: response.razorpay_payment_id,
                        orderDate: new Date(),
                    };

                    const docRef = await addDoc(collection(fireDB, 'users', currentUser.uid, 'orders'), orderData);
                    console.log('Order document written with ID: ', docRef.id);

                    // Optionally, update local state or dispatch an action to update Redux store

                    toast.success('Payment successful and order saved!');
                } catch (error) {
                    console.error('Error saving order: ', error);
                    toast.error('Failed to save order.');
                }
            },
            prefill: {
                name: currentUser.displayName || 'Your Customer Name',
                email: currentUser.email || 'customer-email@example.com',
                contact: currentUser.phoneNumber || '9347168384'
            },
            notes: {
                address: 'Your Company Address'
            },
            theme: {
                color: '#3399cc'
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleCodPayment = async () => {
        if (!currentUser) {
            toast.error('User not authenticated. Please log in.');
            return;
        }

        try {
            const orderData = {
                address: newAddress,
                cartItems: [selectedProduct],
                totalAmount: cartTotal,
                paymentMethod: 'COD',
                orderDate: new Date(),
            };

            const docRef = await addDoc(collection(fireDB, 'users', currentUser.uid, 'orders'), orderData);
            console.log('Order document written with ID: ', docRef.id);

            toast.success('Order placed successfully!');
        } catch (error) {
            console.error('Error saving order: ', error);
            toast.error('Failed to place order.');
        }
    };

    // Slider settings
    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 2,
        className: "slider", // Add a className for styling
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 2,
                    infinite: true,
                    arrows:true,
                    dots:false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
    };

    return (
        <div className="relative bottom-8">
            {/* Search Input */}
          

            {/* Heading */}
            <div className="pl-14">
                <h1 className="pl-2 mb-4 text-2xl font-semibold border-l-[3px]  border-black border-solid text-black">Trending Products</h1>
            </div>

            {/* Main */}
            <section className="text-gray-600 body-font">
                <div className="container py-6 px-14">
                    <Slider {...settings}>
                        {searchResults.map((item, index) => {
                            const { id, title, actualPrice, price, discountPercent, productImageUrl, salePrice } = item;
                            return (
                                <div key={index}  className="  h-[290px] w-[200px] border  border-gray-300 shadow-md cursor-pointer rounded-xl hover:shadow-green-800  ">
                                    <img
                                        onClick={() => {
                                            console.log(`Navigating to product with id: ${id}`);
                                            router.push(`/ProductInfo?id=${id}`);
                                        }}
                                        className="relative left-[14px] top-[10px] w-[200px] h-[160px] bg-[#f7f8f9]"
                                        src={productImageUrl}
                                        alt="product"
                                    />
                                    <Image src={salestag} className="z-50 relative bottom-[160px] left-[195px] rounded-tr-lg " />
                                    <span className="z-50 font-bold text-sm relative bottom-[206px] left-[198px] text-white">
                                        {discountPercent}% <br />
                                        OFF
                                    </span>
                                    <h2 className="z-50 mb-4 text-xs font-bold tracking-widest text-green-500 relative bottom-[228px] left-[25px]">LUTHER</h2>

                                    <div className="relative flex flex-col justify-between flex-1 p-4 bottom-4">
                                        <div>
                                            <div className="flex items-center justify-between mt-4 mb-[-10px] relative bottom-[117px] left-[179px]">
                                                <FaHeart
                                                    className={`cursor-pointer ${wishItems.some(p => p.id === id) ? 'text-red-500' : 'text-green-500'}`}
                                                    onClick={() => {
                                                        wishItems.some(p => p.id === id) ? deleteWish(item) : addWish(item);
                                                    }}
                                                />
                                            </div>
                                            <h1 className="relative bottom-[120px]  mb-2 text-sm font-bold text-center text-gray-900">
                                                {title.substring(0, 25)}
                                            </h1>
                                            <h1 className="mb-2 text-sm font-bold text-gray-900  relative bottom-[115px] left-[60px] ">
                                                ₹{price} <span className="pl-2 font-semibold text-gray-400 line-through "> ₹{actualPrice} </span>
                                            </h1>
                                        </div>
                                        <div className="relative bottom-[110px] flex justify-center space-x-2">
                                            <button
                                                onClick={() => addCart(item)}
                                                className="flex-1 py-2 text-xs font-bold text-white bg-green-500 rounded-lg hover:bg-green-600"
                                            >
                                                Add to cart
                                            </button>
                                            <button
                                                className="flex-1 py-2 text-xs font-bold text-white bg-red-400 border-0 rounded-md hover:bg-red-700"
                                                onClick={() => handleBuyNow(item)}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                </div>
            </section>

            {/* Buy Now Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-2xl font-bold">Enter Shipping Address</h2>
                        <form onSubmit={handleAddressSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Street</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={newAddress.street}
                                    onChange={handleAddressChange}
                                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleAddressChange}
                                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={newAddress.state}
                                    onChange={handleAddressChange}
                                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={newAddress.postalCode}
                                    onChange={handleAddressChange}
                                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <div className="flex mt-2">
                                    <label className="inline-flex items-center mr-6">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">Online Payment</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">Cash on Delivery</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Trending;
