class ToggleCommentLikeUseCase {
    constructor({ commentRepository, threadRepository, commentLikeRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
        this._commentLikeRepository = commentLikeRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, owner } = useCasePayload;

        await this._threadRepository.verifyThreadExists(threadId);
        await this._commentRepository.verifyCommentExists(commentId);

        const isLiked = await this._commentLikeRepository.checkLikeStatus(commentId, owner);

        if (isLiked) {
            await this._commentLikeRepository.removeLike(commentId, owner);
        } else {
            await this._commentLikeRepository.addLike(commentId, owner);
        }
    }
}

module.exports = ToggleCommentLikeUseCase;