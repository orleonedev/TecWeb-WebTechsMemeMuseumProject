/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const memeCount = await prisma.meme.count();
  if (memeCount > 0) {
    console.log('Database already seeded with memes.');
    return;
  }

  // 1. Create Users
  const password = await bcrypt.hash('test1234', 10);
  const users = [];
  
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        username: `MemeLord${i}`,
        password,
      },
    });
    users.push(user);
    console.log(`Created user: ${user.username}`);
  }

  // 2. Create Tags
  const tagNames = ['funny', 'cats', 'tech', 'coding', 'random', 'dogs', 'school', 'work', 'gaming', 'music'];
  const tags = [];
  
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags.push(tag);
  }

  // 3. Create Memes (50)
  for (let i = 1; i <= 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomTags = tags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1); // 1 to 3 tags

    const meme = await prisma.meme.create({
      data: {
        title: `Meme Title ${i} - ${randomTags.map(t => t.name).join(' ')}`,
        description: `This is a randomly generated description for meme number ${i}. It is very funny.`,
        imageUrl: '/uploads/seed-meme.svg',
        userId: randomUser.id,
        tags: {
          connect: randomTags.map(t => ({ id: t.id })),
        },
      },
    });
    console.log(`Created meme: ${meme.id}`);

    // 4. Add Votes
    let score = 0;
    const numVotes = Math.floor(Math.random() * 15); // 0 to 15 votes
    for (let j = 0; j < numVotes; j++) {
      const voter = users[Math.floor(Math.random() * users.length)];
      // Avoid duplicate votes
      const existingVote = await prisma.vote.findUnique({
        where: { userId_memeId: { userId: voter.id, memeId: meme.id } }
      });
      
      if (!existingVote) {
        const val = Math.random() > 0.3 ? 1 : -1;
        await prisma.vote.create({
          data: {
            value: val, // Mostly upvotes
            userId: voter.id,
            memeId: meme.id,
          },
        });
        score += val;
      }
    }
    
    // Update score
    await prisma.meme.update({
      where: { id: meme.id },
      data: { score }
    });

    // 5. Add Comments
    const numComments = Math.floor(Math.random() * 5); // 0 to 5 comments
    for (let k = 0; k < numComments; k++) {
      const commenter = users[Math.floor(Math.random() * users.length)];
      await prisma.comment.create({
        data: {
          text: `LMAO this is great! (Comment ${k + 1})`,
          userId: commenter.id,
          memeId: meme.id,
        },
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
