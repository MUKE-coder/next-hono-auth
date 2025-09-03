import { getServerUser } from "@/actions/auth";
import UserProfile from "./components/user-profile";

export default async function UserProfilePage() {
	const user = await getServerUser();
	if (!user) return <div>Please log in</div>;
	return <UserProfile userId={user.id} />;
}
