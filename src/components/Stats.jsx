import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Stats() {
  const [asciiNum, setAsciiNum] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [users, setUsers] = useState(0);

  const fetchASCII = async () => {
    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    setAsciiNum(count ?? 0);
  };
  const fetchNewUsers = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());

    if (error) {
      console.error(error);
      return;
    }

    setNewUsers(count ?? 0);
  };

  const fetchUsers = async () => {
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error(error);
      return;
    }

    setUsers(count ?? 0);
  };

  useEffect(() => {
    fetchASCII();
    fetchNewUsers();
    fetchUsers();
  }, []);

  return (
    <section className="flex items-center justify-center gap-10 py-20 text-main-text flex-wrap">
      <div className="flex h-48 w-48 flex-col items-center justify-center gap-2 rounded-full border border-reverse/20 shadow-[0_0_20px_rgba(181,181,181,0.2)]">
        <p className="text-4xl text-accent-text">{asciiNum}</p>
        <p className="text-sm text-center">Different ASCII to choose</p>
      </div>

      <div className=" sm:mt-[150px] flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full border border-reverse/20 shadow-[0_0_20px_rgba(181,181,181,0.2)]">
        <p className="text-xl text-accent-text">0</p>
        <p className="text-[10px] text-center">
          Unique Configs Created This Month
        </p>
      </div>

      <div className="flex h-48 w-48 flex-col items-center justify-center gap-2 rounded-full border border-reverse/20 shadow-[0_0_20px_rgba(181,181,181,0.2)]">
        <p className="text-4xl text-accent-text">0</p>
        <p className="text-sm text-center">Configs Posted</p>
      </div>

      <div className="sm:mt-[150px] flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full border border-reverse/20 shadow-[0_0_20px_rgba(181,181,181,0.2)]">
        <p className="text-xl text-accent-text">{newUsers}</p>
        <p className="text-[10px] text-center">New members this month</p>
      </div>

      <div className="flex h-48 w-48 flex-col items-center justify-center gap-2 rounded-full border border-reverse/20 shadow-[0_0_20px_rgba(181,181,181,0.2)]">
        <p className="text-4xl text-accent-text">{users}</p>
        <p className="text-sm text-center">Users</p>
      </div>
    </section>
  );
}

export default Stats;
