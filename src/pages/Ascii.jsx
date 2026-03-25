import asciiFile from '../assets/ascii.json';

function Ascii() {
  return (
    <div className="bg-zinc-900 flex gap-10">
      {asciiFile.ascii.map((item) => (
        <pre
          key={item.id}
          className="text-zinc-200 text-xs tracking-tighter leading-3 rounded-2xl"
        >
          {item.art.join('\n')}
        </pre>
      ))}
    </div>
  );
}

export default Ascii;
