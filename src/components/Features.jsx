import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Features({ user }) {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="relative py-10 flex flex-col gap-10">
      <h2 className="text-4xl text-center font-bold px-4 bg-linear-to-r from-reverse to-accent-bg bg-clip-text text-transparent">
        Our Features
      </h2>
      <div className="font-grotesk text-main-text justify-between flex flex-wrap gap-10">
        <img
          src={
            localStorage.getItem("theme") === "dark"
              ? "/previewImg/dark/imgToAscii.png"
              : "/previewImg/light/imgToAscii.png"
          }
          className="border border-accent-text/20 rounded-2xl"
        />
        <div className="flex flex-col items-start gap-2 justify-center">
          <p className="font-jetbrains text-sm">01</p>
          <h3 className="text-accent-text text-4xl">Convert Images to ASCII</h3>
          <p className="text-lg max-w-150">
            Drop any image and watch it transform into stunning ASCII art.
            Fine-tune character density, contrast, and style to get the perfect
            result for your terminal.
          </p>
          {!user ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex group py-2 text-get-started-text bg-get-started-bg px-5 rounded-4xl font-bold items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
            >
              Get Started
              <svg className="w-5 h-5">
                <use
                  href="/sprite.svg#icon-arrow"
                  className="group-hover:fill-accent-text"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => navigate("/ascii")}
              className="flex group text-get-started-text bg-get-started-bg py-2 px-5 rounded-4xl font-bold items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
            >
              Go to{" "}
              <svg className="w-5 h-5">
                <use
                  href="/sprite.svg#icon-arrow"
                  className="group-hover:fill-accent-text"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="font-grotesk text-main-text flex justify-between flex-wrap flex-row-reverse gap-10">
        <img
          src={
            localStorage.getItem("theme") === "dark"
              ? "/previewImg/dark/imgToAscii.png"
              : "/previewImg/light/imgToAscii.png"
          }
          className="border border-accent-text/20 rounded-2xl"
        />
        <div className="flex flex-col items-start gap-2 justify-center">
          <p className="font-jetbrains text-sm">02</p>
          <h3 className="text-accent-text text-4xl">
            Generate Configs with Presets
          </h3>
          <p className="text-lg max-w-150">
            Pick from hundreds of community presets or start from scratch. Tweak
            colors, layout, and info modules with a visual builder — no manual
            editing needed.
          </p>
          {!user ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex group py-2 text-get-started-text bg-get-started-bg px-5 rounded-4xl font-bold items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
            >
              Get Started
              <svg className="w-5 h-5">
                <use
                  href="/sprite.svg#icon-arrow"
                  className="group-hover:fill-accent-text"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => navigate("/builder")}
              className="flex group text-get-started-text bg-get-started-bg py-2 px-5 rounded-4xl font-bold items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
            >
              Go to{" "}
              <svg className="w-5 h-5">
                <use
                  href="/sprite.svg#icon-arrow"
                  className="group-hover:fill-accent-text"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="font-grotesk text-main-text flex justify-between flex-wrap gap-10">
        <img
          src={
            localStorage.getItem("theme") === "dark"
              ? "/previewImg/dark/imgToAscii.png"
              : "/previewImg/light/imgToAscii.png"
          }
          className="border border-accent-text/20 rounded-2xl"
        />
        <div className="flex flex-col items-start gap-2 justify-center">
          <p className="font-jetbrains text-sm">03</p>
          <h3 className="text-accent-text text-4xl">Compare Your Configs</h3>
          <p className="text-lg max-w-150">
            See how your setup stacks up. Side-by-side diffs highlight every
            difference so you can cherry-pick the best parts from any config.
          </p>
          {!user ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex group py-2 text-get-started-text bg-get-started-bg px-5 rounded-4xl font-bold items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
            >
              Get Started
              <svg className="w-5 h-5">
                <use
                  href="/sprite.svg#icon-arrow"
                  className="group-hover:fill-accent-text"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => navigate("/builder")}
              className="flex group text-get-started-text bg-get-started-bg py-2 px-5 rounded-4xl font-bold items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
            >
              Go to{" "}
              <svg className="w-5 h-5">
                <use
                  href="/sprite.svg#icon-arrow"
                  className="group-hover:fill-accent-text"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="font-grotesk text-main-text flex justify-between flex-wrap flex-row-reverse gap-10">
        <img
          src={
            localStorage.getItem("theme") === "dark"
              ? "/previewImg/dark/imgToAscii.png"
              : "/previewImg/light/imgToAscii.png"
          }
          className="border border-accent-text/20 rounded-2xl"
        />
        <div className="flex flex-col items-start gap-2 justify-center">
          <p className="font-jetbrains text-sm">04</p>
          <h3 className="text-accent-text text-4xl">
            Share with Community & Friends
          </h3>
          <p className="text-lg max-w-150">
            One link is all it takes. Share your config instantly and let others
            import it with a single click. Build together, rice together.
          </p>
          {!user ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex group py-2 text-get-started-text bg-get-started-bg px-5 rounded-4xl font-bold items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
            >
              Get Started
              <svg className="w-5 h-5">
                <use
                  href="/sprite.svg#icon-arrow"
                  className="group-hover:fill-accent-text"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => navigate("/builder")}
              className="flex group text-get-started-text bg-get-started-bg py-2 px-5 rounded-4xl font-bold items-center gap-2 transition-all hover:bg-transparent hover:ring-1 hover:ring-accent-text hover:text-accent-text hover:cursor-pointer"
            >
              Go to{" "}
              <svg className="w-5 h-5">
                <use
                  href="/sprite.svg#icon-arrow"
                  className="group-hover:fill-accent-text"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      {showForm && <GetStarted onClose={() => setShowForm(false)} />}
    </section>
  );
}

export default Features;
