import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function DisplayUsers() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  const { data: profiles } = await supabase.from("profiles").select("email, display_name, biography");

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Users List</TypographyH2>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        <table className="border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2">Display Name</th>
              <th className="border border-gray-200 px-4 py-2">Biography</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile, index) => (
              <tr key={index}>
                <td className="border border-gray-200 px-4 py-2">{profile.display_name}</td>
                <td className="border border-gray-200 px-4 py-2">{profile.biography ?? "No biography available"}</td>
                <td className="border border-gray-200 px-4 py-2">{profile.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
