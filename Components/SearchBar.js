import React, { useState, useEffect } from 'react';
import { fireDB } from '@/Firebase/config'; // Adjust the path to your Firebase configuration

const SearchProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchTerm.trim()) {
        setProducts([]);
        return;
      }

      try {
        const productsRef = collection(fireDB, 'products');
        const querySnapshot = await getDocs(query(productsRef, where('title', '>=', searchTerm)));

        if (querySnapshot.empty) {
          console.log('No matching documents.');
          setProducts([]);
          return;
        }

        let productsList = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });

        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        className="py-3 pl-4 pr-4 border-t border-b border-r h-[40px] w-[350px] rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Search for items..."
      />
      <div>
        {products.map(product => (
          <div key={product.id}>
            <p>{product.title}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProducts;
