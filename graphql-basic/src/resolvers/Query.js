const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) return db.users;
        return db.users.filter((user) =>  user.name.toLowerCase().includes(args.query.toLowerCase()));
    },
    posts(parent, args, { db }, info) {
        if (!args.query) return db.posts;
        return db.posts.filter((post) => {
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
    comments(parent, args, { db }, info) {
        if (!args.query) return db.comments;
        return db.comments.filter((comment) => {
            return comment.id.toLowerCase().includes(args.query.toLowerCase()) ||
            comment.text.toLowerCase().includes(args.query.toLowerCase());
        });
    }
};

export { Query as default };