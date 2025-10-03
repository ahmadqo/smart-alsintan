import { useEffect, useState } from "react";
import ButtonActionTable from "../../components/ButtonActionTable";
import Pagination from "../../components/Pagination";
import ButtonAdd from "../../components/ButtonAdd";
import NoData from "../../components/NoData";
import FormCreatePengajuan from "./FormCreatePengajuan";
import FormEditPengajuan from "./FormEditPengajuan";
import ModalViewDetail from "./ModalViewDetail";
import ModalConfirmation from "../../components/ModalConfirmation";
import { formatDate2 } from "../../lib/utils";

const getStatusBadge = (status) => {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-300",
      label: "Menunggu Verifikasi",
    },
    disetujui: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      label: "Disetujui",
    },
    ditolak: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      label: "Ditolak",
    },
    terdistribusi: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      label: "Terdistribusi",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

const dummyPengajuan = [
  {
    id: 1,
    poktan_id: 1,
    alsintan_id: 1,
    poktan: {
      nama: "Poktan Makmur Jaya",
      ketua: "Budi Santoso",
      kecamatan: "Klaten Tengah",
    },
    alsintan: {
      nama: "Traktor Roda 4",
      jenis: "Pengolahan Lahan",
    },
    jumlah_diminta: 2,
    alasan_pengajuan: "Untuk meningkatkan produktivitas pengolahan lahan",
    status_pengajuan: "pending",
    tanggal_pengajuan: "2024-01-15",
    smart_score: null,
    ranking_prioritas: null,
    catatan_verifikasi: null,
  },
  {
    id: 2,
    poktan_id: 2,
    alsintan_id: 2,
    poktan: {
      nama: "Poktan Tani Subur",
      ketua: "Siti Aminah",
      kecamatan: "Klaten Utara",
    },
    alsintan: {
      nama: "Mesin Tanam Padi",
      jenis: "Penanaman",
    },
    jumlah_diminta: 1,
    alasan_pengajuan: "Mengurangi ketergantungan tenaga kerja manual",
    status_pengajuan: "ditolak",
    tanggal_pengajuan: "2024-01-10",
    tanggal_persetujuan_kelurahan: "2024-01-12",
    smart_score: null,
    ranking_prioritas: null,
    catatan_verifikasi: null,
  },
  {
    id: 3,
    poktan_id: 3,
    alsintan_id: 3,
    poktan: {
      nama: "Poktan Sejahtera",
      ketua: "Ahmad Fauzi",
      kecamatan: "Klaten Selatan",
    },
    alsintan: {
      nama: "Pompa Air",
      jenis: "Irigasi",
    },
    jumlah_diminta: 3,
    alasan_pengajuan: "Untuk pengairan lahan pada musim kemarau",
    status_pengajuan: "disetujui",
    tanggal_pengajuan: "2024-01-05",
    tanggal_persetujuan_kelurahan: "2024-01-07",
    tanggal_persetujuan_kecamatan: "2024-01-10",
    smart_score: 85.5,
    ranking_prioritas: 1,
    catatan_verifikasi: "Memenuhi syarat dan kriteria",
  },
];

function DataTablePengajuan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPengajuan();
  }, []);

  const fetchPengajuan = async () => {
    setLoading(true);
    try {
      // TODO: Ganti dengan endpoint Laravel
      setTimeout(() => {
        setDatas(dummyPengajuan);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleView = (data) => {
    setSelectedData(data);
    setShowViewModal(true);
  };

  const handleEdit = (data) => {
    setSelectedData(data);
    setShowEditModal(true);
  };

  const handleDeleteClick = (data) => {
    setSelectedData(data);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/pengajuan/${selectedData.id}`, {
      //   method: 'DELETE'
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setDatas((prev) => prev.filter((item) => item.id !== selectedData.id));
      setShowDeleteModal(false);
      setSelectedData(null);
      alert("Data berhasil dihapus");
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghapus data");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSuccess = (message) => {
    alert(message);
    fetchPengajuan();
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
              Pengajuan Alsintan
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Daftar pengajuan alat dan mesin pertanian dari kelompok tani
            </p>
          </div>
          <ButtonAdd
            label="Buat Pengajuan"
            onClick={() => setShowCreateModal(true)}
          />
        </header>

        <div className="p-3">
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-2 py-3 text-left w-12">No</th>
                  <th className="px-2 py-3 text-left">Tanggal</th>
                  <th className="px-2 py-3 text-left">Poktan</th>
                  <th className="px-2 py-3 text-left">Alsintan</th>
                  <th className="px-2 py-3 text-center">Jumlah</th>
                  <th className="px-2 py-3 text-left">Alasan</th>
                  <th className="px-2 py-3 text-center">Status</th>
                  <th className="px-2 py-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="p-2 text-gray-600 dark:text-gray-400">
                        {startIndex + index + 1}
                      </td>
                      <td className="p-2 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {formatDate2(item.tanggal_pengajuan)}
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-100">
                            {item.poktan.nama}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.poktan.ketua} • {item.poktan.kecamatan}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-100">
                            {item.alsintan.nama}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.alsintan.jenis}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          {item.jumlah_diminta}
                        </span>
                      </td>
                      <td className="p-2">
                        <div
                          className="max-w-xs truncate text-gray-600 dark:text-gray-400"
                          title={item.alasan_pengajuan}
                        >
                          {item.alasan_pengajuan}
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        {getStatusBadge(item.status_pengajuan)}
                      </td>
                      <td className="p-2">
                        <ButtonActionTable
                          isView
                          isEdit={
                            item?.status_pengajuan === "pending" ||
                            item?.status_pengajuan === "ditolak"
                          }
                          isRemove={item?.status_pengajuan === "pending"}
                          onView={() => handleView(item)}
                          onEdit={() => handleEdit(item)}
                          onRemove={() => handleDeleteClick(item)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      <NoData label="Tidak ada data pengajuan" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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

      {/* Modals */}
      <FormCreatePengajuan
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
      />

      <FormEditPengajuan
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleSuccess}
        data={selectedData}
      />

      <ModalViewDetail
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        data={selectedData}
      />

      <ModalConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus pengajuan dari ${selectedData?.poktan?.nama}?`}
        type="danger"
        loading={deleteLoading}
      />
    </>
  );
}

export default DataTablePengajuan;
