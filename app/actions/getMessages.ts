import getCurrentUser from './getCurrentUser';
import prisma from '@/app/libs/prismadb';

const getMessages = async (ConversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) return null;

    const messages = await prisma.message.findMany({
      where: {
        conversationId: ConversationId
      },
      include: {
        sender: true,
        seen: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return messages;
  } catch (error) {
    return [];
  }
};

export default getMessages;
