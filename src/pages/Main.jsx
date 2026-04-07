import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import ViewsCounter from "../components/ViewsCounter";
import Stats from "../components/Stats";
import Features from "../components/Features";

function Main({ user }) {
  const [ascii, setAscii] = useState("Loading...");
  const [scale, setScale] = useState(1);

  const preRef = useRef(null);
  const boxRef = useRef(null);

  const fetchRandomPost = async () => {
    try {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

      if (!count) return;

      const randomIndex = Math.floor(Math.random() * count);

      const { data, error } = await supabase
        .from("posts")
        .select("content")
        .range(randomIndex, randomIndex)
        .single();

      if (error) throw error;

      setAscii(data.content);
    } catch (err) {
      console.error(err);
      setAscii("Error");
    }
  };

  useEffect(() => {
    fetchRandomPost();
    const interval = setInterval(fetchRandomPost, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pre = preRef.current;
    const box = boxRef.current;
    if (!pre || !box) return;
    const fit = () => {
      if (!pre.scrollWidth || !pre.scrollHeight) return;
      setScale(
        Math.min(
          box.clientWidth / pre.scrollWidth,
          box.clientHeight / pre.scrollHeight,
          1,
        ),
      );
    };
    const t = setTimeout(fit, 50);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [ascii]);

  return (
    <section className="flex justify-center bg-bg px-6 md:px-12 relative overflow-hidden">
      <div className="container">
        <div>
          <div className="font-jetbrains flex-col text-accent-text py-10 md:py-20 sm:flex-row flex gap-10 flex-wrap">
            <div className="flex-3">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black ">
                Customize
                <br />
                Your Fastfetch, <br />
                <span className="bg-gradient-to-r from-[#FFFFFF] to-[#252525] bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>

              <h2 className="text-xl sm:text-3xl py-5">
                Build a terminal that feels like{" "}
                <span className="bg-gradient-to-r from-[#FFFFFF]/35 to-[#252525] bg-clip-text text-transparent">
                  yours!
                </span>
              </h2>

              <p className="text-main-text text-sm sm:text-lg">
                Tweak logos, colors, layout, and modules all in one place. Built
                for developers who care about how their terminal looks and
                feels.
              </p>
            </div>

            <div className="bg-area border border-area-border flex-2 md:min-w-[400px] rounded-2xl p-5 shadow-[0_0_20px_rgba(181,181,181,0.2)]">
              <div className="flex items-center">
                <ul className="flex gap-2">
                  <li className="w-3 h-3 bg-reverse/30 rounded-2xl"></li>
                  <li className="w-3 h-3 bg-reverse/20 rounded-2xl"></li>
                  <li className="w-3 h-3 bg-reverse/10 rounded-2xl"></li>
                </ul>
                <div className="flex justify-between text-main-text pl-5 w-full text-sm">
                  <p className="hidden sm:block">fastfetch.json</p>
                  <p>popular ASCII...</p>
                </div>
              </div>

              <div
                ref={boxRef}
                className="h-[400px] py-2 relative overflow-hidden flex items-center justify-center"
              >
                <pre
                  ref={preRef}
                  className="whitespace-pre font-mono leading-none text-sm overflow-hidden text-accent-text absolute"
                  style={{
                    transform: `scale(${scale})`,
                  }}
                >
                  {ascii}
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-col items-center gap-2 py-10 text-main-text text-sm">
          <ViewsCounter />
          Total visits (live)
        </div>

        <Stats />
        <div className="relative left-1/2 right-1/2 -ml-[60vw] mr-[50vw] w-screen h-px bg-gradient-to-r from-transparent via-reverse/50 to-transparent" />
        <Features user={user} />
      </div>
    </section>
  );
}

export default Main;
