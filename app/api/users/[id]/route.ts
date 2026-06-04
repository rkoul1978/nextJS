import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';
 
export async function GET( request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    // e.g. Query a database for user with ID `id`
    const client = await clientPromise;
    const db = client.db("reactdb");
    
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
    
  }catch (error) {
    console.error("Error getting user:", error);
    return new Response(JSON.stringify({ error: "Failed to get user" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
}
 
export async function DELETE( request: NextRequest,  { params }: { params: Promise<{ id: string }> } ) {
  try {
    const id = (await params).id;
    // Validate if id is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid user ID format" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete user with ID from MongoDB
    const client = await clientPromise;
    const db = client.db("reactdb");
    
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
        
    return new Response(JSON.stringify({ 
      message: "User deleted successfully",
      deletedId: id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(JSON.stringify({ error: "Failed to delete user" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT( request: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const id = (await params).id;
    const body = await request.json();
    
    // Validate if id is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid user ID format" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if body is empty
    if (!body || Object.keys(body).length === 0) {
      return new Response(JSON.stringify({ error: "No update data provided" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update user in MongoDB
    const client = await clientPromise;
    const db = client.db("reactdb");
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };

    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      message: "User updated successfully",
      user: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
