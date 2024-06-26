import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
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
            // Example: Save review to Firestore (replace with your logic)
            const reviewData = {
                userId: currentUser.uid,
                productId: product.id,
                content: reviewContent,
                rating: reviewRating, // Include rating in review data
                // Add additional fields like timestamp, etc. as needed
            };

            // Example: Save review to Firestore
            await addDoc(collection(fireDB, 'reviews'), reviewData);

            toast.success('Review submitted successfully!');
            setReviewContent('');
            setReviewRating(0); // Reset rating after submission
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
    return (
        <section className="py-5 lg:py-16 font-poppins dark:bg-gray-800">
            <div className="max-w-6xl px-4 mx-auto">
                <div className="flex flex-wrap mb-24 -mx-4">
                    <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
                        <div className="image-zoom-container">
                            <img
                                className="w-full lg:h-[39em] rounded-lg image-zoom"
                                src={product.productImageUrl}
                                alt={product.title}
                            />
                        </div>
                    </div>
                    <div className="w-full px-4 md:w-1/2">
                        <div className="lg:pl-20">
                            <div className="mb-6">
                                <h2 className="max-w-xl mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
                                    {product.title}
                                </h2>
                                <div className="flex flex-wrap items-center mb-6">
                                    {/* Star ratings or other elements */}
                                </div>
                                <p className="inline-block text-2xl font-semibold text-gray-700 dark:text-gray-400">
                                    <span>₹{product.price}</span>
                                </p>
                            </div>
                           
                            <div className="flex flex-wrap items-center mb-6">
                                {cartItems.some((p) => p.id === product.id) ? (
                                    <button
                                        onClick={() => deleteCart(product)}
                                        className="w-full px-4 py-3 text-center text-white bg-red-500 border border-gray-600 hover:bg-red-600 hover:text-gray-100 rounded-xl"
                                    >
                                        Delete from Cart
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => addCart(product)}
                                        className="w-full px-4 py-3 text-center text-pink-600 bg-pink-100 border border-pink-600 hover:bg-pink-600 hover:text-gray-100 rounded-xl"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full px-4 py-3 text-center text-gray-100 bg-pink-600 border border-transparent dark:border-gray-700 hover:border-pink-500 hover:text-pink-700 hover:bg-pink-100 rounded-xl"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                                <div className="flex mb-4 space-x-4">
                                    <button
                                        onClick={() => handleTabClick('description')}
                                        className={`text-lg font-semibold ${
                                            activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                                        } cursor-pointer`}
                                    >
                                        Description
                                    </button>
                                    <button
                                        onClick={() => handleTabClick('reviews')}
                                        className={`text-lg font-semibold ${
                                            activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                                        } cursor-pointer`}
                                    >
                                        Reviews
                                    </button>
                                    <button
                                        onClick={() => handleTabClick('specifications')}
                                        className={`text-lg font-semibold ${
                                            activeTab === 'specifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                                        } cursor-pointer`}
                                    >
                                        Specifications
                                    </button>
                                </div>
                                <div className="mb-6">
                                    {activeTab === 'description' && (
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {showFullDescription ? product.description : `${product.description.substring(0, 200)}...`}
                                            </p>
                                            <button
                                                onClick={toggleDescription}
                                                className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {showFullDescription ? 'Show less' : 'Show more'}
                                            </button>
                                        </div>
                                    )}
                                    {activeTab === 'reviews' && (
                                        <div>
                                            {/* Display reviews */}
                                            <h3 className="mb-2 text-lg font-semibold">Reviews</h3>
                                            {/* Example: List reviews from state or API */}
                                            {/* Replace with your actual review display logic */}
                                            <ul>
                                                <li>Review 1</li>
                                                <li>Review 2</li>
                                                {/* Iterate over reviews and display */}
                                            </ul>
                                            {/* Add review form */}
                                            <form onSubmit={handleReviewSubmit}>
                                    <textarea
                                        value={reviewContent}
                                        onChange={(e) => setReviewContent(e.target.value)}
                                        className="w-full p-2 mb-2 border rounded"
                                        placeholder="Write your review..."
                                        rows="4"
                                        required
                                    ></textarea>
                                    <div className="flex items-center mb-2">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                onClick={() => handleStarClick(rating)}
                                                filled={rating <= reviewRating}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        Submit Review
                                    </button>
                                </form>
                                        </div>
                                    )}
                                    {activeTab === 'specifications' && (
                                        <div>
                                            {/* Display specifications */}
                                            <h3 className="mb-2 text-lg font-semibold">Specifications</h3>
                                            {/* Example: List specifications */}
                                            <ul>
                                                <li>Specification 1</li>
                                                <li>Specification 2</li>
                                                {/* Iterate over specifications and display */}
                                            </ul>
                                            {/* Add your specific display logic here */}
                                        </div>
                                    )}
                                </div>
                            </div>
                <div className="mb-6">
                    <h2 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400">Related Products:</h2>
                    <div className="flex flex-wrap -mx-4">
                        {relatedProducts.map((relatedProduct) => (
                            <div key={relatedProduct.id} className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
                                <div className="image-zoom-container">
                                    <img
                                        className="w-full lg:h-[39em] rounded-lg image-zoom"
                                        src={relatedProduct.productImageUrl}
                                        alt={relatedProduct.title}
                                    />
                                </div>
                                <h3 className="mt-2 text-lg font-semibold">{relatedProduct.title}</h3>
                                <p className="text-gray-700">₹{relatedProduct.price}</p>
                                <button
                                    onClick={() => router.push(`/product/${relatedProduct.id}`)}
                                    className="px-4 py-2 mt-2 text-white bg-pink-600 rounded hover:bg-pink-700"
                                >
                                    View Product
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="p-6 bg-white rounded shadow-lg w-[100vh]">
                        <h2 className="mb-4 text-2xl">Enter Address</h2>
                        <form onSubmit={handleAddressSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-green-500">Street</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={newAddress.street}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter your street"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-green-500">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-green-500">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={newAddress.state}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter your state"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-green-500">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={newAddress.postalCode}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter your postal code"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 mr-2 text-gray-500 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-green-500 rounded"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer />
        </section>
    );
};

export default ProductInfo;
