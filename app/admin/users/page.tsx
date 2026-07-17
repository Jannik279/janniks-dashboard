"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  email: string;
  username: string;
  role: string;
  banned: boolean;
  created_at: string;
};

export default function AdminPage() {
const router = useRouter();

const [users, setUsers] = useState<Profile[]>([]);
const [loading, setLoading] = useState(true);

const [newUsername, setNewUsername] =
useState("");

const [newPassword, setNewPassword] =
useState("");

const [creating, setCreating] =
useState(false);

const [search, setSearch] =
  useState("");

useEffect(() => {
checkAdmin();
}, []);

async function checkAdmin() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user) {
  router.push("/login");
  return;
}

const { data: profile } =
  await supabase
    .from("profiles")
    .select("banned")
    .eq("id", user.id)
    .single();

if (profile?.banned) {
  await supabase.auth.signOut();

  alert(
    "Dein Konto wurde gesperrt."
  );

  return;
}

loadUsers();

}

async function loadUsers() {
const { data, error } =
await supabase
.from("profiles")
.select("*")
.order("username");

if (error) {
console.error(
"Fehler beim Laden:",
error
);
} else {
setUsers(data || []);
}

setLoading(false);
}


async function createUser() {
if (!newUsername || !newPassword) {
alert(
"Bitte Benutzername und Passwort eingeben"
);
return;
}

setCreating(true);

try {
  const res = await fetch(
    "/api/admin/create-user",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  alert("Benutzer erstellt");

  setNewUsername("");
  setNewPassword("");

  await loadUsers();
} catch (error) {
  console.error(error);

  alert(
    "Fehler beim Erstellen"
  );
} finally {
  setCreating(false);
}

}

async function makeAdmin(id: string) {
await supabase
.from("profiles")
.update({
role: "admin",
})
.eq("id", id);

loadUsers();

}



async function makeUser(id: string) {
const {
data: { user },
} = await supabase.auth.getUser();

if (user?.id === id) {
  alert(
    "Du kannst dir selbst die Adminrechte nicht entziehen."
  );
  return;
}

await supabase
  .from("profiles")
  .update({
    role: "user",
  })
  .eq("id", id);

loadUsers();

}

async function toggleBan(
  id: string,
  banned: boolean
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id === id) {
    alert(
      "Du kannst dich nicht selbst sperren."
    );
    return;
  }

  await supabase
    .from("profiles")
    .update({
      banned: !banned,
    })
    .eq("id", id);

  loadUsers();
}

async function deleteUser(
id: string
) {
const {
data: { user },
} = await supabase.auth.getUser();

if (user?.id === id) {
alert(
"Du kannst dich nicht selbst löschen."
);
return;
}

const confirmed =
confirm(
"Benutzer wirklich löschen?"
);

if (!confirmed) return;

try {
const res = await fetch(
"/api/admin/delete-user",
{
method: "POST",
headers: {
"Content-Type":
"application/json",
},
body: JSON.stringify({
userId: id,
}),
}
);

const data =
  await res.json();

if (!res.ok) {
  console.error(data);

  alert(
    JSON.stringify(data)
  );

  return;
}

loadUsers();

} catch {
alert(
"Fehler beim Löschen"
);
}
}

async function changePassword(
id: string
) {
const password =
prompt(
"Neues Passwort eingeben:"
);

if (!password) return;

try {
const res = await fetch(
"/api/admin/change-password",
{
method: "POST",
headers: {
"Content-Type":
"application/json",
},
body: JSON.stringify({
userId: id,
password,
}),
}
);

const data =
  await res.json();

if (!res.ok) {
  alert(data.error);
  return;
}

alert(
  "Passwort geändert"
);

} catch {
alert(
"Fehler beim Ändern"
);
}
}

return (
<div className="p-8">
<h1 className="text-5xl font-bold mb-8">
👑 Benutzerverwaltung
</h1>

  <div
    className="
      bg-white/5
      border
      border-white/10
      rounded-3xl
      p-6
      mb-8
    "
  >
    <h2 className="text-2xl font-bold mb-4">
      ➕ Benutzer erstellen
    </h2>

    <div className="grid gap-3">
      <input
        type="text"
        placeholder="Benutzername"
        value={newUsername}
        onChange={(e) =>
          setNewUsername(
            e.target.value
          )
        }
        className="
          bg-black/20
          border
          border-white/10
          rounded-xl
          px-4
          py-3
        "
      />

      <input
        type="password"
        placeholder="Passwort"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(
            e.target.value
          )
        }
        className="
          bg-black/20
          border
          border-white/10
          rounded-xl
          px-4
          py-3
        "
      />

      <button
        onClick={createUser}
        disabled={creating}
        className="
          bg-green-600
          hover:bg-green-700
          rounded-xl
          py-3
          font-semibold
        "
      >
        {creating
          ? "Erstelle..."
          : "Benutzer erstellen"}
      </button>
    </div>
  </div>
<input
  type="text"
  placeholder="Benutzer suchen..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="
    w-full
    mb-6
    bg-black/20
    border
    border-white/10
    rounded-xl
    px-4
    py-3
  "
/>
  <div className="mb-6 text-zinc-400">
    Nutzer insgesamt: {users.length}
  </div>

  {loading ? (
    <div>Lade Benutzer...</div>
  ) : (
    <div className="grid gap-4">
      {users
  .filter((user) =>
    user.username
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )
  )
  .map((user) => (
        <div
          key={user.id}
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-5
          "
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl">
                👤 {user.username}
              </h2>

              <p className="text-zinc-400">
                Rolle: {user.role}
              </p>
              <p
                className={
                  user.banned
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {user.banned
                  ? "🚫 Gesperrt"
                  : "🟢 Aktiv"}
              </p>

              <p className="text-zinc-500 text-sm">
                {user.email}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  makeAdmin(user.id)
                }
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-green-600
                "
                
              >
                Admin
              </button>

              <button
                onClick={() =>
                  makeUser(user.id)
                }
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-600
                "
              >
                User
                </button>

                  <button
                    onClick={() =>
                      changePassword(user.id)
                    }
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-yellow-600
                    "
                  >
                    Passwort
                    </button>

                  <button
                onClick={() =>
                  toggleBan(
                    user.id,
                    user.banned
                  )
                }
                className={`
                  px-4
                  py-2
                  rounded-xl
                  ${
                    user.banned
                      ? "bg-green-600"
                      : "bg-orange-600"
                  }
                `}
              >
                {user.banned
                  ? "Entsperren"
                  : "Sperren"}
              </button>
                  
                    <button
                      onClick={() =>
                    deleteUser(user.id)
                    }
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-red-600
                    "
                >
                  Löschen
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

);
}