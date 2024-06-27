import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { fireDB, auth } from '@/Firebase/config'; // Ensure auth is imported correctly
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressIndicator from '@/Components/ProgressIndicator';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const [currentUser, setCurrentUser] = useState(null); // State to hold current user
  const [userOrders, setUserOrders] = useState([]); // State to hold user orders

  // Fetch current user on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        fetchUserOrders(user.uid); // Fetch orders for the current user
      } else {
        setCurrentUser(null);
        setUserOrders([]); // Clear user orders when no user is logged in
      }
    });

    return unsubscribe; // Cleanup function
  }, []);

  // Fetch user orders from Firestore
  const fetchUserOrders = async (userId) => {
    setLoading(true); // Set loading state to true when fetching data
    try {
      const ordersSnapshot = await getDocs(collection(fireDB, 'users', userId, 'orders'));
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserOrders(ordersData);
    } catch (error) {
      console.error('Error fetching user orders: ', error);
    } finally {
      setLoading(false); // Set loading state to false after fetching data
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prevAddress => ({
      ...prevAddress,
      [name]: value
    }));
  };

  const handleEditAddress = (order) => {
    setCurrentOrder(order);
    setNewAddress(order.address);
    setIsModalOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderRef = doc(fireDB, 'users', currentUser.uid, 'orders', currentOrder.id);
      await updateDoc(orderRef, {
        address: newAddress
      });

      setUserOrders(userOrders.map(order => order.id === currentOrder.id ? { ...order, address: newAddress } : order));
      toast.success('Address updated successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating address: ', error);
      toast.error('Failed to update address.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container px-4 mx-auto max-w-7xl lg:px-0">
      <div className="max-w-2xl py-8 mx-auto lg:max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Orders</h1>
        {userOrders.length > 0 ? (
          userOrders.map(order => (
            <div key={order.id} className="p-4 mt-6 bg-red-100 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
              <p className="text-sm text-gray-600">Order Date: {order.orderDate ? new Date(order.orderDate.toDate ? order.orderDate.toDate() : order.orderDate).toLocaleDateString() : 'N/A'}</p>
              <p className="text-sm text-gray-600">Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate.toDate ? order.deliveryDate.toDate() : order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Address:</h3>
                <p>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.postalCode}</p>
                <button
                  onClick={() => handleEditAddress(order)}
                  className="px-4 py-2 mt-2 text-white bg-green-500 border border-transparent rounded-md shadow-sm"
                >
                  Edit Address
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Items:</h3>
                <ul>
                  {order.cartItems.map((item, index) => (
                    <li key={index} className="py-2 border-b">
                      <div className="flex items-center">
                        <img
                          src={item.productImageUrl}
                          alt={item.title}
                          className="object-contain object-center w-16 h-16 rounded-md"
                        />
                        <div className="ml-4">
                          <h4 className="text-sm font-semibold">{item.title}</h4>
                          <p className="text-sm text-gray-500">{item.category}</p>
                          <p className="text-sm">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">Price: ₹{item.price}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Total Amount:</h3>
                <p className="text-xl font-semibold">₹{order.totalAmount}</p>
              </div>
              <div className="mt-4">
                <ProgressIndicator status={order.status} />
              </div>
            </div>
          ))
        ) : (
          <p className="mt-4 text-lg">No orders found.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="p-6 bg-white rounded shadow-lg w-[100vh]">
            <h2 className="mb-4 text-2xl">Edit Address</h2>
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
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded">
                  Submit
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

export default Order;
