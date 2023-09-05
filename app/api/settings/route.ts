import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id)
      return new NextResponse('Unauthorized', { status: 401 });

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        name, image
      }
    });

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.log(error, 'ERROR_SETTINGS');
    return new NextResponse('Internal Error', { status: 500 })
  }
}
