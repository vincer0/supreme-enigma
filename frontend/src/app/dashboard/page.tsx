import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import { fetchUserLists } from "@/lib/actions/user-lists";

export default async function Dashboard() {
  const session = await auth();
  const lists = await fetchUserLists();

  console.log("User Lists:", lists);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-lg">{session?.user.name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg">{session?.user.email}</p>
          </div>

          <div className="pt-4">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button type="submit" variant="outline" className="w-full">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </div>
  </div>
  );
}
