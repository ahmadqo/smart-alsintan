// components/TextareaInput.jsx
const TextareaInput = ({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = "",
  error,
  required = false,
  showCount = false,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`w-full text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      ></textarea>

      <div className="flex justify-between items-center mt-1">
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          showCount && (
            <p className="text-sm text-gray-500">{value.length} karakter</p>
          )
        )}
      </div>
    </div>
  );
};

export default TextareaInput;
