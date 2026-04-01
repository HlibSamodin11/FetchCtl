import { supabase } from '../../supabaseClient';
import { useState } from 'react';

function DangerSettings() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (confirmText !== 'DELETE') return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(
      'https://nihvgeovwrvflgxntoec.supabase.co/functions/v1/delete-user',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );

    setLoading(false);

    if (!res.ok) {
      alert('Failed to delete account');
      return;
    }

    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <div>
      <h2 className="text-accent-text font-bold text-xl">Danger Zone</h2>
      <p>Irreversible actions. Proceed with caution.</p>

      <div className="pt-5 flex flex-col gap-6">
        <div className="p-5 rounded-2xl bg-area border border-[#EF4343]/20">
          <h3 className="font-bold text-[#EF4343]">
            Deactivate Account (not working yet)
          </h3>
          <p>Temporarily disable your account.</p>
          <button className="mt-3 px-6 py-2 rounded-2xl border text-[#EF4343] border-[#EF4343]/30 hover:bg-[#EF4444]/10 transition">
            Deactivate
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-area border border-[#EF4343]/20">
          <h3 className="font-bold text-[#EF4343]">Delete Account</h3>
          <p>Permanently delete your account and all data.</p>
          <button
            onClick={() => setOpen(true)}
            className="mt-3 px-6 py-2 rounded-2xl border text-[#EF4343] border-[#EF4343]/30 hover:bg-[#EF4444]/10 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-bg p-6 rounded-2xl w-[90%] max-w-md">
            <h3 className="text-[#EF4343] font-bold text-lg">
              Confirm Deletion
            </h3>

            <p className="mt-2 text-sm">
              Type <b>DELETE</b> to permanently remove your account.
            </p>

            <input
              className="mt-4 w-full border p-2 rounded"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-[#EF4343] text-white disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DangerSettings;
