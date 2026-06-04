import clientPromise from '@/lib/mongodb';
import { withAuth } from '@/lib/with-auth';
import { ObjectId } from 'mongodb';

export const GET = withAuth(secretGET);

export async function secretGET(request: Request) {     /* Get users from MongoDB with an authorized token */
  const client = await clientPromise;
  const db = client.db("reactdb");
  // fetch data from your DB here
   const users = await db.collection("users").find({}).toArray();

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

 
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { userid, password,name, firstname, lastname, email } = body;

    // Validate required fields
    if (!userid || !name || !firstname || !lastname || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields: userid, name, firstname, lastname, email" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert new user into MongoDB
    const client = await clientPromise;
    const db = client.db("reactdb");
    
    const newUser = {
      userid,
      password,
      name,
      firstname,
      lastname,
      email,
    //  createdAt: new Date()
    };

    const result = await db.collection("users").insertOne(newUser);

    return new Response(JSON.stringify({ 
      ...newUser, 
      message: "User created successfully",
      _id: result.insertedId 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error inserting user:", error);
    return new Response(JSON.stringify({ error: "Failed to insert user" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const idsParam = url.searchParams.get('ids');

    if (!idsParam) {
      return new Response(JSON.stringify({ error: "Missing 'ids' query parameter. Provide comma-separated ObjectIds." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const idStrings = idsParam.split(',').map(id => id.trim()).filter(id => id.length > 0);

    if (idStrings.length === 0) {
      return new Response(JSON.stringify({ error: "No valid IDs provided" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();

    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
      return new Response(JSON.stringify({ error: "Request body must contain update fields" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validIds: ObjectId[] = [];
    const invalidIds: string[] = [];

    for (const idStr of idStrings) {
      if (ObjectId.isValid(idStr)) {
        validIds.push(new ObjectId(idStr));
      } else {
        invalidIds.push(idStr);
      }
    }

    if (validIds.length === 0) {
      return new Response(JSON.stringify({ error: "No valid MongoDB ObjectIds provided", invalidIds }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData = {
      ...body,
      updatedAt: new Date()
    };

    const client = await clientPromise;
    const db = client.db("reactdb");

    const result = await db.collection("users").updateMany(
      { _id: { $in: validIds } },
      { $set: updateData }
    );

    return new Response(JSON.stringify({
      message: "Users updated successfully",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      validIdsCount: validIds.length,
      invalidIds: invalidIds.length > 0 ? invalidIds : undefined
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error updating users:", error);
    return new Response(JSON.stringify({ error: "Failed to update users" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

