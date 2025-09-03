import { getServerUser } from '@/actions/auth';
import ProfilePage from './edit-page';

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getServerUser();

  const userRole = user?.role;
  return <ProfilePage userId={id} userRole={userRole} />;
}
