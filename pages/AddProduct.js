import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { fireDB } from "@/Firebase/config"; // Assuming 'fireDB' is your Firestore instance
import Loader from "@/Components/Loader";
import myContext from "@/Context/myContext";

const categoryList = [
    { name: 'Herbal Juices' },
    { name: 'Capsules' },
    { name: 'Vinegar' },
    { name: 'Drops' },
    { name: 'Salts' },
];

const AddProductPage = () => {
    const { loading, setLoading } = useContext(myContext);
    const router = useRouter();

    const [product, setProduct] = useState({
        title: "",
        actualPrice: "",
        price: "",
        discountPercent: 0,
        productImageUrl: "",
        category: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    });

    const calculateDiscountPercent = (actualPrice, discountPrice) => {
        if (!actualPrice || !discountPrice) return 0;
        return ((actualPrice - discountPrice) / actualPrice) * 100;
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => {
            const updatedProduct = { ...prevProduct, [name]: value };
            if (name === "actualPrice" || name === "discountPrice") {
                const discountPercent = calculateDiscountPercent(
                    updatedProduct.actualPrice,
                    updatedProduct.discountPrice
                );
                return { ...updatedProduct, discountPercent: discountPercent.toFixed(2) };
            }
            return updatedProduct;
        });
    };

    const addProductFunction = async () => {
        if (!product.title || !product.actualPrice || !product.discountPrice || !product.productImageUrl || !product.category || !product.description) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);

        try {
            const productRef = collection(fireDB, 'products');
            const docData = { ...product };

            await addDoc(productRef, docData);
            toast.success("Product added successfully");
            router.push('/AdminDashboard');
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            {loading && <Loader />}
            <div className="px-8 py-6 border border-pink-100 shadow-md login_Form bg-pink-50 rounded-xl">
                <div className="mb-5">
                    <h2 className="text-2xl font-bold text-center text-pink-500">Add Product</h2>
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
                        name="actualPrice"
                        value={product.actualPrice}
                        onChange={handlePriceChange}
                        placeholder="Actual Price"
                        className="px-2 py-2 text-pink-300 placeholder-pink-300 border border-pink-200 rounded-md outline-none bg-pink-50 w-96"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        name="discountPrice"
                        value={product.price}
                        onChange={handlePriceChange}
                        placeholder="Discount Price"
                        className="px-2 py-2 text-pink-300 placeholder-pink-300 border border-pink-200 rounded-md outline-none bg-pink-50 w-96"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        name="discountPercent"
                        value={product.discountPercent}
                        readOnly
                        placeholder="Discount Percent"
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
                        onClick={addProductFunction}
                        type="button"
                        className="w-full py-2 font-bold text-center text-white bg-pink-500 rounded-md hover:bg-pink-600"
                    >
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;
