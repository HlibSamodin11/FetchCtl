import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const inputCls = 'w-full bg-button-bg border border-button-stroke rounded-xl px-4 py-2.5 text-sm text-accent-text placeholder:text-main-text/30 outline-none focus:border-accent-text/50 transition';

function Field({ label, children }) {
  return (
    <div className="flex flex-col bg-area border border-area-border rounded-2xl p-5 gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-main-text pb-2">{label}</label>
      {children}
    </div>
  );
}

export default function NewPostPage({ user }) {
  const nav = useNavigate();
  const [title,    setTitle]    = useState('');
  const [content,  setContent]  = useState('');
  const [desc,     setDesc]     = useState('');
  const [tagsRaw,  setTagsRaw]  = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState('');

  async function publish() {
    if (!title.trim() || !content.trim()) {
      setErr('title and content required');
      return;
    }

    setLoading(true);
    setErr('');

    const tags = tagsRaw
      .split(/[,\s]+/)
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id:     user.id,
        title:       title.trim(),
        content:     content.trim(),
        description: desc.trim() || null,
        is_public:   isPublic,
        tags,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    nav(`/post/${data.id}`);
  }

  return (
    <div className="bg-bg min-h-screen px-6 md:px-12 flex justify-center">
      <div className="container py-10">
        <header className="mb-10">
          <h1
            className="flex text-accent-text items-center gap-2 text-xl cursor-pointer"
            onClick={() => nav(-1)}
          >
            <svg className="w-5 h-5">
              <use href="/sprite.svg#icon-arrow" className="fill-main-text rotate-180 origin-center" />
            </svg>
            New Post
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col gap-5 flex-1">
            <Field label="Title">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="my cool ascii art"
                className={inputCls}
              />
            </Field>

            <Field label="ASCII Content">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="paste your ascii art here..."
                rows={12}
                className={`${inputCls} font-mono text-xs resize-y`}
                style={{ whiteSpace: 'pre', overflowX: 'auto' }}
              />
            </Field>

            <Field label="Description (optional)">
              <input
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="short description"
                className={inputCls}
              />
            </Field>

            <Field label="Tags (optional, comma separated)">
              <input
                value={tagsRaw}
                onChange={e => setTagsRaw(e.target.value)}
                placeholder="cat, cute, dark"
                className={inputCls}
              />
            </Field>

            <div className="flex items-center gap-3 px-1">
              <button
                onClick={() => setIsPublic(p => !p)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isPublic ? 'bg-accent-text' : 'bg-button-bg'}`}
              >
                <div className={`w-4 h-4 rounded-full transform transition-all duration-200 ${isPublic ? 'translate-x-6 bg-bg' : 'translate-x-0 bg-reverse'}`} />
              </button>
              <span className="text-sm text-accent-text">{isPublic ? 'Public' : 'Private'}</span>
            </div>

            {err && <p className="text-xs text-red-500">{err}</p>}

            <div className="flex justify-end">
              <button
                onClick={publish}
                disabled={loading}
                className="py-2.5 px-10 rounded-xl bg-get-started-bg text-get-started-text text-sm font-bold hover:opacity-80 transition disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-main-text/30 font-jetbrains mb-4">Preview</p>
            <div className="rounded-2xl border border-reverse/50 p-4 min-h-48">
              {content ? (
                <>
                  <p className="text-accent-text font-bold mb-2">{title || 'untitled'}</p>
                  <pre className="text-accent-text text-xs leading-tight whitespace-pre font-mono overflow-x-auto">{content}</pre>
                  {desc && <p className="text-main-text/50 text-xs mt-3">{desc}</p>}
                </>
              ) : (
                <p className="text-main-text/20 text-sm text-center mt-16">start typing to preview</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}