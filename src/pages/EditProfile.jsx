import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function bannerStyle(username) {
  if (!username) return {};
  const hue = [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const hue2 = (hue + 60) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${hue}deg 30% 12%) 0%, hsl(${hue2}deg 25% 18%) 50%, hsl(${hue}deg 20% 10%) 100%)`,
  };
}

export default function EditProfile({ user }) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) return;

        setProfile(data);
        setDisplayName(data.display_name ?? '');
        setBio(data.bio ?? '');
        setLocation(data.location ?? '');
        setWebsite(data.website ?? '');
        setAvatarPreview(data.avatar_url ?? null);
      });
  }, [user]);

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  }

  async function save() {
    if (!profile) return;

    setLoading(true);
    setError('');

    let avatar_url = profile.avatar_url;

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true });

      if (upErr) {
        setError(upErr.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      avatar_url = urlData.publicUrl + '?t=' + Date.now();
    }

    const updates = {
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      location: location.trim() || null,
      website: website.trim() || null,
      avatar_url,
    };

    const { error: saveErr } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (saveErr) {
      setError(saveErr.message);
      setLoading(false);
      return;
    }

    navigate(`/u/${profile.username}`);
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-main-text/40 text-sm font-jetbrains animate-pulse">
          loading...
        </p>
      </div>
    );
  }

  return (
    <section className="bg-bg px-6 md:px-12 flex justify-center">
      <div className="min-h-screen flex flex-col  container ">
        <header className="py-10">
          <h1
            className="flex text-accent-text items-center gap-2 text-xl cursor-pointer"
            onClick={() => navigate(`/u/${profile.username}`)}
          >
            <svg className="w-5 h-5">
              <use
                href="/sprite.svg#icon-arrow"
                className="fill-main-text rotate-180 origin-center"
              ></use>
            </svg>
            Account
          </h1>
        </header>
        <div className="flex justify-center">
          <div className="w-full md:w-2/3">
            <div className="rounded-2xl border border-area-border overflow-hidden relative">
              <div
                className="w-full h-36"
                style={bannerStyle(profile.username)}
              />

              <div className="w-full h-16 bg-area" />

              <div className="absolute left-6 bottom-6 border-4 border-area rounded-full">
                <div
                  className="relative shrink-0 cursor-pointer group"
                  onClick={() => fileRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="w-20 h-20 rounded-full object-cover border border-accent-text/20"
                    />
                  ) : (
                    <Initials username={profile.username} size={64} />
                  )}

                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span>
                      <svg className="w-5 h-5">
                        <use
                          href="/sprite.svg#icon-camera"
                          className="stroke-accent-text"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={pickFile}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 py-5">
              <Field
                label="Display name"
                value={displayName}
                onChange={setDisplayName}
              />

              <Field label="Bio" value={bio} onChange={setBio} multiline />

              <Field label="Location" value={location} onChange={setLocation} />

              <Field label="Website" value={website} onChange={setWebsite} />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex justify-end">
              <button
                onClick={save}
                disabled={loading}
                className="py-2.5 px-10 rounded-xl bg-get-started-bg text-get-started-text text-sm font-bold hover:opacity-80 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, multiline }) {
  const cls =
    'w-full bg-button-bg border border-button-stroke rounded-xl px-4 py-2.5 text-sm text-accent-text placeholder:text-main-text/30 outline-none focus:border-accent-text/50 transition resize-none';

  return (
    <div className="flex flex-col bg-area border border-area-border rounded-2xl p-5 gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-main-text pb-2">
        {label}
      </label>

      {multiline ? (
        <textarea
          className={cls}
          value={value}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          placeholder={'Tell us about yourself...'}
        />
      ) : (
        <input
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
        />
      )}
    </div>
  );
}

function Initials({ username, size }) {
  const initials = username?.slice(0, 2).toUpperCase() ?? '??';
  const hue = username
    ? [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
    : 200;

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold font-jetbrains"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue}deg 40% 18%)`,
        color: `hsl(${hue}deg 70% 70%)`,
        fontSize: size * 0.3,
      }}
    >
      {initials}
    </div>
  );
}
