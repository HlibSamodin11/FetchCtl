import asciiFile from '../assets/ascii.json';

function Ascii() {
  return (
    <div className="bg-zinc-900 flex gap-10 flex-wrap justify-center items-center">
      {asciiFile.ascii.map((item) => (
        <div>
          <pre
            key={item.id}
            className="text-zinc-200 text-xs tracking-tighter leading-3 rounded-2xl border border-zinc-200 p-20"
          >
            {item.art.join('\n')}
          </pre>
          <button
            className="text-zinc-200 bg-zinc-800 border border-zinc-200 px-5 py-2 rounded-2xl"
            onClick={() => {
              navigator.clipboard.writeText(item.art.join('\n'));
              alert('Copied to clipboard');
            }}
          >
            Copy
          </button>
        </div>
      ))}
    </div>
  );
}

export default Ascii;
