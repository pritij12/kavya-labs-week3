import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

// Only admins can use these routes
async function getAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN' ? session : null;
}

const fail = (message, status) => NextResponse.json({ error: message }, { status });

// Change a user: make admin / remove admin, suspend / activate
export async function PATCH(req, { params }) {
  try {
    const admin = await getAdmin();
    if (!admin) return fail('Admins only.', 403);
    if (params.id === admin.user.id) return fail('You cannot change your own account.', 400);

    const { action } = await req.json();
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) return fail('User not found.', 404);

    if (action === 'toggleRole') {
      await prisma.user.update({ where: { id: user.id }, data: { role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' } });
    } else if (action === 'toggleStatus') {
      await prisma.user.update({ where: { id: user.id }, data: { status: user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } });
    } else {
      return fail('Unknown action.', 400);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return fail('Something went wrong.', 500);
  }
}

// Delete a user
export async function DELETE(_req, { params }) {
  try {
    const admin = await getAdmin();
    if (!admin) return fail('Admins only.', 403);
    if (params.id === admin.user.id) return fail('You cannot delete your own account.', 400);

    await prisma.user.deleteMany({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return fail('Something went wrong.', 500);
  }
}
