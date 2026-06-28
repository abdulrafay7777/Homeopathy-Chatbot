const McqOption = ({ label, selected, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={selected}
    className={`mcq-option w-full text-left px-5 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
      selected ? 'mcq-option--selected' : ''
    }`}
    style={{
      backgroundColor: selected ? 'var(--color-gemini-surface-2)' : 'var(--color-gemini-surface)',
      border: selected
        ? '2px solid var(--color-gemini-accent)'
        : '1.5px solid var(--color-gemini-border)',
      color: selected ? 'var(--color-gemini-text)' : 'var(--color-gemini-text)',
      boxShadow: selected
        ? '0 0 0 3px rgba(139, 92, 246, 0.2), 0 4px 14px rgba(139, 92, 246, 0.12)'
        : 'none',
      fontWeight: selected ? 600 : 500,
    }}
  >
    {label}
  </button>
);

export default McqOption;
