import { useState } from 'react';
import ImgToAscii from './ImgToAscii';

const colorOptions = [
  { label: 'Coloured', value: 'coloured' },
  { label: 'Uncoloured', value: 'un-coloured' },
];

function AsciiFilters({ items, children }) {
  const [search, setSearch] = useState('');
  const [colors, setColors] = useState([]);

  function toggleColor(val) {
    setColors((prev) =>
      prev.includes(val) ? prev.filter((f) => f !== val) : [...prev, val],
    );
  }

  // split by comma, slash or space
  const terms = search
    .split(/[,/ ]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const filtered = items.filter((item) => {
    if (colors.length && !colors.includes(item.color)) return false;
    if (!terms.length) return true;

    return terms.every(
      (t) =>
        item.name.toLowerCase().includes(t) ||
        item.tags.some((tag) => tag.toLowerCase().includes(t)),
    );
  });

  return (
    <>
      <div className="container w-full mx-auto flex flex-row gap-10 mb-12 ">
        <div className="flex flex-col w-1/2 gap-4 border-r border-accent-text/10 pr-10">
          <div className="relative ">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none scale-x-[-1]">
              <use
                href="/sprite.svg#icon-search"
                className="fill-accent-text/40"
              />
            </svg>
            <input
              type="text"
              placeholder="search by name or tag — try 'cat cute' or 'cat, cute'"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-accent-bg border border-accent-text/15 text-accent-text text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none focus:border-accent-text/40 transition-colors placeholder:text-accent-text/30"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-text/30 hover:text-accent-text/70 transition-colors text-xs leading-none"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-accent-text/50 text-xs tracking-widest uppercase mr-1">
              Filter
            </span>
            <div className="w-px h-3 bg-accent-text/15 mr-1" />

            {colorOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => toggleColor(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  colors.includes(f.value)
                    ? 'bg-accent-text text-bg border-accent-text'
                    : 'bg-accent-bg text-accent-text border-accent-text/20 hover:border-accent-text/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <ImgToAscii />
      </div>

      {children(filtered)}
    </>
  );
}

export default AsciiFilters;
