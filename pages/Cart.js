import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash } from 'lucide-react';
import { decrementQuantity, incrementQuantity, deleteFromCart } from '@/redux/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { fireDB,auth } from '@/Firebase/config';// Adjust this import based on your Firebase setup

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart);
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
  const [userOrders, setUserOrders] = useState([]); // State to hold user orders
  const [paymentMethod, setPaymentMethod] = useState('online'); // State for selected payment method

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
    try {
      const ordersSnapshot = await getDocs(collection(fireDB, 'users', userId, 'orders'));
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserOrders(ordersData);
    } catch (error) {
      console.error('Error fetching user orders: ', error);
    }
  };

  // Calculate cart total whenever cartItems change
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartItems]);

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success('Item removed from cart');
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  const handleBuyNow = () => {
    if (cartItems.length > 0) {
      setIsModalOpen(true);
    } else {
      toast.error('Please add products to the cart first.');
    }
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
      if (paymentMethod === 'cod') {
        handleCodPayment();
      } else {
        handlePayNow();
      }
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
            cartItems,
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
      toast.error('User not authenticated. Please log in.');
      return;
    }

    try {
      const orderData = {
        address: newAddress,
        cartItems,
        totalAmount: cartTotal,
        paymentMethod: 'COD',
        orderDate: new Date(),
      };

      const docRef = await addDoc(collection(fireDB, 'users', currentUser.uid, 'orders'), orderData);
      console.log('Order document written with ID: ', docRef.id);

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error saving order: ', error);
      toast.error('Failed to place order.');
    }
  };

  return (
    <div className="container px-2 px-4 mx-auto max-w-7xl lg:px-0">
      <div className="max-w-2xl py-8 mx-auto lg:max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* Cart items section */}
          <section aria-labelledby="cart-heading" className="bg-white rounded-lg lg:col-span-8">
            {/* Cart items list */}
            <ul role="list" className="divide-y divide-gray-200">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item, index) => (
                    <div key={index} className="">
                      {/* Display cart item details */}
                      <li className="flex py-6 sm:py-6">
                        {/* Item image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.productImageUrl}
                            alt="Product"
                            className="object-contain object-center w-24 h-24 rounded-md sm:h-38 sm:w-38"
                          />
                        </div>
                        {/* Item details */}
                        <div className="flex flex-col justify-between flex-1 ml-4 sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                {/* Item title */}
                                <h3 className="text-sm">
                                  <div className="font-semibold text-black">{item.title}</div>
                                </h3>
                              </div>
                              {/* Item category */}
                              <div className="flex mt-1 text-sm">
                                <p className="text-sm text-gray-500">{item.category}</p>
                              </div>
                              {/* Item price */}
                              <div className="flex items-end mt-1">
                                <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      {/* Quantity controls and delete */}
                      <div className="flex mb-2">
                        {/* Quantity controls */}
                        <div className="flex min-w-24">
                          <button onClick={() => handleDecrement(item.id)} type="button" className="h-7 w-7">-</button>
                          <input
                            type="text"
                            className="mx-1 text-center border rounded-md h-7 w-9"
                            value={item.quantity}
                            readOnly
                          />
                          <button onClick={() => handleIncrement(item.id)} type="button" className="flex items-center justify-center h-7 w-7">+</button>
                        </div>
                        {/* Delete button */}
                        <div className="flex ml-6 text-sm">
                          <button onClick={() => deleteCart(item)} type="button" className="flex items-center px-2 py-1 pl-0 space-x-1">
                            <Trash size={12} className="text-red-500" />
                            <span className="text-xs font-medium text-red-500">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <h1>No items in the cart.</h1>
              )}
            </ul>
          </section>
          {/* Price summary section */}
          <section aria-labelledby="summary-heading" className="mt-16 bg-white rounded-md lg:col-span-4 lg:mt-0 lg:p-0">
            <h2 id="summary-heading" className="px-4 py-3 text-lg font-medium text-gray-900 border-b border-gray-200 sm:p-4">Price Details</h2>
            <div>
              <dl className="px-2 py-4 space-y-1">
                {/* Total items price */}
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-800">Price ({cartItems.length} item)</dt>
                  <dd className="text-sm font-medium text-gray-900">₹{cartTotal}</dd>
                </div>
                {/* Delivery charges */}
                <div className="flex items-center justify-between pt-2">
                  <dt className="text-sm text-gray-800">Delivery Charges</dt>
                  <dd className="text-sm font-medium text-gray-900">₹0</dd>
                </div>
              </dl>
            </div>
            {/* Total amount and Buy Now button */}
            <div className="px-4 py-3 space-y-4 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between pt-2">
                <dt className="text-base font-semibold text-gray-900">Total Amount</dt>
                <dd className="text-base font-semibold text-gray-900">₹{cartTotal}</dd>
              </div>
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full px-4 py-2 text-center text-white bg-green-500 border border-transparent rounded-md shadow-sm"
              >
                Buy Now
              </button>
            </div>
          </section>
        </form>
      </div>
      {/* Address modal */}
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
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-green-500">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="online">Online Payment</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded">
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
      {/* User orders section */}
      {currentUser && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Your Orders</h2>
          {userOrders.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {userOrders.map((order) => (
                <li key={order.id} className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Order ID: {order.id}</h3>
                  <p className="text-sm text-gray-600">Date: {order.orderDate.toDate().toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Total Amount: ₹{order.totalAmount}</p>
                  {/* Display other order details as needed */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      )}
      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default CartPage;
