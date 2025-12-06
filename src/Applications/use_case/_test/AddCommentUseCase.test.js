const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
    it('should orchestrate the comment add action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'sebuah komentar',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        const mockAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verifyThreadExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment));

        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const newComment = await addCommentUseCase.execute(useCasePayload);

        // Assert
        expect(newComment).toStrictEqual(new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        }));
        expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
        expect(mockCommentRepository.addComment).toBeCalledWith({
            content: useCasePayload.content,
            threadId: useCasePayload.threadId,
            owner: useCasePayload.owner,
        });
    });
});