/**
 * PriceRow — a single label + price row used in order summaries.
 *
 * Props:
 *  label          — string
 *  value          — number (formatted to 2dp automatically)
 *  valueOverride  — string | null — replaces formatted value when set (e.g. "Free")
 *  labelClassName — extra Tailwind classes for the label
 *  valueClassName — extra Tailwind classes for the value (e.g. "text-green-600")
 */
function PriceRow({
  label,
  value,
  valueOverride = null,
  labelClassName = '',
  valueClassName = '',
}) {
  const displayValue =
    valueOverride !== null && valueOverride !== undefined
      ? valueOverride
      : `₹${Math.abs(value).toFixed(2)}`

  const isNegative = value < 0

  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`text-gray-600 ${labelClassName}`}>{label}</span>
      <span className={`font-medium text-gray-800 ${valueClassName}`}>
        {isNegative && valueOverride === null ? '-' : ''}
        {displayValue}
      </span>
    </div>
  )
}

export default PriceRow
