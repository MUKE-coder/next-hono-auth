import { getServerUser } from "@/actions/auth";
import UserProfileEdit from "../components/edit-user-profile";

export default async function EditProfilePage() {
	const user = await getServerUser();
	if (!user) {
		return <div>Login First</div>;
	}
	// const handleSave = (data: any) => {
	// 	console.log("Saving profile data:", data);
	// 	// Here you would typically make an API call to save the data
	// };

	// const handleCancel = () => {
	// 	// Navigate back or close the edit mode
	// 	window.history.back();
	// };

	return <UserProfileEdit userId={user.id} />;
}
