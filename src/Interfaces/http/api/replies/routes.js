const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: handler.postReplyCommentThreadHandler,
        options: {
            auth: 'forum_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        handler: handler.deleteReplyCommentThreadHandler,
        options: {
            auth: 'forum_jwt',
        },
    },
]);

module.exports = routes;