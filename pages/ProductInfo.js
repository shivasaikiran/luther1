import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { fireDB, auth } from '@/Firebase/config';
import { addToCart, deleteFromCart } from '@/redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductInfo = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: ''
    });
    const [currentUser, setCurrentUser] = useState(null);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [activeTab, setActiveTab] = useState('description'); // State to manage active tab
    const [selectedImage, setSelectedImage] = useState(null); 
    const [reviews, setReviews] = useState([]);

    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                try {
                    const productRef = doc(fireDB, 'products', id);
                    const productDoc = await getDoc(productRef);

                    if (productDoc.exists()) {
                        setProduct({ ...productDoc.data(), id: productDoc.id });
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching product:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        // Example: Fetch related products (replace with your own logic)
        const fetchRelatedProducts = async () => {
            try {
                // Query related products based on some criteria (e.g., category or similarity)
                // Replace this with your actual logic to fetch related products
                const relatedProductsSnapshot = await collection(fireDB, 'products')
                    .where('category', '==', product.category) // Example: Fetch products in the same category
                    .limit(4) // Limit to 4 related products
                    .get();

                const relatedProductsData = relatedProductsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setRelatedProducts(relatedProductsData);
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        if (product) {
            fetchRelatedProducts();
        }
    }, [product]);
    useEffect(() => {
        const fetchReviews = async () => {
            if (product) {
                try {
                    const reviewsQuery = query(
                        collection(fireDB, 'reviews'),
                        where('productId', '==', product.id)
                    );
                    const reviewsSnapshot = await getDocs(reviewsQuery);

                    const reviewsData = reviewsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setReviews(reviewsData);
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                }
            }
        };

        fetchReviews();
    }, [product]);

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Deleted from cart");
    };

    const handleBuyNow = () => {
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
            handlePayNow();
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
            key_secret: 'kZW37IsHRvafxcQp1p8dPGun',
            amount: product.price * 100,
            currency: 'INR',
            name: 'LUTHER',
            description: 'Test Transaction',
            image: 'https://your-logo-url.com',
            handler: async function (response) {
                try {
                    const orderData = {
                        address: newAddress,
                        cartItems: [product],
                        totalAmount: product.price,
                        paymentId: response.razorpay_payment_id,
                        orderDate: new Date(),
                    };

                    const docRef = await addDoc(collection(fireDB, 'users', currentUser.uid, 'orders'), orderData);
                    console.log('Order document written with ID: ', docRef.id);

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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const reviewData = {
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Anonymous',
                productId: product.id,
                content: reviewContent,
                rating: reviewRating,
            };

            await addDoc(collection(fireDB, 'reviews'), reviewData);

            toast.success('Review submitted successfully!');
            setReviewContent('');
            setReviewRating(0);
            setReviews([...reviews, reviewData]); // Add new review to state
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review.');
        }
    };

    const handleStarClick = (rating) => {
        setReviewRating(rating);
    };

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const highestRating = reviews.length ? Math.max(...reviews.map(review => review.rating)) : 0;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    const StarIcon = ({ onClick, filled }) => (
        <svg
            onClick={onClick}
            className={`w-6 h-6 cursor-pointer ${filled ? 'text-yellow-500' : 'text-gray-300'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"
            ></path>
        </svg>
    );

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    return (
        <div className="container p-4 mx-auto">
            <div className="flex flex-col md:flex-row">
            <div className="flex flex-col md:w-1/3 md:mr-4">
                    <img src={selectedImage || product.productImageUrl} alt="Product Image" className="w-full h-auto mb-4 transition-transform duration-300 border-2 border-gray-300 hover:scale-105" />
                    <div className="grid grid-cols-4 gap-2">
                        {[product.productImageUrl, product.productImageUrl, product.productImageUrl, product.productImageUrl].map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-auto transition-transform duration-300 border-2 border-gray-300 cursor-pointer hover:scale-105"
                                onClick={() => handleImageClick(image)}
                            />
                        ))}
                    </div>
                </div>
                <div className="md:w-2/3">
                    <h1 className="mb-2 text-2xl font-bold">{product.title}</h1>
                    <p className="mt-2">
                            Rating: 
                            {highestRating ? (
                                `${highestRating} out of 5 stars`
                            ) : (
                                '(No customer reviews)'
                            )}
                        </p>
                    <div className="mb-2 text-2xl">
                        <span className="mr-2 line-through">₹{product.actualPrice}</span>
                        <span className="text-red-500">₹{product.price}</span>
                    </div>
                    <div className="p-4 mb-2">{showFullDescription ? product.description : `${product.description.substring(0, 200)}...`}</div>
                    <button
                        onClick={toggleDescription}
                        className="mb-2 text-blue-500"
                    >
                        {showFullDescription ? 'Read Less' : 'Read More'}
                    </button>
                    <div className="flex">
                        <button onClick={() => addCart(product)} className="px-4 py-2 mr-2 text-white bg-green-500 rounded">Add to Cart</button>
                        <button onClick={handleBuyNow} className="px-4 py-2 text-white bg-red-500 rounded">Buy Now</button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <ul className="flex p-4 border-b">
                    <li
                        className={`px-4 py-2 cursor-pointer ${activeTab === 'description' ? 'border-b-2 border-green-500' : ''}`}
                        onClick={() => handleTabClick('description')}
                    >
                        Description
                    </li>
                    <li
                        className={`px-4 py-2 cursor-pointer ${activeTab === 'reviews' ? 'border-b-2 border-green-500' : ''}`}
                        onClick={() => handleTabClick('reviews')}
                    >
                        Reviews
                    </li>
                    <li
                        className={`px-4 py-2 cursor-pointer ${activeTab === 'specifications' ? 'border-b-2 border-green-500' : ''}`}
                        onClick={() => handleTabClick('specifications')}
                    >
                        Specifications
                    </li>
                </ul>
                <div className="mt-4">
                    {activeTab === 'description' && (
                        <div>{product.description}</div>
                    )}
                    {activeTab === 'reviews' && (
                        
                        <>
                        <div className="mb-4 space-y-4">
                            {reviews.map((review, index) => (
                                <div key={index} className="p-4 border rounded shadow">
                                    <p className="font-semibold">{review.userName}</p>
                                    <div className="flex items-center mb-2">
                                        {Array.from({ length: 5 }).map((_, starIndex) => (
                                            <StarIcon key={starIndex} filled={starIndex < review.rating} />
                                        ))}
                                    </div>
                                    <p>{review.content}</p>
                                </div>
                            ))}
                        </div>

                        {currentUser ? (
                            <form onSubmit={handleReviewSubmit} className="p-4 border rounded shadow">
                                <h2 className="mb-2 text-lg font-semibold">Leave a Review</h2>
                                <div className="mb-2">
                                    <label className="block mb-1">Rating:</label>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <StarIcon key={index} filled={index < reviewRating} onClick={() => handleStarClick(index + 1)} />
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Review:</label>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        value={reviewContent}
                                        onChange={(e) => setReviewContent(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                    Submit Review
                                </button>
                            </form>
                        ) : (
                            <p className="text-red-500">Please log in to leave a review.</p>
                        )}
                    </>
                    )}
                    {activeTab === 'specifications' && (
                        <div>
                            {/* Add your specifications content here */}
                            <h2 className="mb-4 text-xl font-semibold">Specifications</h2>
                            <ul className="list-disc list-inside">
                                {product.specifications && product.specifications.map((spec, index) => (
                                    <li key={index}>{spec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">Related Products</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {relatedProducts.map((relatedProduct) => (
                        <div key={relatedProduct.id} className="p-4 border rounded-lg">
                            <img src={relatedProduct.productImageUrl} alt="Related Product Image" className="w-full h-auto mb-4" />
                            <h3 className="text-lg font-semibold">{relatedProduct.title}</h3>
                            <p className="mb-2 text-red-500">₹{relatedProduct.price}</p>
                            <button
                                onClick={() => addCart(relatedProduct)}
                                className="px-4 py-2 text-white bg-blue-500 rounded"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-4 bg-white rounded shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold">Enter Address</h2>
                        <form onSubmit={handleAddressSubmit}>
                            <div className="mb-2">
                                <label className="block mb-1 font-semibold">Street:</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={newAddress.street}
                                    onChange={handleAddressChange}
                                    className="w-full px-2 py-1 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 font-semibold">City:</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleAddressChange}
                                    className="w-full px-2 py-1 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 font-semibold">State:</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={newAddress.state}
                                    onChange={handleAddressChange}
                                    className="w-full px-2 py-1 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 font-semibold">Postal Code:</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={newAddress.postalCode}
                                    onChange={handleAddressChange}
                                    className="w-full px-2 py-1 border rounded"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
                            >
                                Save Address
                            </button>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-white bg-red-500 rounded"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default ProductInfo;
