import React from 'react';
import UsersTableListing from './components/UsersTableListing';
import { getServerUser } from '@/actions/auth';

export default async function page() {
  const user = await getServerUser();

  return (
    <div>
      <UsersTableListing userId={user?.id} />
    </div>
  );
}
