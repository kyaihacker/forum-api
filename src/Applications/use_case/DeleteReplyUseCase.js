class DeleteReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        this._validatePayload(useCasePayload);

        const { threadId, commentId, replyId, ownerId } = useCasePayload;

        await this._threadRepository.verifyThreadExists(threadId);
        await this._commentRepository.verifyCommentExists(commentId);
        await this._replyRepository.verifyReplyExists(replyId);
        await this._replyRepository.verifyReplyOwner(replyId, ownerId);
        await this._replyRepository.deleteReply(replyId);
    }

    _validatePayload(payload) {
        const { threadId, commentId, replyId, ownerId } = payload;

        if (!threadId || !commentId || !replyId || !ownerId) {
            throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string' || typeof ownerId !== 'string') {
            throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DeleteReplyUseCase;