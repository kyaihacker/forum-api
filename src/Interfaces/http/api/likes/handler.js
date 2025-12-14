const ToggleCommentLikeUseCase = require('../../../../Applications/use_case/ToggleCommentLikeUseCase');

class CommentLikeHandler {
    constructor(container) {
        this._container = container;

        this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this); 
    }

    async putCommentLikeHandler(request, h) {
        const { threadId, commentId } = request.params;
        const { id: owner } = request.auth.credentials;
        const toggleCommentLikeUseCase = this._container.getInstance(ToggleCommentLikeUseCase.name);

        await toggleCommentLikeUseCase.execute({
            threadId, commentId, owner,    
        });

        return {
            status: 'success',
        };
    }
}

module.exports = CommentLikeHandler;