import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import myContext from "@/Context/myContext";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "@/redux/cartSlice";
import { addToWish, deleteFromWish } from "@/redux/wishSlice";
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import { collection, addDoc } from 'firebase/firestore';
import { fireDB, auth } from '@/Firebase/config'; // Adjust this import based on your Firebase setup
import salestag from '../Components/images/salestag.jpg'
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { NextArrow, PrevArrow } from "@/Components/arrow"; // Import custom arrows

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

    useEffect(() => {
        const total = cartItems.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
        setCartTotal(total);
    }, [cartItems]);

    const addCart = (item) => {
        dispatch(addToCart({ ...item, quantity: 1 }));
        // toast.success("Added to cart");
    };

    const addWish = (item) => {
        dispatch(addToWish(item));
        // toast.success("Added to wishlist");
    };

    const deleteWish = (item) => {
        dispatch(deleteFromWish(item));
        // toast.success("Removed from wishlist");
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
        setCartTotal(product.discountPrice);
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
            // toast.success('Address saved!');
            setIsModalOpen(false);
            if (paymentMethod === 'cod') {
                handleCodPayment();
            } else {
                handlePayNow();
            }
        } catch (error) {
            console.error('Error saving address: ', error);
            // toast.error('Failed to save address.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handlePayNow = () => {
        if (!currentUser) {
            // toast.error('User not authenticated. Please log in.');
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
            // toast.error('User not authenticated. Please log in.');
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

            // toast.success('Order placed successfully!');
        } catch (error) {
            console.error('Error saving order: ', error);
            // toast.error('Failed to place order.');
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
                    arrows: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows:false,
                    infinite: true,
                    autoplay: true,
                    autoplaySpeed: 2000, 
                }
            }
        ],
    };

    return (
        <div className="lg:mt-[-130px] mt-[-220px]">
            {/* Search Input */}

            {/* Heading */}
            <div className="pl-4 lg:pl-14">
                <h1 className="pl-2 text-2xl font-semibold border-l-[3px] border-black border-solid text-black">Trending Products</h1>
            </div>

            {/* Main */}
            <section className="text-gray-600 body-font">
                <div className="px-6 py-8 lg:px-14">
                    <Slider {...settings}>
                        {searchResults.map((item, index) => {
                            const { id, title, actualPrice,price, discountPrice, discountPercent, productImageUrl } = item;
                            const isWished = wishItems.some(wishItem => wishItem.id === item.id);
                            return (
                                <div key={index} className="  border-gray-300 shadow-md cursor-pointer rounded-xl hover:shadow-green-800 relative w-3/5 lg:p-2 p-2 lg:h-[290px] mx-0 mb-10 bg-gray-100  h-[200px]">
                                    <a className="block relative h-[230px] rounded overflow-hidden">
                                        <img
                                            onClick={() => {
                                                console.log(`Navigating to product with id: ${id}`);
                                                router.push(`/ProductInfo?id=${id}`);
                                            }}
                                            alt="ecommerce"
                                             className="relative lg:left-[12px] top-[10px] w-[200px] lg:h-[150px] h-[115px] bg-[#f7f8f9]"
                                            src={productImageUrl}
                                            // width={300}
                                            // height={200}
                                        />
                                    </a>
                                    <div>
                                    <Image src={salestag} className="z-50 relative lg:bottom-[237px] lg:left-[190px] rounded-tr-lg left-[122px] bottom-[238px] " />
                                    <span className="z-50 font-bold lg:text-sm relative lg:bottom-[285px] lg:left-[195px] text-white left-[130px] text-xs bottom-[287px]">
                                        {discountPercent}% <br />
                                        OFF
                                    </span>
                                    <h2 className="z-50 mb-4 lg:text-xs font-bold tracking-widest text-green-500 relative bottom-[311px] lg:left-[25px] left-[8px] text-[9px]">LUTHER</h2>
                                    </div>
                                  
                                    <div className="relative flex flex-col justify-between flex-1 p-4 bottom-[100px] lg:left-0 left-2">
                                        <div>
                                            <div className="flex items-center justify-between mt-4 mb-[-10px] relative lg:bottom-[110px] lg:left-[165px] bottom-[180px] left-[112px]">
                                                <FaHeart
                                                    className={`cursor-pointer ${wishItems.some(p => p.id === id) ? 'text-red-500' : 'text-green-500'}`}
                                                    onClick={() => {
                                                        wishItems.some(p => p.id === id) ? deleteWish(item) : addWish(item);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between mt-4 mb-[-10px] relative lg:bottom-[110px] lg:left-[165px] bottom-[200px] left-[-15px]">
                                                <FaShoppingBag
                                                className="text-green-500 lg:hidden"
                                                 onClick={() => addCart(item)}
                                                />
                                            </div>
                                            <h1 className="relative lg:bottom-[120px] lg:w-[160px] lg:right-0 right-[13px]  mb-2 lg:mt-0 mt-2 lg:text-sm font-bold text-center bottom-[195px] text-gray-900 text-[10px] w-[120px]">
                                                {title.substring(0, 25)}
                                            </h1>
                                            <h1 className="lg:mb-2 lg:text-sm font-bold text-gray-900   relative lg:bottom-[115px] lg:left-[60px] text-[10px] bottom-[200px] left-[19px] ">
                                                ₹{price} <span className="pl-2 font-semibold text-gray-400 line-through "> ₹{actualPrice} </span>
                                            </h1>
                                        </div>
                                        <div className="relative lg:bottom-[110px] flex justify-center space-x-2 bottom-[150px] lg:right-0 right-5">
                                            <button
                                                onClick={() => addCart(item)}
                                                className="flex-1 hidden py-2 text-xs font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 sm:block"
                                            >
                                                Add to cart
                                            </button>
                                            {/* <button
                                                onClick={() => addCart(item)}
                                                className="flex-1 py-2 text-[15px] font-bold text-green-500 lg:hidden  "
                                            >
                                                <FaShoppingBag/>
                                            </button> */}
                                            <button
                                                className="flex-1 py-2 text-xs font-bold text-white bg-red-400 border-0 rounded-md hover:bg-red-700 hidden sm:block ]"
                                                onClick={() => handleBuyNow(item)}
                                            >
                                                Buy Now
                                            </button>
                                           
                                        </div>
                                        <button
                                                className="flex-1 py-2 text-[7px] font-bold text-white bg-red-400 border-0 rounded-md hover:bg-red-700 lg:hidden w-[140px]  relative bottom-[197px] left-[-20px] ]"
                                                onClick={() => handleBuyNow(item)}
                                            >
                                                Buy Now
                                            </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                       
                                        {/* <div className="absolute top-2 right-2">
                                            <FaHeart
                                                className={`text-2xl cursor-pointer ${isWished ? 'text-red-500' : 'text-gray-300'}`}
                                                onClick={() => {
                                                    if (isWished) {
                                                        deleteWish(item);
                                                    } else {
                                                        addWish(item);
                                                    }
                                                }}
                                            />
                                        </div> */}
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                </div>
            </section>
        </div>
    );
};

export default Trending;
