import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

interface IParams {
  conversationId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id)
      return new NextResponse('Unauthorized', { status: 401 });

    // Fetch the conversation, including its users for real-time updates
    const existingConversation = await prisma?.conversation.findMany({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    });

    if (!existingConversation)
      return new NextResponse('Invalid ID', { status: 400 });

    // Delete the conversation if the current user is a participant
    const deletedConversation = await prisma.conversation.delete({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    })

    return NextResponse.json(deletedConversation);
  } catch (error) {}
}
