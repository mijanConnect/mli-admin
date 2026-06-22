import React, { useEffect, useState } from "react";
import NotificationModal from "./NotificationModal";
import {
  MdDelete,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdModeEditOutline,
} from "react-icons/md";
import Swal from "sweetalert2";
import UpdateModal from "../../components/common/UpdateModal";

const notificationData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Subscribers ${i + 1}`,
  email: `subscribers${i + 1}@gmail.com`,
  phone: `+23191633389${i + 1}`,
  address: `Address ${i + 1}, City`,
  image: `https://img.freepik.com/free-photo/portrait-handsome-young-man-with-arms-crossed-holding-white-headphone-around-his-neck_23-2148096439.jpg?semt=ais_hybrid/50?text=R${
    i + 1
  }`,
}));

const Category = () => {
  const [communicationType, setCommunicationType] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationData);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  // Update Retailer Handler
  const handleUpdate = (updatedUserData) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === updatedUserData.id ? updatedUserData : notification
      )
    );
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setNotifications(
          notifications.filter((notification) => notification.id !== id)
        );
        Swal.fire("Deleted!", "notification has been deleted.", "success");
      }
    });
  };

  const filteredSubscribers = notifications.filter(
    (subscriber) =>
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const displayedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="">
      <div className="flex gap-6 justify-end items-center mb-4">
        <div className="flex justify-center items-center">
          <button
            type="primary"
            className="bg-[#3FC7EE] text-white py-2 px-3 rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            Send Message by modal
          </button>

          <NotificationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded "
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
          </select>
        </div>
      </div>
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-300">
            <th className="p-2">#</th>
            <th className="p-2">Retailer Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Address</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedSubscribers.map((notification, index) => (
            <tr key={notification.id} className="border-b border-gray-300">
              <td className="p-2">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="flex items-center gap-2 p-2 justify-center">
                <img
                  src={notification.image}
                  alt={notification.name}
                  className="w-10 h-10 rounded-full"
                />
                <p>{notification.name}</p>
              </td>
              <td className="p-2">{notification.email}</td>
              <td className="p-2">{notification.phone}</td>
              <td className="p-2">{notification.address}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button className="bg-green-500 text-white px-2 py-1 rounded">
                  <MdModeEditOutline
                    onClick={() => handleEdit(notification)}
                    className="text-xl"
                  />
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
                  <MdDelete
                    onClick={() => handleDelete(notification.id)}
                    className="text-xl"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          <MdKeyboardArrowLeft className="text-3xl " />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          <MdKeyboardArrowRight className="text-3xl" />
        </button>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && selectedUser && (
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSave={handleUpdate}
          userData={selectedUser}
        />
      )}
    </div>
  );
};

export default Category;
