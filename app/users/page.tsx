interface User {
  _id: string;
  name: string;
  email: string;
}

async function getUsers(): Promise<User[]> {
  const token = process.env.API_TOKEN;

  if (!token) {
    console.warn('API_TOKEN is not defined');
    return [];
  }

  try {
    const res = await fetch('http://localhost:3000/api/users', {
      credentials: 'include',
      headers: {
        'Cookie': `token=${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch users: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <main>
      <h1>Users</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              {user.name}&nbsp;&nbsp;{user.email}
            </li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </main>
  );
}