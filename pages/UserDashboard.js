import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { fireDB, auth } from '@/Firebase/Config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressIndicator from '@/Components/ProgressIndicator';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [reference, setReference] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentOrderToCancel, setCurrentOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        fetchUserOrders(user.uid);
      } else {
        setCurrentUser(null);
        setOrders([]);
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserOrders = async (userId) => {
    setLoading(true);
    try {
      const ordersSnapshot = await getDocs(collection(fireDB, 'users', userId, 'orders'));
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error('Error fetching user orders: ', error);
    } finally {
      setLoading(false);
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

      setOrders(orders.map(order => order.id === currentOrder.id ? { ...order, address: newAddress } : order));
      setFilteredOrders(filteredOrders.map(order => order.id === currentOrder.id ? { ...order, address: newAddress } : order));
      toast.success('Address updated successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating address: ', error);
      toast.error('Failed to update address.');
    }
  };

  

  const handleViewOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setCurrentOrder(order);
    setSelectedOrderId(orderId);
  };


  const handleSearch = () => {
    let filtered = orders.filter((order) => {
      if (fromDate && new Date(order.orderDate.toDate()) < new Date(fromDate)) {
        return false;
      }
      if (toDate && new Date(order.orderDate.toDate()) > new Date(toDate)) {
        return false;
      }
      if (status && order.status !== status) {
        return false;
      }
      if (reference && !order.cartItems.some(item => item.title.toLowerCase().includes(reference.toLowerCase()))) {
        return false;
      }
      return true;
    });
    setFilteredOrders(filtered);
  };

  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
    setStatus('');
    setReference('');
    setFilteredOrders(orders);
  };
  
  const handleReorder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setCurrentOrder(order);
    setIsPaymentModalOpen(true); // Open payment method selection modal
  };

  const handleOnlinePayment = async () => {
    const order = currentOrder;
    const totalAmount = order.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const options = {
      key: 'rzp_test_XQAiFEWVMKv0M6',
      key_secret: 'kZW37IsHRvafxcQp1p8dPGun', // Replace with your Razorpay key
      amount: totalAmount * 100, // Convert amount to paisa
      currency: 'INR',
      name: 'LUTHER',
      description: 'Test Transaction',
      image: 'https://your-logo-url.com', // Replace with your logo url
      handler: async function (response) {
        try {
          const orderData = {
            address: order.address,
            cartItems: order.cartItems,
            totalAmount: totalAmount,
            paymentId: response.razorpay_payment_id,
            paymentMethod: 'online',
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
    setIsPaymentModalOpen(false);
  };
  const handleCancelOrder = async () => {
    try {
      const orderRef = doc(fireDB, 'users', currentUser.uid, 'orders', currentOrderToCancel.id);
      await updateDoc(orderRef, {
        status: 'Cancelled',
        cancelReason: cancelReason // Store cancellation reason in Firestore
      });

      // Update local state
      setOrders(orders.map(order => order.id === currentOrderToCancel.id ? { ...order, status: 'Cancelled', cancelReason: cancelReason } : order));
      setFilteredOrders(filteredOrders.map(order => order.id === currentOrderToCancel.id ? { ...order, status: 'Cancelled', cancelReason: cancelReason } : order));

      toast.success('Order cancelled successfully!');
      setIsCancelModalOpen(false);
    } catch (error) {
      console.error('Error cancelling order: ', error);
      toast.error('Failed to cancel order.');
    }
  };

  const handleCodPayment = async () => {
    const order = currentOrder;
    const totalAmount = order.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const orderData = {
      address: order.address,
      cartItems: order.cartItems,
      totalAmount: totalAmount,
      paymentId: 'COD',
      paymentMethod: 'cod',
      orderDate: new Date(),
    };

    try {
      const docRef = await addDoc(collection(fireDB, 'users', currentUser.uid, 'orders'), orderData);
      console.log('Order document written with ID: ', docRef.id);
      toast.success('Order placed successfully with Cash on Delivery!');
    } catch (error) {
      console.error('Error saving order: ', error);
      toast.error('Failed to place order.');
    }
    setIsPaymentModalOpen(false);
  };
  return (
    <div className="container px-4 py-5 mx-auto lg:py-8">
      <div className="py-5 border border-pink-100 order-history bg-pink-50 rounded-xl">
        <h2 className="mb-4 text-2xl font-bold lg:text-3xl">Order History</h2>
        <div className="p-4 mb-4 bg-white border border-gray-300 rounded-lg">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Please select...</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Reference</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              className="px-4 py-2 ml-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center mt-10">
            <ProgressIndicator />
          </div>
        ) : (
          <div className="p-4 bg-white border border-gray-300 rounded-lg order-list">
            <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:text-sm">S.No</th>
        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:text-sm">Id</th>
        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:text-sm">Order Date</th>
        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:text-sm">Product</th>
        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:text-sm">Delivery Date</th>
        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:text-sm">Status</th>
        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:text-sm">Payment Mode</th>
        <th className="px-6 py-3 text-xs font-medium text-right uppercase sm:text-sm">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {filteredOrders.map((order, index) => (
        <tr key={order.id}>
          <td className="px-6 py-4 text-xs font-medium text-gray-900 sm:text-sm">{index + 1}</td>
          <td className="px-6 py-4 text-xs font-medium text-gray-900 sm:text-sm">{order.id}</td>
          <td className="px-6 py-4 text-xs text-gray-500 sm:text-sm">{new Date(order.orderDate.toDate()).toLocaleDateString()}</td>
          <td className="max-w-xs px-6 py-4 text-xs text-gray-500 truncate sm:text-sm sm:max-w-md">
            <ul>
              {order.cartItems.map((item, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <div className="flex justify-center">
                    <img className="w-20" src={item.productImageUrl} alt="" />
                  </div>
                  <span>{item.title} - ₹{item.price} x {item.quantity}</span>
                </li>
              ))}
            </ul>
          </td>
          <td className="px-6 py-4 text-xs text-gray-500 sm:text-sm">
            {order.deliveryDate ? new Date(order.deliveryDate.toDate()).toLocaleDateString() : 'N/A'}
          </td>
          <td className="px-6 py-4 text-xs text-gray-500 sm:text-sm">{order.status}</td>
          <td className="px-6 py-4 text-xs text-gray-500 sm:text-sm">{order.paymentMethod}</td>
          <td className="px-6 py-4 text-xs font-medium text-right sm:text-sm whitespace-nowrap">
            <button
              className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              onClick={() => handleViewOrder(order.id)}
            >
              View
            </button>
            <button
              className="px-4 py-2 mr-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
              onClick={() => handleEditAddress(order)}
            >
              Edit Address
            </button>
            <button
              className="px-4 py-2 mr-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              onClick={() => handleReorder(order.id)}
            >
              Reorder
            </button>
            <button
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              onClick={() => {
                setCurrentOrderToCancel(order);
                setIsCancelModalOpen(true);
              }}
              disabled={order.status === 'Delivered'} // Disable cancel button for delivered orders
            >
              Cancel
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

          </div>
        )}
      </div>

      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50 order-details-modal">
          <div className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
            <button
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedOrderId(null)}
            >
              Close
            </button>
            <h3 className="mb-4 text-2xl font-bold">Order Details</h3>
            {currentOrder && (
              <div>
                <p><strong>Order ID:</strong> {currentOrder.id}</p>
                <p><strong>Order Date:</strong> {new Date(currentOrder.orderDate.toDate()).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {currentOrder.status}</p>
                <p><strong>Reference:</strong> {currentOrder.reference}</p>
                <p><strong>Payment ID:</strong> {currentOrder.paymentId}</p>
                <h4 className="mt-4 mb-2 text-lg font-bold">Cart Items</h4>
                {currentOrder.cartItems.map((item, index) => (
                  <div key={index} className="mb-2">
                      <img
                          src={item.productImageUrl}
                          alt={item.title}
                          className="object-contain object-center w-16 h-16 rounded-md"
                        />
                   
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Price:</strong>₹{item.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}


      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <button
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="mb-4 text-xl font-semibold">Edit Address</h2>
            <form onSubmit={handleAddressSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-4 py-2 ml-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="p-6 bg-white rounded-lg md:w-1/3 sm:w-1/2">
            <h2 className="mb-4 text-lg font-bold">Cancel Order</h2>
            <p className="mb-4 text-sm text-gray-600">Are you sure you want to cancel this order?</p>
            <textarea
              className="block w-full h-20 p-2 mb-4 border border-gray-300 rounded-md resize-none"
              placeholder="Enter reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setIsCancelModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                onClick={handleCancelOrder}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
       {isPaymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-full max-w-md p-4 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">Choose Payment Method</h2>
            <div className="flex justify-center">
              <button
                onClick={handleOnlinePayment}
                className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-lg"
              >
                Online Payment
              </button>
              <button
                onClick={handleCodPayment}
                className="px-4 py-2 text-white bg-green-500 rounded-lg"
              >
                Cash on Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserDashboard;
