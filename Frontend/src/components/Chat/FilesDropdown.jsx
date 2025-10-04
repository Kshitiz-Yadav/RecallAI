import { useState, useRef, useEffect } from "react";

const FilesDropdown = ({ files, selectedFiles, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="relative inline-block w-72" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-3 py-2 border rounded-md bg-white flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>Choose files...</span>
        <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M5.23 7.21a.75.75 0 011.06-.02L10 10.67l3.71-3.48a.75.75 0 111.04 1.08l-4.24 3.98a.75.75 0 01-1.04 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white border shadow-lg max-h-48 overflow-y-auto">
          {files.map(file => {
            const disabled = selectedFiles.some(f => f.guid === file.guid);
            return (
              <button
                key={file.guid}
                type="button"
                onClick={() => { if (!disabled) { onSelect(file.guid); setOpen(false); } }}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={disabled}
              >
                {file.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilesDropdown;