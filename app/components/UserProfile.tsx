import { getCurrentUser } from "@/lib/auth-helper";

export default async function UserProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const email = user.email ?? "";
  const name = user.name || email.split("@")[0] || "Utilisateur";
  const avatar = name.charAt(0).toUpperCase();

  return (
    <div className="border-t border-green-600 px-6 py-5">

      <div className="flex items-center gap-3">

        <div className="w-12 h-12 rounded-full bg-white text-green-700 flex items-center justify-center font-bold text-lg">
          {avatar}
        </div>

        <div className="flex-1">

          <p className="font-semibold truncate">
            {name}
          </p>

          <p className="text-xs text-green-200 truncate">
            {email}
          </p>

          <div className="flex items-center gap-2 mt-1">

            <div className="w-2 h-2 rounded-full bg-green-300"></div>

            <span className="text-xs text-green-200">
              En ligne
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}