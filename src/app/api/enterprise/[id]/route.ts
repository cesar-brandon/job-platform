import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";

interface RequestBody {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const PUT = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const body: RequestBody = await request.json();
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const enterprise = await db.enterprise.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email,
        address: body.address,
        phone: body.phone,
      },
    });
    return new Response(JSON.stringify(enterprise));
  } catch (error) {
    return new Response("ERROR_UPDATING_ENTERPRISE", { status: 500 });
  }
};

const DELETE = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    console.log("PARAMS", params);
    await db.enterprise.delete({ where: { id: params.id } });
    return new Response("Deleted");
  } catch (error) {
    console.error(error);
    return new Response("ERROR_DELETING_ENTERPRISE", { status: 500 });
  }
};

export { PUT, DELETE };
