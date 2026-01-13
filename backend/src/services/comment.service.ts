import prisma from '../lib/prisma';

export const createComment = async (userId: number, memeId: number, text: string) => {
  return prisma.comment.create({
    data: {
      userId,
      memeId,
      text,
    },
    include: {
      user: {
        select: { username: true }
      }
    }
  });
};

export const getMemeComments = async (memeId: number) => {
  return prisma.comment.findMany({
    where: { memeId },
    include: {
      user: {
        select: { username: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const deleteComment = async (commentId: number, userId: number) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId }
  });

  if (!comment) throw new Error('Comment not found');
  if (comment.userId !== userId) throw new Error('Unauthorized');

  return prisma.comment.delete({
    where: { id: commentId }
  });
};
