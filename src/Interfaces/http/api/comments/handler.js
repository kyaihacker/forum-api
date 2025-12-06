const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentHandler {
    constructor(container) {
        this._container = container;

        this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
        this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    }

    async postThreadCommentHandler(request, h) {
        const { threadId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const addedComment = await addCommentUseCase.execute({
            ...request.payload,
            threadId,
            owner: credentialId,
        });
        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteThreadCommentHandler(request) {
        const { threadId, commentId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        await deleteCommentUseCase.execute({ commentId, ownerId: credentialId, threadId });
        return {
            status: 'success',
        };
    }
}

module.exports = CommentHandler;