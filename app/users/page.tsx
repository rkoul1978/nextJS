// (Server Component)
async function getUsers() {
// This authenticated fetch with token runs on the server (no client-side code needed here)
  const token = process.env.API_TOKEN || '';
  const res = await fetch('http://localhost:3000/api/users', {
    credentials: 'include',
    headers: {
      'Cookie': `token=${token}`
    }
  });
  const users = await res.json();
  return users;
}

export default async function UsersPage() {
  const users = await getUsers();
 
  return (
    <main>
      <h1>Users</h1>
      <ul>
        {users && users.length > 0 ? (
          users.map((user: any) => (
            <li key={user._id}>{user.name}&nbsp;&nbsp;{user.email}</li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </main>
  );
}