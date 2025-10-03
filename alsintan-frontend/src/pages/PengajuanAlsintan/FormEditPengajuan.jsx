import { useState, useEffect } from "react";
import ModalConfirmation from "../../components/ModalConfirmation";
import SelectInput from "../../components/SelectInput";
import TextInput from "../../components/TextInput";
import TextareaInput from "../../components/TextareaInput";

const FormEditPengajuan = ({ isOpen, onClose, onSuccess, data }) => {
  const [formData, setFormData] = useState({
    poktan_id: "",
    alsintan_id: "",
    jumlah_diminta: 1,
    alasan_pengajuan: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Dummy data - ganti dengan fetch dari API
  const [poktanList] = useState([
    { id: 1, nama: "Poktan Makmur Jaya", kecamatan: "Klaten Tengah" },
    { id: 2, nama: "Poktan Tani Subur", kecamatan: "Klaten Utara" },
    { id: 3, nama: "Poktan Sejahtera", kecamatan: "Klaten Selatan" },
  ]);

  const [alsintanList] = useState([
    { id: 1, nama: "Traktor Roda 4", jenis: "Pengolahan Lahan", stok: 5 },
    { id: 2, nama: "Mesin Tanam Padi", jenis: "Penanaman", stok: 3 },
    { id: 3, nama: "Pompa Air", jenis: "Irigasi", stok: 10 },
    { id: 4, nama: "Mesin Panen Padi", jenis: "Pemanenan", stok: 2 },
  ]);

  useEffect(() => {
    if (data) {
      setFormData({
        poktan_id: data.poktan_id || "",
        alsintan_id: data.alsintan_id || "",
        jumlah_diminta: data.jumlah_diminta || 1,
        alasan_pengajuan: data.alasan_pengajuan || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.poktan_id) newErrors.poktan_id = "Poktan harus dipilih";
    if (!formData.alsintan_id) newErrors.alsintan_id = "Alsintan harus dipilih";
    if (!formData.jumlah_diminta || formData.jumlah_diminta < 1) {
      newErrors.jumlah_diminta = "Jumlah minimal 1";
    }
    if (!formData.alasan_pengajuan.trim()) {
      newErrors.alasan_pengajuan = "Alasan pengajuan harus diisi";
    } else if (formData.alasan_pengajuan.length < 20) {
      newErrors.alasan_pengajuan = "Alasan minimal 20 karakter";
    }

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
      // await fetch(`/api/pengajuan/${data.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowConfirmModal(false);
      onSuccess("Pengajuan berhasil diperbarui");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memperbarui data");
    } finally {
      setLoading(false);
    }
  };

  const onCloseModal = () => {
    onClose();
  };

  if (!isOpen || !data) return null;

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
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Edit Pengajuan
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ID Pengajuan: #{data.id}
                </p>
              </div>
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
                {/* Poktan */}
                <SelectInput
                  label="Kelompok Tani"
                  name="poktan_id"
                  value={formData.poktan_id}
                  onChange={handleChange}
                  options={poktanList.map((item) => ({
                    value: item.id,
                    label: `${item.nama} - ${item.kecamatan}`,
                  }))}
                  error={errors.poktan_id}
                  required
                  placeholder="Pilih Kelompok Tani"
                />

                {/* Alsintan */}
                <SelectInput
                  label="Alat dan Mesin Pertanian"
                  name="alsintan_id"
                  value={formData.alsintan_id}
                  onChange={handleChange}
                  options={alsintanList.map((item) => ({
                    value: item.id,
                    label: `${item.nama} - ${item.jenis} (Stok: ${item.stok})`,
                  }))}
                  error={errors.alsintan_id}
                  required
                  placeholder="Pilih Kelompok Tani"
                />

                {/* Jumlah */}
                <TextInput
                  label="Jumlah Diminta"
                  name="jumlah_diminta"
                  value={formData.jumlah_diminta}
                  onChange={handleChange}
                  error={errors.jumlah_diminta}
                  required
                  type="number"
                  min="1"
                />

                {/* Alasan */}
                <TextareaInput
                  label="Alasan Pengajuan"
                  name="alasan_pengajuan"
                  value={formData.alasan_pengajuan}
                  onChange={handleChange}
                  error={errors.alasan_pengajuan}
                  required
                  placeholder="Jelaskan alasan pengajuan alsintan..."
                  showCount
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="w-fit text-sm font-medium cursor-pointer px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
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
        title="Konfirmasi Update"
        message="Apakah Anda yakin ingin memperbarui data pengajuan ini?"
        type="info"
        loading={loading}
      />
    </>
  );
};

export default FormEditPengajuan;
