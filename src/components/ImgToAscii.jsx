import { useRef, useState, useEffect } from 'react';

const chars = ' .:-=+*#%@';

function ImgToAscii() {
  const [rows, setRows] = useState([]); // Array of arrays: [{r,g,b,char}]
  const [fetchAscii, setFetchAscii] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const rgbToFetch = (r, g, b, char) =>
    `\u001b[38;2;${r};${g};${b}m${char}\u001b[0m`;

  const generateAscii = (file) => {
    if (!file) return;
    setLoading(true);

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const width = 140;
      const height = 70;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const { data } = ctx.getImageData(0, 0, width, height);

      const newRows = [];
      let fetch = '';

      for (let y = 0; y < height; y++) {
        const rowPixels = [];
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = 0.3 * r + 0.59 * g + 0.11 * b;
          const char =
            chars[Math.floor((brightness / 255) * (chars.length - 1))];
          rowPixels.push({ r, g, b, char });
          fetch += rgbToFetch(r, g, b, char);
        }
        newRows.push(rowPixels);
        fetch += '\n';
      }

      setRows(newRows);
      setFetchAscii(fetch);
      setOpen(true);
      setLoading(false);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setLoading(false);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // Copy plain-text HTML representation for external use
  const getHtmlString = () => {
    return rows
      .map((row) =>
        row
          .map(
            ({ r, g, b, char }) =>
              `<span style="color:rgb(${r},${g},${b})">${char}</span>`,
          )
          .join(''),
      )
      .join('<br/>');
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <form className="flex flex-col gap-4 items-start w-1/2">
        <label
          htmlFor="ascii-file"
          className="text-accent-text uppercase tracking-widest text-xs"
        >
          Generate your own ascii
        </label>
        <input
          id="ascii-file"
          type="file"
          accept="image/*"
          onChange={(e) => generateAscii(e.target.files[0])}
          className="text-xs text-main-text bg-accent-bg py-2 px-5 rounded-2xl border border-accent-text/15 w-full cursor-pointer transition-colors hover:border-accent-text/40"
          name="ascii-file"
        />
        {loading && (
          <p className="text-xs text-accent-text/50 animate-pulse">
            Generating…
          </p>
        )}
      </form>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/50 backdrop-blur-md">
          <div className="w-[90vw] max-w-5xl h-[85vh] bg-accent-bg border border-accent-text/20 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-4 py-2 border-b border-accent-text/10">
              <span className="text-xs uppercase tracking-widest text-accent-text/60">
                ascii viewer
              </span>
              <div className="flex gap-5">
                <button
                  onClick={() => navigator.clipboard.writeText(getHtmlString())}
                  className="border border-accent-text/20 text-accent-text bg-accent-bg hover:bg-accent-text/10 transition-colors text-xs px-3 py-1.5 rounded-2xl"
                >
                  Copy html
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(fetchAscii)}
                  className="border border-accent-text/20 text-accent-text bg-accent-bg hover:bg-accent-text/10 transition-colors text-xs px-3 py-1.5 rounded-2xl"
                >
                  Copy fetch
                </button>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-accent-text/60 hover:text-accent-text"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-black p-4 flex items-center justify-center">
              <pre className="font-mono text-xs leading-[10px] tracking-[1px]">
                {rows.map((row, y) => (
                  <span key={y} className="block">
                    {row.map(({ r, g, b, char }, x) => (
                      <span
                        key={x}
                        style={{ color: `rgb(${r},${g},${b})` }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImgToAscii;