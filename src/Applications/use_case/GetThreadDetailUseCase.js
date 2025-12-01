class GetThreadDetailUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        const { id } = useCasePayload;
        const thread = await this._threadRepository.getThreadById(id);
        const comments = await this._commentRepository.getCommentsByThreadId(id);
        const replies = await this._replyRepository.getRepliesByCommentIds(id);

        thread.comments = comments.map((comment) => {
            const newComment = { ...comment };
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
}

module.exports = GetThreadDetailUseCase;