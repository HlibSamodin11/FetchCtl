import { useState } from 'react';
import asciiFile from '../assets/ascii.json';

function AsciiCard({ item }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.art.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
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
      <pre className="text-zinc-200 text-xs tracking-tighter leading-3 rounded-2xl border border-zinc-700 p-20 pt-10 transition-all duration-300 group-hover:border-zinc-400 group-hover:shadow-md group-hover:shadow-zinc-700/40">
        {item.art.join('\n')}
      </pre>
    </div>
  );
}

function Ascii() {
  return (
    <div className="bg-zinc-900 flex gap-10 flex-wrap justify-center items-center p-10">
      {asciiFile.ascii.map((item) => (
        <AsciiCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default Ascii;