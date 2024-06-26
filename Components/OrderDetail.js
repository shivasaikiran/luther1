import React, { useEffect, useState } from 'react';
import { fireDB } from '@/Firebase/config'; // Adjust this import based on your Firebase setup
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux'; // Assuming you use Redux for managing cart state

const OrderDetail = () => {
  const [userOrders, setUserOrders] = useState([]); // State to hold user's orders
  const cartItems = useSelector((state) => state.cart); // Example usage of Redux to get cart items

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersCollection = collection(fireDB, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        let fetchedOrders = [];
        
        for (const userDoc of usersSnapshot.docs) {
          const ordersCollection = collection(userDoc.ref, 'orders');
          const ordersSnapshot = await getDocs(ordersCollection);
          
          ordersSnapshot.forEach(orderDoc => {
            fetchedOrders.push({
              id: orderDoc.id,
              userId: userDoc.id,
              ...orderDoc.data()
            });
          });
        }
        
        setUserOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (userId, orderId, newStatus) => {
    try {
      const orderRef = doc(fireDB, `users/${userId}/orders`, orderId); // Firestore document reference
      await updateDoc(orderRef, { status: newStatus });
      
      // Update state to reflect the change
      setUserOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status: ', error);
    }
  };

  const handleDeliveryDateChange = async (userId, orderId, newDeliveryDate) => {
    try {
      const orderRef = doc(fireDB, `users/${userId}/orders`, orderId); // Firestore document reference
      await updateDoc(orderRef, { deliveryDate: newDeliveryDate });
      
      // Update state to reflect the change
      setUserOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, deliveryDate: newDeliveryDate } : order
        )
      );
    } catch (error) {
      console.error('Error updating delivery date: ', error);
    }
  };

  return (
    <div>
      <div className="py-5">
        <h1 className="text-xl font-bold text-pink-300">All Orders</h1>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-pink-400 border border-collapse border-pink-100 sm:border-separate">
          <thead>
            <tr>
              <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md first:border-l-0 text-slate-700 bg-slate-100">
                S.No.
              </th>
              <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">
                Order Id
              </th>
              <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">
                Date
              </th>
              <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">
                Products
              </th>
              <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">
                Address
              </th>
              <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">
                Status
              </th>
              <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">
                Delivery Date
              </th>
              <th scope="col" className="h-12 px-6 font-bold border-l border-pink-100 text-md fontPara first:border-l-0 text-slate-700 bg-slate-100">
                Payment Mode
              </th>
            </tr>
          </thead>
          <tbody>
            {userOrders.map((order, index) => (
              <tr key={order.id} className="text-pink-300">
                <td className="h-12 px-6 border-t border-l border-pink-100 text-md first:border-l-0 text-slate-500">
                  {index + 1}.
                </td>
                <td className="h-12 px-6 border-t border-l border-pink-100 text-md first:border-l-0 text-slate-500">
                  {order.id}
                </td>
                <td className="h-12 px-6 border-t border-l border-pink-100 text-md first:border-l-0 text-slate-500">
                  {new Date(order.orderDate.toDate()).toLocaleDateString()}
                </td>
                <td className="h-12 px-6 border-t border-l border-pink-100 text-md first:border-l-0 text-slate-500">
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
                <td className="h-12 px-6 border-t border-l border-pink-100 text-md first:border-l-0 text-slate-500">
                  {order.address.street}, {order.address.city}, {order.address.state} - {order.address.postalCode}
                </td>
                <td className="h-12 px-6 border-t border-l border-pink-100 text-md first:border-l-0 text-slate-500">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.userId, order.id, e.target.value)} // Pass userId and orderId
                    className="px-3 py-2 bg-white border border-gray-300 rounded-md"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="h-12 px-6 border-t border-l border-pink-100 text-md first:border-l-0 text-slate-500">
                  <input
                    type="date"
                    value={order.deliveryDate instanceof Date ? order.deliveryDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDeliveryDateChange(order.userId, order.id, new Date(e.target.value))}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-md"
                  />
                </td>
                <td className="h-12 px-6 border-t border-l border-pink-100 text-md first:border-l-0 text-slate-500">
                  {order.paymentMethod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;
