const ToggleCommentLikeUseCase = require('../../../../Applications/use_case/ToggleCommentLikeUseCase');

class CommentLikeHandler {
    constructor(container) {
        this._container = container;

        this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this); 
    }

    async putCommentLikeHandler(request, h) {
        const toggleCommentLikeUseCase = this._container.getInstance(ToggleCommentLikeUseCase.name);

        const useCasePayload = {
            threadId: request.params.threadId,
            commentId: request.params.commentId,
            owner: request.auth.credentials.id,
        };

        await toggleCommentLikeUseCase.execute(useCasePayload);

        return {
            status: 'success',
        };
    }
}

module.exports = CommentLikeHandler;