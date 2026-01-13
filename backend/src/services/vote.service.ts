import prisma from '../lib/prisma';

const updateMemeScore = async (memeId: number) => {
  const result = await prisma.vote.aggregate({
    where: { memeId },
    _sum: {
      value: true,
    },
  });
  const score = result._sum.value || 0;
  
  await prisma.meme.update({
    where: { id: memeId },
    data: { score },
  });
};

export const vote = async (userId: number, memeId: number, value: number) => {
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_memeId: {
        userId,
        memeId,
      },
    },
  });

  if (existingVote && existingVote.value === value) {
    // If user clicks the same vote again, remove it (toggle off)
    await prisma.vote.delete({
      where: {
        id: existingVote.id,
      },
    });
  } else {
    // Use upsert to handle both creation and updates
    await prisma.vote.upsert({
      where: {
        userId_memeId: {
          userId,
          memeId,
        },
      },
      update: {
        value,
      },
      create: {
        userId,
        memeId,
        value,
      },
    });
  }

  // Update denormalized score
  await updateMemeScore(memeId);
};

export const getMemeScore = async (memeId: number) => {
  const result = await prisma.vote.aggregate({
    where: { memeId },
    _sum: {
      value: true,
    },
  });
  return result._sum.value || 0;
};

export const getUserVote = async (userId: number, memeId: number) => {
  return prisma.vote.findUnique({
    where: {
      userId_memeId: {
        userId,
        memeId,
      },
    },
  });
};
