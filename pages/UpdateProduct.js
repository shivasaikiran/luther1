import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fireDB } from "@/Firebase/config";
import Loader from "@/Components/Loader";
import myContext from "@/Context/myContext";

const categoryList = [
    { name: 'fashion' },
    { name: 'shirt' },
    { name: 'jacket' },
    { name: 'mobile' },
    { name: 'laptop' },
    { name: 'shoes' },
    { name: 'home' },
    { name: 'books' }
];

const UpdateProductPage = () => {
    const { loading, setLoading, } = useContext(myContext);
    const router = useRouter();
    const { id } = router.query;

    const [product, setProduct] = useState({
        title: "",
        price: "",
        productImageUrl: "",
        category: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
    });

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const docRef = doc(fireDB, 'products', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProduct(docSnap.data());
                    } else {
                        toast.error("No such product found");
                    }
                } catch (error) {
                    console.error("Error fetching product:", error);
                    toast.error("Failed to fetch product");
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, setLoading]);

    const updateProductFunction = async () => {
        if (!product.title || !product.price || !product.productImageUrl || !product.category || !product.description) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);
        try {
            const productRef = doc(fireDB, 'products', id);
            await updateDoc(productRef, product);
            toast.success("Product updated successfully");
            router.push('/AdminDashboard');
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            {loading && <Loader />}
            <div className="px-8 py-6 border border-pink-100 shadow-md login_Form bg-pink-50 rounded-xl">
                <div className="mb-5">
                    <h2 className="text-2xl font-bold text-center text-pink-500">Update Product</h2>
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={(e) => setProduct({ ...product, title: e.target.value })}
                        placeholder="Product Title"
                        className="px-2 py-2 text-pink-300 placeholder-pink-300 border border-pink-200 rounded-md outline-none bg-pink-50 w-96"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                        placeholder="Product Price"
                        className="px-2 py-2 text-pink-300 placeholder-pink-300 border border-pink-200 rounded-md outline-none bg-pink-50 w-96"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="productImageUrl"
                        value={product.productImageUrl}
                        onChange={(e) => setProduct({ ...product, productImageUrl: e.target.value })}
                        placeholder="Product Image Url"
                        className="px-2 py-2 text-pink-300 placeholder-pink-300 border border-pink-200 rounded-md outline-none bg-pink-50 w-96"
                    />
                </div>
                <div className="mb-3">
                    <select
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        className="w-full px-1 py-2 text-pink-300 border border-pink-200 rounded-md outline-none bg-pink-50"
                    >
                        <option disabled>Select Product Category</option>
                        {categoryList.map((value, index) => (
                            <option key={index} value={value.name}>{value.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <textarea
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        name="description"
                        placeholder="Product Description"
                        rows="5"
                        className="w-full px-2 py-1 text-pink-300 placeholder-pink-300 border border-pink-200 rounded-md outline-none bg-pink-50"
                    />
                </div>
                <div className="mb-3">
                    <button
                        onClick={updateProductFunction}
                        type="button"
                        className="w-full py-2 font-bold text-center text-white bg-pink-500 rounded-md hover:bg-pink-600"
                    >
                        Update Product
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UpdateProductPage;
