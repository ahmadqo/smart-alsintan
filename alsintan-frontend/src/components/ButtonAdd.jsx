function ButtonAdd({ label = "Tambah Data", onClick = () => {} }) {
  return (
    <button
      onClick={onClick}
      className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
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
          d="M12 4v16m8-8H4"
        />
      </svg>
      {label}
    </button>
  );
}

export default ButtonAdd;
