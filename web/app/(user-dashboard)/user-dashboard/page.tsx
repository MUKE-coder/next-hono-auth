import { getServerUser } from "@/actions/auth";
import UserProfile from "./user-profile/components/user-profile";
// import UserProfile from "./components/user-profile";

export default async function UserProfilePage() {
	const user = await getServerUser();
	if (!user) return <div>Please log in</div>;
	return <UserProfile userId={user.id} />;
}
