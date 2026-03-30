import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

export default function EditProfile({ user, profile, onSave, onClose }) {
  const [displayName,   setDisplayName]   = useState(profile.display_name ?? '');
  const [bio,           setBio]           = useState(profile.bio ?? '');
  const [location,      setLocation]      = useState(profile.location ?? '');
  const [website,       setWebsite]       = useState(profile.website ?? '');
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url ?? null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');
  const fileRef = useRef(null);

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  }

  async function save() {
    setLoading(true);
    setError('');

    let avatar_url = profile.avatar_url;

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true });
      if (upErr) { setError(upErr.message); setLoading(false); return; }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      avatar_url = urlData.publicUrl + '?t=' + Date.now(); // bust cache
    }

    const updates = {
      display_name: displayName.trim() || null,
      bio:          bio.trim()         || null,
      location:     location.trim()    || null,
      website:      website.trim()     || null,
      avatar_url,
    };

    const { error: saveErr } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (saveErr) { setError(saveErr.message); setLoading(false); return; }
    onSave({ ...profile, ...updates });
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-accent-bg border border-button-stroke rounded-2xl px-8 py-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-accent-bg border border-button-stroke border-t-0 rounded-b-xl px-4 py-1 flex items-center gap-2">
          <span className="text-xs font-bold italic text-accent-text">Edit profile</span>
        </div>

        {/* avatar */}
        <div className="flex items-center gap-5 pt-2">
          <div className="relative shrink-0 cursor-pointer group" onClick={() => fileRef.current?.click()}>
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="w-16 h-16 rounded-full object-cover border border-accent-text/20" />
              : <Initials username={profile.username} size={64} />
            }
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-lg border border-accent-text/20 text-accent-text hover:border-accent-text/50 transition"
            >
              Change avatar
            </button>
            <p className="text-main-text/30 text-[10px] mt-1">JPG, PNG, GIF — max 2MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
        </div>

        <Field label="Display name" placeholder="Your name"              value={displayName} onChange={setDisplayName} />
        <Field label="Bio"          placeholder="Tell us about yourself" value={bio}         onChange={setBio} multiline />
        <Field label="Location"     placeholder="Earth"                  value={location}    onChange={setLocation} />
        <Field label="Website"      placeholder="https://yoursite.com"   value={website}     onChange={setWebsite} />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-accent-text/20 text-accent-text text-sm hover:border-accent-text/50 transition"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-get-started-bg text-get-started-text text-sm font-bold ring-1 ring-black/20 hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, multiline }) {
  const cls = 'w-full bg-button-bg border border-button-stroke rounded-xl px-4 py-2.5 text-sm text-accent-text placeholder:text-main-text/30 outline-none focus:border-accent-text/50 transition resize-none';
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-main-text/40">{label}</label>
      {multiline
        ? <textarea className={cls} placeholder={placeholder} value={value} rows={3} onChange={e => onChange(e.target.value)} />
        : <input    className={cls} placeholder={placeholder} value={value}         onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}

function Initials({ username, size }) {
  const initials = username?.slice(0, 2).toUpperCase() ?? '??';
  const hue = username ? [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 200;
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold font-jetbrains"
      style={{
        width: size, height: size,
        background: `hsl(${hue}deg 40% 18%)`,
        color: `hsl(${hue}deg 70% 70%)`,
        fontSize: size * 0.3,
      }}
    >
      {initials}
    </div>
  );
}