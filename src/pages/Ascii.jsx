import { useState, useRef, useEffect } from 'react';
import asciiFile from '../assets/ascii.json';

function AsciiCard({ item }) {
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);

  const preRef = useRef(null);
  const containerRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.art.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const pre = preRef.current;
    const container = containerRef.current;

    const scaleX = container.clientWidth / pre.scrollWidth;
    const scaleY = container.clientHeight / pre.scrollHeight;

    setScale(Math.min(scaleX, scaleY));
  }, [item]);

  return (
    <div className="relative group w-full md:w-[calc(50%-40px)] lg:w-[calc(33.333%-40px)] h-[300px]">
      <button
        className={`absolute top-3 right-3 px-3 py-1 rounded-xl border text-xs transition-all duration-500 ${
          copied
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200'
        }`}
        onClick={handleCopy}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>

      <div
        ref={containerRef}
        className="h-full w-full flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-700 group-hover:border-zinc-400 group-hover:shadow-md group-hover:shadow-zinc-700/40"
      >
        <pre
          ref={preRef}
          style={{ transform: `scale(${scale})` }}
          className="text-zinc-200 text-xs leading-tight whitespace-pre origin-center scale-70 sm:scale-80"
        >
          {item.art.join('\n')}
        </pre>
      </div>
    </div>
  );
}

function Ascii() {
  return (
    <div className="bg-zinc-900 flex flex-wrap gap-10 p-10 justify-center">
      {asciiFile.ascii.map((item) => (
        <AsciiCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default Ascii;
