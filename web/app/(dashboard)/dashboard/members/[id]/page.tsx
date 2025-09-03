import UserDetailPage from "../components/MemberDetail";

export default async function MemberPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return <UserDetailPage userId={id} />;
}
