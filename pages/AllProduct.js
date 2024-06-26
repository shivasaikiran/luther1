import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import MyContext from '@/Context/myContext';
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToCart,deleteFromCart } from '@/redux/cartSlice';
import { addToWish, deleteFromWish } from "@/redux/wishSlice";
import { FaHeart } from 'react-icons/fa';

const AllProduct = () => {
    const router = useRouter();
    
    const { getAllProduct, loading } = useContext(MyContext);

    if (loading) {
        return <div>Loading...</div>;
    }
    const cartItems = useSelector((state) => state.cart);
    const wishItems = useSelector((state)=>state.wish);
    const dispatch = useDispatch();

    const addCart = (item) => {
        // console.log(item)
        dispatch(addToCart(item));
        toast.success("Add to cart")
    }

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Delete cart")
    }
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
    return (
        <div className="py-8">
            <div className="">
                <h1 className="mb-5 text-2xl font-semibold text-center">All Products</h1>
            </div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-5 mx-auto lg:px-0">
                    <div className="flex flex-wrap -m-4">
                        {getAllProduct.map((item, index) => {
                            const { id, title, price, productImageUrl } = item;
                            return (
                                <div key={index} className="w-full p-4 md:w-1/4">
                                    <div className="h-full overflow-hidden border border-gray-300 shadow-md cursor-pointer rounded-xl">
                                        <img
                                            onClick={() => {
                                                console.log(`Navigating to product with id: ${id}`);
                                                router.push(`/ProductInfo?id=${id}`);
                                            }}
                                            className="w-full lg:h-80 h-96"
                                            src={productImageUrl}
                                            alt="product"
                                        />
                                        <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                                <h2 className="text-xs font-medium tracking-widest text-gray-400 title-font">LUTHER</h2>
                                                <FaHeart
                                                    className={`cursor-pointer ${wishItems.some(p => p.id === id) ? 'text-red-500' : 'text-gray-500'}`}
                                                    onClick={() => {
                                                        wishItems.some(p => p.id === id) ? deleteWish(item) : addWish(item);
                                                    }}
                                                />
                                            </div>
                                            <h2 className="mb-1 text-xs font-medium tracking-widest text-gray-400 title-font">
                                                LUTHER
                                            </h2>
                                            <h1 className="mb-3 text-lg font-medium text-gray-900 title-font">
                                                {title.substring(0, 25)}
                                            </h1>
                                            <h1 className="mb-3 text-lg font-medium text-gray-900 title-font">
                                                ₹{price}
                                            </h1>
                                            <div
                                                className="flex justify-center ">
                                                {cartItems.some((p)=> p.id === item.id) 
                                                
                                                ?
                                                <button
                                                    onClick={() => deleteCart(item)}
                                                    className=" bg-red-700 hover:bg-pink-600 w-full text-white py-[4px] rounded-lg font-bold">
                                             delete from cart
                                                </button>

                                                : 

                                                <button
                                                    onClick={() => addCart(item)}
                                                    className=" bg-pink-500 hover:bg-pink-600 w-full text-white py-[4px] rounded-lg font-bold">
                                                add to cart
                                                </button>
                                            }
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                            
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AllProduct;
