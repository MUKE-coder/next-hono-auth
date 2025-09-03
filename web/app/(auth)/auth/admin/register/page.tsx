import AdminRegister from '@/components/auth/AdminRegister';

export default async function page() {
  /***
   * 1. Get the Invite ID from the URL params
   *
   * 2. Get the Invite from the database using the Invite ID
   *
   * 3. If the Invite is not found, show the 404 page
   *
   * 4. If found get the details and send them to the Register component
   */
  return (
    <div>
      <AdminRegister />
    </div>
  );
}
