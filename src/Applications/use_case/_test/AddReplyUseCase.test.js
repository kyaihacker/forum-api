const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
    it('should orchestrate the reply add action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'sebuah balasan',
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyThreadExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(new AddedReply({
                id: 'reply-999',
                content: 'different content',
                owner: 'different-owner',
            })));

        const addReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const newReply = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(newReply).toStrictEqual(new AddedReply({
            id: 'reply-999',
            content: 'different content',
            owner: 'different-owner',
        }));
        expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith({
            content: useCasePayload.content,
            commentId: useCasePayload.commentId,
            owner: useCasePayload.owner,
        });
    });
});