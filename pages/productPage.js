import React from 'react';

const ProductPage = () => {
  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col md:flex-row">
        <img src="path-to-your-product-image.jpg" alt="Product Image" className="w-full h-auto mb-4 md:w-1/3 md:mb-0 md:mr-4" />
        <div className="md:w-2/3">
          <h1 className="mb-2 text-2xl font-bold">Oppo</h1>
          <div className="mb-2">(No customer reviews)</div>
          <div className="mb-2 text-2xl">
            <span className="mr-2 line-through">₹30000.0</span>
            <span className="text-red-500">₹25000.0</span>
          </div>
          <div className="mb-2">Oppo latest new “Oppo” all series...</div>
          <div className="mb-4">
            <span>Available Options:</span>
            <div className="flex mt-2 space-x-2">
              <div className="w-6 h-6 bg-black border"></div>
              <div className="w-6 h-6 bg-red-500 border"></div>
              <div className="w-6 h-6 bg-yellow-500 border"></div>
            </div>
          </div>
          <div className="flex mb-4 space-x-4">
            <button className="px-4 py-2 text-white bg-blue-500 rounded">Add to Cart</button>
            <button className="px-4 py-2 text-white bg-red-500 rounded">Buy Now</button>
          </div>
          <div className="mb-4">
            <span className="mr-4">+ Add to Wishlist</span>
            <span>Categories: Mobile</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-600">Share on Facebook</a>
            <a href="#" className="text-blue-600">Share on Twitter</a>
            <a href="#" className="text-blue-600">Share on Google+</a>
            <a href="#" className="text-blue-600">Share on LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex mb-4 space-x-8">
          <button className="text-lg">Description</button>
          <button className="text-lg">Specification</button>
          <button className="text-lg">Reviews (1)</button>
        </div>
        <div className="p-4 border">
          <div className="mb-4">
            <p>1 Review For Donaca Eu Furniture</p>
            <div className="p-4 mb-4 border">
              <p>ADMIN – Jan 14, 2020</p>
              <p>Great product!</p>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Add A Review</h3>
            <form>
              <div className="mb-4">
                <span>Your Rating:</span>
                {/* Add your star rating component here */}
              </div>
              <div className="mb-4">
                <textarea className="w-full p-2 border" placeholder="Your Review"></textarea>
              </div>
              <div className="mb-4">
                <input type="text" className="w-full p-2 border" placeholder="Name" />
              </div>
              <div className="mb-4">
                <input type="email" className="w-full p-2 border" placeholder="Email" />
              </div>
              <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">Submit</button>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold">Related Products</h3>
        {/* Add related products component here */}
      </div>
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold">Upsell Products</h3>
        {/* Add upsell products component here */}
      </div>
    </div>
  );
};

export default ProductPage;
