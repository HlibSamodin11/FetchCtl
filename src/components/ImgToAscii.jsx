import { useRef, useState, useEffect } from 'react';

const chars = ' .:-=+*#%@';

function ImgToAscii() {
  const [ascii, setAscii] = useState('');
  const [fetchAscii, setFetchAscii] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  //   template to turn html to fetch
  const rgbToFetch = (r, g, b, char) =>
    `\u001b[38;2;${r};${g};${b}m${char}\u001b[0m`;

  const generateAscii = (file) => {
    setLoading(true);

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // dimentions
      const width = 140;
      const height = 70;

      //   init canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      //
      ctx.drawImage(img, 0, 0, width, height);

      const { data } = ctx.getImageData(0, 0, width, height);

      let html = '';
      let fetch = '';

      //   loop for each pixel
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;

          // set rgb colors
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const brightness = 0.3 * r + 0.59 * g + 0.11 * b;

          //   pick a char based on brightness of the pixel
          const char =
            chars[Math.floor((brightness / 255) * (chars.length - 1))];

          html += `<span style="color:rgb(${r},${g},${b})">${char}</span>`;
          fetch += rgbToFetch(r, g, b, char);
        }

        html += '<br/>';
        fetch += '\n';
      }

      setAscii(html);
      setFetchAscii(fetch);
      setOpen(true);
      setLoading(false);

      URL.revokeObjectURL(url);
    };

    img.src = url;
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
      <form className="flex flex-col  gap-4 items-start w-1/2">
        <label
          htmlFor="ascii-file "
          className="text-accent-text  uppercase tracking-widest text-xs"
        >
          Generate your own ascii
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => generateAscii(e.target.files[0])}
          className="text-xs text-main-text 
          bg-accent-bg py-2 px-5 rounded-2xl border border-accent-text/15 w-full cursor-pointer transition-colors hover:border-accent-text/40
          "
          name="ascii-file"
        />
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
                  onClick={() => navigator.clipboard.writeText(ascii)}
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

            <div className="flex-1 overflow-auto bg-black p-4 flex  items-center justify-center">
              <pre
                className="font-mono text-xs leading-[10px] tracking-[1px]"
                dangerouslySetInnerHTML={{ __html: ascii }}
              ></pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImgToAscii;
