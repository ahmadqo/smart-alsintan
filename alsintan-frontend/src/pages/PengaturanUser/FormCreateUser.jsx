import { useState } from "react";
import ModalConfirmation from "../../components/ModalConfirmation";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";

const roleList = [
  { id: "admin", nama: "Administrator Sistem" },
  { id: "staff", nama: "Staff" },
];

const FormCreateUser = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    role: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) newErrors.userName = "Username wajib diisi";
    if (!formData.fullName) newErrors.fullName = "Nama Lengkap wajib diisi";
    if (!formData.role) newErrors.role = "Role wajib diisi";
    if (!formData.email) newErrors.email = "Email wajib diisi";
    if (!formData.password) newErrors.password = "Password wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/pengajuan', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowConfirmModal(false);
      onSuccess("User berhasil ditambahkan");
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      fullName: "",
      role: "",
      email: "",
      password: "",
    });
    setErrors({});
  };

  const onCloseModal = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-500/50 transition-colors duration-300"
            onClick={onCloseModal}
          ></div>

          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Buat Pengajuan Baru
              </h3>
              <button
                onClick={onCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
            >
              <div className="space-y-4">
                {/* Username */}
                <TextInput
                  label="Username"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  error={errors.userName}
                  required
                />
                {/* Nama Lengkap */}
                <TextInput
                  label="Nama Lengkap"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                />
                {/* Role */}
                <SelectInput
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={roleList.map((item) => ({
                    value: item.id,
                    label: `${item.nama}`,
                  }))}
                  error={errors.role}
                  required
                  placeholder="Pilih Role"
                />
                {/* Email */}
                <TextInput
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  type="email"
                />
                {/* Password */}
                <TextInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  type="password"
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="w-fit text-sm font-medium  cursor-pointer px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-[8rem] text-sm font-medium cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ModalConfirmation
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan pengajuan ini?"
        type="info"
        loading={loading}
      />
    </>
  );
};

export default FormCreateUser;
