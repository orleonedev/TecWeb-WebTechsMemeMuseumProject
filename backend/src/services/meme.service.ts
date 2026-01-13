import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

export const createMeme = async (title: string, imageUrl: string, userId: number, tags: string[], description?: string) => {
  const lowerTags = tags.map(tag => tag.toLowerCase());
  return prisma.meme.create({
    data: {
      title,
      imageUrl,
      userId,
      description,
      tags: {
        connectOrCreate: lowerTags.map(tag => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
    include: {
      tags: true,
      user: {
        select: { username: true }
      },
    }
  });
};

export const findAllMemes = async (options: {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
  sortBy?: 'date' | 'popularity';
  order?: 'asc' | 'desc';
  userId?: number;
}) => {
  const { page = 1, limit = 10, tag, search, sortBy = 'date', order = 'desc', userId } = options;
  const skip = (page - 1) * limit;

  const where: Prisma.MemeWhereInput = {};
  
  if (tag) {
    if (tag.includes(',')) {
      const tagsList = tag.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== '');
      where.tags = {
        some: {
          name: { in: tagsList }
        }
      };
    } else {
      where.tags = {
        some: { name: tag.toLowerCase() }
      };
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { tags: { some: { name: { contains: search } } } }
    ];
  }

  if (userId) {
    where.userId = userId;
  }

  const orderBy: Prisma.MemeOrderByWithRelationInput = {};
  if (sortBy === 'date') {
    orderBy.createdAt = order;
  } else if (sortBy === 'popularity') {
    orderBy.score = order;
  }

  const [memes, total] = await Promise.all([
    prisma.meme.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        tags: true,
        user: {
          select: { username: true }
        },
        _count: {
          select: {
            votes: true,
            comments: true
          }
        },
        votes: true 
      }
    }),
    prisma.meme.count({ where })
  ]);

  return {
    memes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const findMemeById = async (id: number) => {
  return prisma.meme.findUnique({
    where: { id },
    include: {
      tags: true,
      user: {
        select: { username: true }
      },
      comments: {
        include: {
          user: {
            select: { username: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      votes: true,
      _count: {
        select: {
          votes: true,
          comments: true
        }
      }
    },
  });
};

export const deleteMeme = async (id: number) => {
  await prisma.vote.deleteMany({
    where: { memeId: id },
  });
  await prisma.comment.deleteMany({
    where: { memeId: id },
  });
  return prisma.meme.delete({
    where: { id },
  });
};

export const getMemeOfTheDay = async () => {
  // A simple rotation algorithm: based on the current day of the year
  const count = await prisma.meme.count();
  if (count === 0) return null;

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const skip = dayOfYear % count;

  const meme = await prisma.meme.findFirst({
    skip,
    include: {
      tags: true,
      user: {
        select: { username: true }
      },
      _count: {
        select: { votes: true, comments: true }
      },
      votes: true
    }
  });

  return meme;
};
