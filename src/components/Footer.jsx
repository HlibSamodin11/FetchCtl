import { useState } from 'react';

const LOGO_URL = "/logo.png";
const GITHUB_ICON_URL = "/github.png";

const footerLinks = [
  { title: "title", items: ["soon", "soon", "soon"] },
  { title: "title", items: ["soon", "soon", "soon"] },
  { title: "title", items: ["soon", "soon", "soon"] },
  { title: "title", items: ["soon", "soon", "soon"] },
];

// tux
const tuxAscii = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⣽⢫⡌⣿⣿⢉⣤⠹⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣜⠗⠉⠙⠘⠻⢡⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣥⡀⠀⢀⡠⣐⣸⣿⡿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠇⠉⠒⠶⠉⠀⠀⢻⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⣠⣿⠃⠀⠀⠀⠁⠀⠀⠀⠀⢻⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⣼⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣦⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⢠⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⡆⠀⠀⠀⠀",
  "⠀⠀⠀⠀⢀⣾⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⡀⠀⠀⠀",
  "⠀⠀⠀⢀⣾⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⡇⠀⠀⠀",
  "⠀⠀⠀⡸⠋⠛⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⢼⣿⣿⣿⣿⠃⠀⠀⠀",
  "⡐⠀⠈⠀⠀⠀⠈⢻⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⡿⠿⠃⠀⠀⠀⠀",
  "⢡⠀⠀⠀⠀⠀⠀⠀⠻⣿⠷⠀⠀⠀⠀⠀⠀⠀⣠⠃⠀⠀⠀⠀⠀⠀⠐⠠⡀",
  "⡄⠀⠀⠀⠀⠀⠀⠀⠀⠑⣄⠀⠀⠀⠀⣀⣤⣾⣿⠀⠀⠀⠀⠀⠀⠀⣀⡠⠃",
  "⠒⠠⠤⣀⣄⡀⠀⠀⢀⣰⣿⠿⠿⠿⠿⠿⠿⠿⣿⡄⠀⠀⢀⡠⠔⠉⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠉⠙⠊⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠈⠻⠷⠿⠋⠀⠀⠀⠀⠀⠀",
];

function Footer() {
  // in case here not sure if need it 
  const [hoveredLink, setHoveredLink] = useState(null);

  // this thing calculates the coloubns dont delete it
  const getColumnPosition = (index) => {
    const basePosition = 768;
    const spacing = 208;
    return basePosition + (index * spacing);
  };

  return (
    <footer className="relative w-full bg-[#0d0d0d] border-t border-[#2e2e2e] overflow-hidden h-[364px]">

      {/* Big bg text*/}
      <div className="absolute top-0 left-0 right-0 h-[160px] overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[80px] left-[568px] -translate-y-1/2 font-bold text-[192px] tracking-[2px] text-[rgba(242,242,242,0.05)] leading-[192px] whitespace-nowrap">
          FetchCtl
        </div>
      </div>

      {/* Tux ASCII */}
      <div className="absolute top-[100px] right-[170px] text-[#8c8c8c] text-[7px] leading-[10px] font-mono pointer-events-none select-none">
        {tuxAscii.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>

      {/* Logo and description section */}
      <div className="absolute left-[153px] top-[113px]">
        <div className="flex items-center gap-[9px]">
          <img src={LOGO_URL} alt="FetchCtl logo" className="w-[28px] h-[28px] rounded-full" />
          <span className="font-bold italic text-[#f2f2f2] text-[17.6px] tracking-[-0.44px]">
            FetchCtl
          </span>
        </div>
        
        {/* description */}
        <p className="mt-[37px] text-[14px] leading-[22.75px] text-[#8c8c8c] w-[239px]">
          Generate, customize and share your terminal configs visually.
        </p>
        
        {/* GitHub link */}
        <a 
          href="https://github.com/HlibSamodin11/FetchCtl" 
          target="_blank" 
          className="inline-block mt-[27px] hover:opacity-70 transition"
        >
          <img src={GITHUB_ICON_URL} alt="GitHub" className="w-[25px] h-[25px]" />
        </a>
      </div>

      {/* Footer link columns mistik here i used map instead of hardcoding each one */}
      {footerLinks.map((section, sectionIndex) => {
        const leftPosition = getColumnPosition(sectionIndex);
        
        return (
          <div 
            key={sectionIndex} 
            className="absolute top-[113px]" 
            style={{ left: leftPosition + 'px' }}
          >
            <h4 className="text-[#f2f2f2] font-bold text-[14px] leading-[20px]">
              {section.title}
            </h4>
            <ul className="mt-[36px] space-y-[22px]">
              {section.items.map((linkItem, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className="text-[#8c8c8c] text-[14px] leading-[20px] hover:text-white transition"
                    onMouseEnter={() => setHoveredLink(`${sectionIndex}-${i}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {linkItem}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      
      {/* copyright and links  */}
      <div className="absolute left-[144px] right-[144px] top-[299px] border-t border-[#2e2e2e] pt-[18px] flex justify-between items-center">
        <p className="text-[#8c8c8c] text-[12px] leading-[16px]">
          © 2026 FetchCtl. All rights reserved.
        </p>
        <p className="text-[#8c8c8c] text-[12px] flex gap-1">
          Made by{" "}
          <a 
            href="https://github.com/HlibSamodin11" 
            target="_blank" 
            className="text-white hover:text-gray-400 transition"
          >
            HlibSamodin
          </a>
          {" "}&{" "}
          <a 
            href="https://github.com/MstyslavSoroka" 
            target="_blank" 
            className="text-white hover:text-gray-400 transition"
          >
            MstyslavSoroka
          </a>
        </p>
      </div>

    </footer>
  );
}

export default Footer;