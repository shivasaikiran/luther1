import { useContext, useEffect, useState } from "react";
import myContext from "@/Context/myContext";
import { fireDB } from "@/Firebase/config";
import { collection, getDocs } from "firebase/firestore";

const UserDetail = () => {
  const context = useContext(myContext);
  const { getAllUser } = context;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "users"));
        const fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          fetchedUsers.push(user);
        });
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between py-5">
        <h1 className="text-xl font-bold text-pink-300">All Users</h1>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-pink-400 border border-collapse border-pink-100 sm:border-separate">
          <thead>
            <tr>
              <th className="px-6 py-3 font-bold border-l border-pink-100 text-md first:border-l-0 text-slate-700 bg-slate-100">S.No.</th>
              <th className="px-6 py-3 font-bold border-l border-pink-100 text-md first:border-l-0 text-slate-700 bg-slate-100">Name</th>
              <th className="px-6 py-3 font-bold border-l border-pink-100 text-md first:border-l-0 text-slate-700 bg-slate-100">Email</th>
              <th className="px-6 py-3 font-bold border-l border-pink-100 text-md first:border-l-0 text-slate-700 bg-slate-100">Uid</th>
              <th className="px-6 py-3 font-bold border-l border-pink-100 text-md first:border-l-0 text-slate-700 bg-slate-100">Role</th>
              <th className="px-6 py-3 font-bold border-l border-pink-100 text-md first:border-l-0 text-slate-700 bg-slate-100">Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.uid} className="text-pink-300">
                <td className="px-6 py-3 border-t border-l border-pink-100 text-md text-slate-500">{index + 1}</td>
                <td className="px-6 py-3 border-t border-l border-pink-100 text-md text-slate-500">{user.name}</td>
                <td className="px-6 py-3 border-t border-l border-pink-100 text-md text-slate-500">{user.email}</td>
                <td className="px-6 py-3 border-t border-l border-pink-100 text-md text-slate-500">{user.uid}</td>
                <td className="px-6 py-3 border-t border-l border-pink-100 text-md text-slate-500">{user.role}</td>
                <td className="px-6 py-3 border-t border-l border-pink-100 text-md text-slate-500">{user.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetail;
