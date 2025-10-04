import { useState, useEffect } from "react";
import ButtonActionTable from "../../components/ButtonActionTable";
import Pagination from "../../components/Pagination";
import ButtonAdd from "../../components/ButtonAdd";
import NoData from "../../components/NoData";
import ModalConfirmation from "../../components/ModalConfirmation";
import PopupResponse from "../../components/PopupResponse";
import FormCreateUser from "./FormCreateUser";
import FormEditUser from "./FormEditUser";
import { fetchDeleteUserById, fetchGetUsers } from "../../services/userService";

const getRoleBadge = (role) => {
  const roleConfig = {
    admin: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-300",
      label: "Admin",
    },
    operator: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      label: "Operator",
    },
    pimpinan: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      label: "Pimpinan",
    },
    staff: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      label: "Staff",
    },
  };

  const config = roleConfig[role] || roleConfig.staff;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

function DataTablePengaturanUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [responsePopup, setResponsePopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchGetUsers();
      setDatas(response?.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (data) => {
    setSelectedData(data);
    setShowDeleteModal(true);
  };

  const handleEdit = (data) => {
    setSelectedData(data);
    setShowEditModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await fetchDeleteUserById(selectedData.id);

      // Update local state
      setDatas((prev) => prev.filter((item) => item.id !== selectedData.id));
      setShowDeleteModal(false);
      setSelectedData(null);
      setResponsePopup({
        isOpen: true,
        title: "Berhasil",
        message: "User berhasil dihapus.",
        type: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      setShowDeleteModal(false);
      setResponsePopup({
        isOpen: true,
        title: "Gagal",
        message: "Gagal menghapus user. Silakan coba lagi.",
        type: "danger",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Pagination calculations
  const totalItems = datas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = datas.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSuccess = (message) => {
    setResponsePopup({
      isOpen: true,
      title: "Berhasil",
      message: message,
      type: "success",
    });
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              Pengaturan User
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Kelola akun pengguna sistem
            </p>
          </div>
          <ButtonAdd
            label={"Tambah User"}
            onClick={() => setShowCreateModal(true)}
          />
        </header>

        <div className="p-3">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-2 py-3 text-left w-12">No</th>
                  <th className="px-2 py-3 text-left">Username</th>
                  <th className="px-2 py-3 text-left">Nama Lengkap</th>
                  <th className="px-2 py-3 text-left">Email</th>
                  <th className="px-2 py-3 text-center">Role</th>
                  <th className="px-2 py-3 text-center">Actions</th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {currentItems.length > 0 ? (
                  currentItems.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="p-2 text-gray-600 dark:text-gray-400">
                        {startIndex + index + 1}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {user.username}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-gray-800 dark:text-gray-100">
                        {user.nama}
                      </td>
                      <td className="p-2 text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="p-2 text-center">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-2 flex justify-center">
                        <ButtonActionTable
                          isEdit
                          isRemove
                          onEdit={() => handleEdit(user)}
                          onRemove={() => handleDeleteClick(user)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      <NoData label="Tidak ada data user" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {datas.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <FormCreateUser
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
      />

      <FormEditUser
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleSuccess}
        data={selectedData}
      />

      <ModalConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus user ${selectedData?.nama}?`}
        type="danger"
        loading={deleteLoading}
      />

      <PopupResponse
        isOpen={responsePopup.isOpen}
        onClose={() => {
          setResponsePopup((prev) => ({ ...prev, isOpen: false }));
        }}
        title={responsePopup.title}
        message={responsePopup.message}
        type={responsePopup.type}
      />
    </>
  );
}

export default DataTablePengaturanUser;
