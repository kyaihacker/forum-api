const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
    constructor(container) {
        this._container = container;

        this.postReplyCommentThreadHandler = this.postReplyCommentThreadHandler.bind(this);
        this.deleteReplyCommentThreadHandler = this.deleteReplyCommentThreadHandler.bind(this);
    }

     async postReplyCommentThreadHandler(request, h) {
        const { threadId, commentId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
        const addedReply = await addReplyUseCase.execute({
            ...request.payload,
            threadId,
            commentId,
            owner: credentialId,
        });

        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyCommentThreadHandler(request) {
        const { threadId, commentId, replyId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        await deleteReplyUseCase.execute({ threadId, commentId, replyId, ownerId: credentialId });
        return {
            status: 'success',
        };
    }
}

module.exports = ReplyHandler;