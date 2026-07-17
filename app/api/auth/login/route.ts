import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
try {
const { username } = await req.json();

const { data, error } =
  await supabaseAdmin
    .from("profiles")
    .select("email")
    .ilike("username", username)
    .single();

if (error || !data) {
  return NextResponse.json(
    { error: "Benutzer nicht gefunden" },
    { status: 404 }
  );
}

return NextResponse.json({
  email: data.email,
});

} catch {
return NextResponse.json(
{ error: "Serverfehler" },
{ status: 500 }
);
}
}