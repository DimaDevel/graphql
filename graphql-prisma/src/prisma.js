import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, '{ id }');

  const user = await prisma.query.user({
    where: {
      id: authorId
    }
  }, '{ id name email posts { id title published } }');

  return user;
};


// createPostForUser('ck60x7rsq000k07046s26lhxu', {
//   title: 'Great books to read',
//   body: 'The War of Art',
//   published: true
// }).then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost({
    where: {
      id: postId
    },
    data: {
      ...data
    }
  }, '{ author { id } }');

  return prisma.query.user({
    where: {
      id: post.author.id
    }
  }, '{ id name email posts { id title body published } }');
};

updatePostForUser('ck60xdsww000x0704uz398g5b', { body: 'Body was changed...' }).then((data) => {
  console.log(JSON.stringify(data, undefined, 2));
});
// prisma.query.users(null, '{ id name email posts { id title } }').then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.mutation.createPost({
//   data: {
//     title: 'this is title for test call graphql from node js!!!!!!!!',
//     body: 'this is simple body for test creating post from node js!!!!!!',
//     published: true,
//     author: {
//       connect: {
//         id: 'ck5yf7v6y00250758bx9k518r'
//       }
//     }
//   }
// }, '{ id title body published author { name id }}').then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
//   return prisma.query.users(null, '{ id name posts { id title } }');
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.mutation.updatePost({
//   where: {
//     id: 'ck5ygfgvy005m0758lym2k7de'
//   },
//   data: {
//     published: true,
//     title: 'graphQl 101'
//   }
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
//   return prisma.query.posts(null, '{ id title body published }');
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });