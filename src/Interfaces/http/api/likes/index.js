const routes = require('./routes');
const CommentLikeHandler = require('./handler');

module.exports = {
    name: 'commentLike',
    version: '1.0.0',
    register: async (server, { container }) => {
        const commentLikeHandler = new CommentLikeHandler(container);
        server.route(routes(commentLikeHandler));
    },
};