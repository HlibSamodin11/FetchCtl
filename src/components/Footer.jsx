import { useRef } from 'react';

const links = [
  { title: 'title1', items: ['text1', 'text1', 'text1'] },
  { title: 'title2', items: ['text2', 'text2', 'text2'] },
  { title: 'title3', items: ['text3', 'text3', 'text3'] },
  { title: 'title4', items: ['text4', 'text4', 'text4'] },
];

const tux = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣽⢫⡌⣿⣿⢉⣤⠹⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣜⠗⠉⠙⠘⠻⢡⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣥⡀⠀⢀⡠⣐⣸⣿⡿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠇⠉⠒⠶⠉⠀⠀⢻⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⣿⠃⠀⠀⠀⠁⠀⠀⠀⠀⢻⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣼⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣦⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⡆⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣾⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⡀⠀⠀⠀
⠀⠀⠀⢀⣾⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⡇⠀⠀⠀
⠀⠀⠀⡸⠋⠛⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⢼⣿⣿⣿⣿⠃⠀⠀⠀
⡐⠀⠈⠀⠀⠀⠈⢻⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⡿⠿⠃⠀⠀⠀⠀
⢡⠀⠀⠀⠀⠀⠀⠀⠻⣿⠷⠀⠀⠀⠀⠀⠀⠀⣠⠃⠀⠀⠀⠀⠀⠀⠐⠠⡀
⡄⠀⠀⠀⠀⠀⠀⠀⠀⠑⣄⠀⠀⠀⠀⣀⣤⣾⣿⠀⠀⠀⠀⠀⠀⠀⣀⡠⠃
⠒⠠⠤⣀⣄⡀⠀⠀⢀⣰⣿⠿⠿⠿⠿⠿⠿⠿⣿⡄⠀⠀⢀⡠⠔⠉⠀⠀⠀
⠀⠀⠀⠀⠀⠉⠙⠊⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠈⠻⠷⠿⠋⠀⠀⠀⠀⠀⠀`;

function Footer() {
  return (
    <footer className="relative w-full bg-bg border-t border-button-stroke pt-16 pb-8 overflow-hidden">
      {/* watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[120px] md:text-[192px] tracking-wider text-[color:var(--color-watermark)] whitespace-nowrap pointer-events-none select-none z-0">
        FetchCtl
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
          {/* brand */}
          <div className="flex-1 max-w-sm">
            <div className="flex items-center gap-3">
              <div className={`rounded-full border`}>
                <svg className="w-8 h-8">
                  <use href="/sprite.svg#icon-logo" />
                </svg>
              </div>
              <span className="font-bold italic text-lg tracking-tight text-accent-text">
                FetchCtl
              </span>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-main-text">
              Generate, customize and share your terminal configs visually. Or
              just stare at the tux, whatever.
            </p>

            <a
              href="https://github.com/HlibSamodin11/FetchCtl"
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-6 hover:opacity-70 transition"
            >
              <svg
                className="w-6 h-6 text-accent-text"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="/sprite.svg#icon-github"></use>
              </svg>
            </a>
          </div>

          {/* links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12 lg:gap-20">
            {links.map((section, i) => (
              <div key={i}>
                <h4 className="font-bold text-sm mb-6 text-accent-text">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.items.map((item, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-main-text text-sm hover:text-accent-text transition"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* tux */}
        <pre className="hidden xl:block absolute top-[45%] right-[-25%] translate-y-[15%] text-[red] text-[6px] leading-[8px] font-sans font-bold opacity-100 pointer-events-none z-0 drop-shadow-[0_0_10px_red] ">
          {tux}
        </pre>

        {/* bottom */}
        <div className="mt-16 pt-8 border-t border-button-stroke flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-accent-text">
            © 2026 FetchCtl. All rights reserved.
          </p>
          <a
            href="mailto:fetchcl@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-main-text transition"
          >
            <p className="text-xs text-accent-text">fetchcl@gmail.com</p>
          </a>

          <p className="text-xs text-accent-text">
            Made by{' '}
            <a
              href="https://github.com/HlibSamodin11"
              target="_blank"
              rel="noreferrer"
              className="hover:text-main-text transition"
            >
              HlibSamodin
            </a>
            {' & '}
            <a
              href="https://github.com/MstyslavSoroka"
              target="_blank"
              rel="noreferrer"
              className="hover:text-main-text transition"
            >
              MstyslavSoroka
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
