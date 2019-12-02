import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Type definitions (schema)

// Demo users schema
let users = [
	{
		id: '1',
		name: 'Andrew',
		email: 'andrew@example.com',
		age: 27
	},
	{
		id: '2',
		name: 'Dima',
		email: 'dima@example.com',
		age: 36
	},
	{
		id: '3',
		name: 'Olga',
		email: 'olga@example.com'
	}
];

let posts = [
	{
		id: '1',
		title: 'post 11',
		body: 'post 1 body',
		published: true,
		author: '1'
	},
	{
		id: '2',
		title: 'post 2',
		body: 'post 11',
		published: true,
		author: '1'
	},
	{
		id: '3',
		title: 'post 3',
		body: 'post 3 body',
		published: true,
		author: '2'
	}
];

let comments = [
	{
		id: 'comment 1',
		text: 'text for comment 1',
		author: '1',
		post: '1'
	},
	{
		id: 'comment 2',
		text: 'text for comment 2',
		author: '1',
		post: '1'
	},
	{
		id: 'comment 3',
		text: 'text for comment 3',
		author: '2',
		post: '2'
	},
	{
		id: 'comment 4',
		text: 'text for comment 4',
		author: '3',
		post: '3'
	}
];

const typeDefs = `
	type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
		comments(query: String): [Comment!]!
		me: User!
		post: Post!
	}

	type Mutation {
		createUser(data: CreateUserInput!): User!
		deleteUser(id: ID!): User!
		createPost(data: CreatePostInput!): Post!
		deletePost(id: ID!): Post!
		createComment(data: CreateCommentInput!): Comment!
		deleteComment(id: ID!): Comment!
	}

	input CreateUserInput {
		name: String!
		email: String!
		age: Int
	}

	input CreatePostInput {
		title: String!
		body: String!
		published: Boolean!
		author: ID!
	}

	input CreateCommentInput {
		text: String!
		author: ID!
		post: ID!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		posts: [Post!]!
		comments: [Comment!]!
	}

	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
		comments: [Comment!]!
	}

	type Comment {
		id: ID!
		text: String!
		author: User!
		post: Post!
	}
`;

// Resolvers

const resolvers = {
	Query: {
		users(parent, args, ctx, info) {
			if (!args.query) return users;
			return users.filter((user) =>  user.name.toLowerCase().includes(args.query.toLowerCase()));
		},
		posts(parent, args, ctx, info) {
			if (!args.query) return posts;
			return posts.filter((post) => {
				return post.title.toLowerCase().includes(args.query.toLowerCase()) ||
				post.body.toLowerCase().includes(args.query.toLowerCase());
			});
		},
		me() {
			return {
				id: '123123123',
				name: 'Mike',
				email: 'mike@example.com'
			}
		},
		post() {
			return {
				id: '2222222',
				title: 'this is test post',
				body: 'this is test body for post',
				published: true
			}
		},
		comments(parent, args, ctx, info) {
			if (!args.query) return comments;
			return comments.filter((comment) => {
				return comment.id.toLowerCase().includes(args.query.toLowerCase()) ||
				comment.text.toLowerCase().includes(args.query.toLowerCase());
			});
		}
	},
	Mutation: {
		createUser(parent, args, ctx, info) {
			const emailTaken = users.some((user) => {
				return user.email === args.data.email;
			});

			if (emailTaken) throw new Error('Email taken.'); 
			
			const user = {
				id: uuidv4(),
				...args.data
			};

			users.push(user);

			return user;
		},
		deleteUser(parent, args, ctx, info) { 
			const userIndex = users.findIndex(user => user.id === args.id);

			if (userIndex === -1) {
				throw new Error('User not found .');
			}

			const deletedUsers = users.splice(userIndex, 1);

			posts = posts.filter((post) => {
				const match = post.author === args.id;

				if (match) {
					comments = comments.filter(comment => post.id !== comment.post);
				}

				return !match;
			});

			comments = comments.filter(comment => comment.author !== args.id);

			return deletedUsers[0];
		},
		createPost(parent, args, ctx, info) {
			const userExists = users.some((user) => user.id === args.data.author);

			if (!userExists) {
				throw new Error('User not found');
			}

			const post = {
				id: uuidv4(),
			  ...args.data
			};

			posts.push(post);

			return post;
		},
		deletePost(parent, args, ctx, info) {
			const postIndex = posts.findIndex(post => post.id === args.id);

			if (postIndex === -1) {
				throw new Error('Post not found.');
			}

			const deletedPosts = posts.splice(postIndex, 1);

			comments = comments.filter(comment => comment.post !== args.id);

			return deletedPosts[0];
		},
		createComment(parent, args, ctx, info) {
			if (!args.data.text) throw new Error('Can not create comment with empty fiels text');
			const userExists = users.some(user => user.id === args.data.author);
			const postExistAndPublished = posts.some(post => post.id === args.data.post && post.published);
			
			if (!userExists) throw new Error('User not found');
			if (!postExistAndPublished) throw new Error('Post not found or not published');

			const comment = {
				id: uuidv4(),
				...args.data
			}

			comments.push(comment);
			return comment;
		},
		deleteComment(parent, args, ctx, info) {
			const commentIndex = comments.findIndex(comment => comment.id === args.id);

			if (commentIndex === -1) {
				throw new Error('Comment not found.');
			}

			return comments.splice(commentIndex, 1)[0];
		}
	},
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.post === parent.id;
			});
		}
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter((post) => {
				 return parent.id === post.author;
			});
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return parent.id === comment.author;
			});
		}
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		},
		post(parent, args, ctx, info) {
			return posts.find((post) => {
				return post.id === parent.post;
			});
		}
	}
};

const server = new GraphQLServer({
	typeDefs,
	resolvers
});

server.start(() => {
	console.log('The server is up!');
});
