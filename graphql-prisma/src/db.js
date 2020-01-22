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

const db = {
    users,
    posts,
    comments
};

export { db as default };
