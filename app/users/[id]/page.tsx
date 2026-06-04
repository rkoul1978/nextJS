// (Server Component)
export async function generateStaticParams() {
  // This function generates the static params for the dynamic route
  const token = process.env.API_TOKEN || '';
  const users = await fetch('http://localhost:3000/api/users', {
    credentials: 'include',
    headers: {
      'Cookie': `token=${token}`
    }
  }).then(res => res.json());

  return users.map((user: any) => ({ 
    id: user._id.toString() 
}));
}
  

export default async function UserByIDPage({ params }: any) {
  const { id } = await params;
  // This fetch is also cached for SSG
  const user = await fetch(`http://localhost:3000/api/users/${id}`).then((res) => res.json());
  if(user.userid)
    return <h1>userid : {user.userid}</h1>
  else
    return <h1>Error:   {user.error}</h1>
}