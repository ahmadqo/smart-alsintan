import { useEffect, useState } from "react";
import ButtonActionTable from "../../components/ButtonActionTable";
import Pagination from "../../components/Pagination";
import NoData from "../../components/NoData";
import { formatDate2 } from "../../lib/utils";
import { Check, X } from "lucide-react";
import ModalConfirmation from "../../components/ModalConfirmation";

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

const dummyPoktan = [
  {
    id: 1,
    ranking: 1,
    poktan: {
      id: 10,
      nama: "Poktan Makmur",
      ketua: "Pak Budi",
      kecamatan: "Kecamatan A",
      jumlah_anggota: 30,
      luas_garapan: "50 ha",
    },
    alsintan: {
      id: 5,
      nama: "Traktor",
      kategori: "Alat Pertanian",
    },
    jumlah_diminta: 2,
    tanggal_pengajuan: "03/10/2025",
    smart_score: 89.5,
    status: "pending",
    alasan_pengajuan: "Untuk meningkatkan produktivitas",
  },
];

function DataRekomendasiSmart() {
  const [currentPage, setCurrentPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulasi fetch data - ganti dengan API call yang sebenarnya
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // TODO: Ganti dengan endpoint Laravel Anda
      // const response = await fetch("/api/recommendations?limit=50"); // sesuaikan URL
      // const result = await response.json();
      // if (result.success) {
      //   setDatas(result.data.recommendations);
      // }

      // Sementara menggunakan dummy data
      setTimeout(() => {
        setDatas(dummyPoktan);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleDeleteClick = (data) => {
    setSelectedData(data);
    setShowRejectModal(true);
  };

  // Handler Approve
  const handleApprove = async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // await fetch(`/api/recommendations/${id}/approve`, {
      //   method: "POST",
      // });
      fetchData();
    } catch (error) {
      console.error("Approve gagal:", error);
    }
  };

  // Handler Reject
  const handleReject = async () => {
    setRejectLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // await fetch(`/api/recommendations/${id}/reject`, {
      //   method: "POST",
      // });
      fetchData();
    } catch (error) {
      console.error("Reject gagal:", error);
    } finally {
      setRejectLoading(false);
      setShowRejectModal(false);
      setSelectedData(null);
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
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Rekomendasi SMART
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Data rekomendasi SMART berdasarkan kriteria yang telah ditentukan
          </p>
        </header>
        <div className="p-3 overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-2 py-3 text-left">No</th>
                <th className="px-2 py-3 text-left">Poktan</th>
                <th className="px-2 py-3 text-left">Anggota</th>
                <th className="px-2 py-3 text-left">Luas Garapan</th>
                <th className="px-2 py-3 text-left">Alsintan</th>
                <th className="px-2 py-3 text-left">Jumlah</th>
                <th className="px-2 py-3 text-left">Tanggal</th>
                <th className="px-2 py-3 text-center">Score</th>
                <th className="px-2 py-3 text-center">Ranking</th>
                <th className="px-2 py-3 text-center">Status</th>
                <th className="px-2 py-3 text-center">Actions</th>
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
                    <td className="p-2">{item.poktan.jumlah_anggota}</td>
                    <td className="p-2">{item.poktan.luas_garapan}</td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {item.alsintan.nama}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.alsintan.kategori}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">{item.jumlah_diminta}</td>
                    <td className="p-2 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {formatDate2(item.tanggal_pengajuan)}
                    </td>
                    <td className="p-2 text-center">
                      {item.smart_score ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold text-xs">
                          {item.smart_score.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {item.ranking ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold text-xs">
                          #{item.ranking}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="p-2 flex justify-center">
                      {item.status === "pending" && (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="p-2 cursor-pointer rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 cursor-pointer rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <NoData label="Tidak ada data rekomendasi" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

      <ModalConfirmation
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        title="Tolak Pengajuan"
        message={`Apakah Anda yakin ingin menolak pengajuan dari ${selectedData?.poktan?.nama}?`}
        type="danger"
        loading={rejectLoading}
      />
    </>
  );
}

export default DataRekomendasiSmart;
