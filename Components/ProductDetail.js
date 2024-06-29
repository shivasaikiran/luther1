import { useContext } from "react";
import Link from "next/link";
import myContext from "@/Context/myContext";
import Loader from "./Loader";

import 'react-toastify/dist/ReactToastify.css';
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
const ProductDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProduct, getAllProductFunction } = context;

    
    // console.log(getAllProduct)
    return (
        <div>
            <div className="flex items-center justify-between py-5">
                {/* text  */}
                <h1 className="text-xl font-bold text-pink-300 ">All Product</h1>
                {/* Add Product Button  */}
                <Link href='/AddProduct'>
                    <button className="px-5 py-2 border border-pink-100 rounded-lg bg-pink-50">Add Product</button>
                </Link>
            </div>

            {/* Loading  */}
            <div className="relative flex justify-center top-20">
                {loading && <Loader />}
            </div>

            {/* table  */}
            <div className="w-full mb-5 overflow-x-auto">

                <table className="w-full text-left text-pink-400 border border-collapse border-pink-100 sm:border-separate" >

                    <tbody>
                        <tr>
                            <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md first:border-l-0 text-slate-700 bg-slate-100 fontPara">S.No.</th>
                            <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md first:border-l-0 text-slate-700 bg-slate-100 fontPara">Image</th>
                            <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">Title</th>
                            <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">Price</th>
                            <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">Category</th>
                            <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100"> Date</th>
                          
                        </tr>
                        {getAllProduct.map((item, index) => {
                            const { id, title,discountPrice, category, date, productImageUrl } = item
                            return (
                                <tr key={index} className="text-pink-300">
                                    <td className="h-12 px-6 transition duration-300 border-t border-l border-pink-100 text-md first:border-l-0 stroke-slate-500 text-slate-500 ">
                                        {index + 1}.
                                    </td>
                                    <td className="h-12 px-6 transition duration-300 border-t border-l border-pink-100 text-md first:border-l-0 stroke-slate-500 text-slate-500 first-letter:uppercase ">
                                        <div className="flex justify-center">
                                            <img className="w-20 " src={productImageUrl} alt="product" />
                                        </div>
                                    </td>
                                    <td className="h-12 px-6 transition duration-300 border-t border-l border-pink-100 text-md first:border-l-0 stroke-slate-500 text-slate-500 first-letter:uppercase ">
                                        {title}
                                    </td>
                                    <td className="h-12 px-6 transition duration-300 border-t border-l border-pink-100 text-md first:border-l-0 stroke-slate-500 text-slate-500 first-letter:uppercase ">
                                        ₹{discountPrice}
                                    </td>
                                    <td className="h-12 px-6 transition duration-300 border-t border-l border-pink-100 text-md first:border-l-0 stroke-slate-500 text-slate-500 first-letter:uppercase ">
                                        {category}
                                    </td>
                                    <td className="h-12 px-6 transition duration-300 border-t border-l border-pink-100 text-md first:border-l-0 stroke-slate-500 text-slate-500 first-letter:uppercase ">
                                        {date}
                                    </td>
                                    
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductDetail;