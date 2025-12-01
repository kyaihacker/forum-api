const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
    it('should throw error if use case payload not contain needed property', async () => {
        // Arrange
        const useCasePayload = {};
        const deleteReplyUseCase = new DeleteReplyUseCase({});

        // Action and Assert
        await expect(deleteReplyUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error if use case payload not meet data type specification', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 123,
            commentId: 123,
            replyId: 123,
            owner: 'user-123',
        };

        const deleteReplyUseCase = new DeleteReplyUseCase({});

        // Action and Assert
        await expect(deleteReplyUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrate the delete reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
            ownerId: 'user-123',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyThreadExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyOwner =jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        await deleteReplyUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.verifyReplyExists).toBeCalledWith(useCasePayload.replyId);
        expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.replyId, useCasePayload.ownerId);
        expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    });
});