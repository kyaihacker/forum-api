const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
        this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
        this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
        this.postReplyCommentThreadHandler = this.postReplyCommentThreadHandler.bind(this);
        this.deleteReplyCommentThreadHandler = this.deleteReplyCommentThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute({ ...request.payload, owner: credentialId });
        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadDetailHandler(request) {
        const { id } = request.params;
        const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
        const thread = await getThreadDetailUseCase.execute({ id });
        return {
            status: 'success',
            data: {
                thread,
            },
        };
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
        await deleteCommentUseCase.execute({ commentId, owner: credentialId, threadId });
        return {
            status: 'success',
        };
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
        await deleteReplyUseCase.execute({ threadId, commentId, replyId, owner: credentialId });
        return {
            status: 'success',
        };
    }
}

module.exports = ThreadHandler;