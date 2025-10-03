// components/SelectInput.jsx
const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  optionLabel = "label", // properti object yg ditampilkan
  optionValue = "value", // properti object yg dijadikan value
  error,
  required = false,
  placeholder = "Pilih salah satu...",
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      >
        <option value="" className="text-gray-400 text-sm">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt[optionValue]} value={opt[optionValue]}>
            {opt[optionLabel]}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SelectInput;
