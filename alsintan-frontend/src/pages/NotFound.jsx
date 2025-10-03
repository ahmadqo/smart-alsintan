import { Link } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";

const NotFound = () => {
  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[600px]">
          {/* 404 Illustration */}
          <div className="mb-8">
            <svg
              className="w-64 h-64 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* 404 Text */}
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            404
          </h1>

          {/* Message */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
            Maaf, halaman yang Anda cari tidak ditemukan. Halaman mungkin telah
            dipindahkan atau dihapus.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              to="/"
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg
                className="w-4 h-4 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Dashboard
            </Link>

            <button
              onClick={() => window.history.back()}
              className="btn bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Butuh bantuan?{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Hubungi Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotFound;
