const ModalViewDetail = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      menunggu_verifikasi: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300 text-sm font-medium",
        label: "Menunggu Verifikasi",
      },
      disetujui_kelurahan: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300 text-sm font-medium",
        label: "Disetujui Kelurahan",
      },
      disetujui_kecamatan: {
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        text: "text-indigo-700 dark:text-indigo-300 text-sm font-medium",
        label: "Disetujui Kecamatan",
      },
      disetujui_dinas: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300 text-sm font-medium",
        label: "Disetujui Dinas",
      },
      ditolak: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300 text-sm font-medium",
        label: "Ditolak",
      },
      selesai: {
        bg: "bg-gray-100 dark:bg-gray-900/30",
        text: "text-gray-700 dark:text-gray-300 text-sm font-medium",
        label: "Selesai",
      },
    };

    const config = statusConfig[status] || statusConfig.menunggu_verifikasi;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500/50 transition-colors duration-300"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Detail Pengajuan
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ID Pengajuan: #{data.id}
              </p>
            </div>
            <button
              onClick={onClose}
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
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Status Badge */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Status Pengajuan:
              </span>
              {getStatusBadge(data.status_pengajuan)}
            </div>

            {/* Info Poktan */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Informasi Kelompok Tani
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nama Poktan
                  </p>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {data.poktan.nama}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ketua
                  </p>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {data.poktan.ketua}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Kecamatan
                  </p>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {data.poktan.kecamatan}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Alsintan */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Informasi Alsintan
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nama Alsintan
                  </p>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {data.alsintan.nama}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Jenis
                  </p>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {data.alsintan.jenis}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Jumlah Diminta
                  </p>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {data.jumlah_diminta} unit
                  </p>
                </div>
              </div>
            </div>

            {/* Alasan */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Alasan Pengajuan
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {data.alasan_pengajuan}
              </p>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              {/* <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Timeline Persetujuan
              </h4> */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Pengajuan Dibuat
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(data.tanggal_pengajuan)}
                    </p>
                  </div>
                </div>

                {/* {data.tanggal_persetujuan_kelurahan && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Disetujui Kelurahan
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(data.tanggal_persetujuan_kelurahan)}
                      </p>
                    </div>
                  </div>
                )} */}

                {/* {data.tanggal_persetujuan_kecamatan && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Disetujui Kecamatan
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(data.tanggal_persetujuan_kecamatan)}
                      </p>
                    </div>
                  </div>
                )} */}

                {/* {data.tanggal_persetujuan_dinas && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Disetujui Dinas
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(data.tanggal_persetujuan_dinas)}
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            {/* SMART Score & Ranking */}
            {(data.smart_score || data.ranking_prioritas) && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Hasil Penilaian
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {data.smart_score && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                        SMART Score
                      </p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {data.smart_score.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {data.ranking_prioritas && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">
                        Ranking Prioritas
                      </p>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        #{data.ranking_prioritas}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Catatan Verifikasi */}
            {data.catatan_verifikasi && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  Catatan Verifikasi
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {data.catatan_verifikasi}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-2  text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalViewDetail;
