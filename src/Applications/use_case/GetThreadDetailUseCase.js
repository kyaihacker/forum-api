class GetThreadDetailUseCase {
    constructor({ threadRepository, commentRepository, replyRepository, commentLikeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
        this._commentLikeRepository = commentLikeRepository;
    }

    async execute(useCasePayload) {
        const { id } = useCasePayload;
        await this._threadRepository.verifyThreadExists(id);
        const thread = await this._threadRepository.getThreadById(id);
        const comments = await this._commentRepository.getCommentsByThreadId(id);
        const replies = await this._replyRepository.getRepliesByThreadId(id);
        const likes = await this._commentLikeRepository.getLikeCountByThreadId(id);

        const likesMap = this._mapLikesToCommentId(likes);

        thread.comments = comments.map((comment) => {
            const newComment = { ...comment };
            newComment.likeCount = likesMap[comment.id] || 0;
            newComment.replies = replies
                .filter((reply) => reply.comment_id === newComment.id)
                .map((reply) => ({
                id: reply.id,
                content: reply.content,
                date: reply.date,
                username: reply.username,
            }));
            return newComment;
        });
        return thread;
    }

    _mapLikesToCommentId(likes) {
        return likes.reduce((acc, like) => {
            acc[like.comment_id] = like.count;
            return acc;
        }, {});
    }
}

module.exports = GetThreadDetailUseCase;