import styles from "./seletorSegmentado.module.css";

export function SeletorSegmentado({ label, options, value, onChange, className = "" }) {
  return (
    <fieldset className={`${styles.control} ${className}`} aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}
