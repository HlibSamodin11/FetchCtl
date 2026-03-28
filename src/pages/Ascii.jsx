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
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const pre = preRef.current;
    const container = containerRef.current;

    const scaleX = container.clientWidth / pre.scrollWidth;
    const scaleY = container.clientHeight / pre.scrollHeight;

    setScale(Math.min(scaleX, scaleY));
  });

  return (
    <div className="relative group w-full md:w-[calc(50%-40px)] lg:w-[calc(33.333%-40px)] h-[300px] rounded-2xl border border-zinc-700 hover:border-zinc-400 hover:shadow-md hover:shadow-zinc-700/40 flex flex-col">
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
        className="flex-1 mt-10 mb-4 w-full flex items-center justify-center overflow-hidden"
      >
        <pre
          ref={preRef}
          style={{ transform: `scale(${scale})` }}
          className="text-zinc-200 text-xs leading-tight whitespace-pre origin-center font-sans"
        >
          {item.art.join('\n')}
        </pre>
      </div>

      <div className="p-3 border-t border-zinc-600">
        <ul className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="text-xs text-zinc-400 bg-zinc-800 border border-zinc-600 px-2 py-1 rounded-2xl"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Ascii() {
  return (
    <section className="bg-zinc-900 flex justify-center">
      <div className="container  flex flex-wrap gap-10 justify-center">
        {asciiFile.ascii.map((item) => (
          <AsciiCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default Ascii;
