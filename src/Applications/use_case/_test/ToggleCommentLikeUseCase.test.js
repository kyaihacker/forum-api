const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository');
const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase');

describe('a ToggleCommentLikeUseCase', () => {

    const mockThreadRepository = {
        verifyThreadExists: jest.fn(),
    };
    const mockCommentRepository = {
        verifyCommentExists: jest.fn(),
    };
    const mockCommentLikeRepository = {
        checkLikeStatus: jest.fn(),
        addLike: jest.fn(),
        removeLike: jest.fn(),
    };

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        commentLikeRepository: mockCommentLikeRepository,
    });

    const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-456',
        owner: 'user-789',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should orchestrate the toggle comment like action correctly when the comment is not liked', async () => {
        // Arrange
        mockCommentLikeRepository.checkLikeStatus.mockResolvedValue(false);
        mockCommentLikeRepository.addLike.mockResolvedValue();

        // Action
        await toggleCommentLikeUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
        expect(mockCommentLikeRepository.checkLikeStatus).toHaveBeenCalledWith(
            useCasePayload.commentId,
            useCasePayload.owner,
        );
        expect(mockCommentLikeRepository.addLike).toHaveBeenCalledWith(
            useCasePayload.commentId,
            useCasePayload.owner,
        );
        expect(mockCommentLikeRepository.removeLike).not.toHaveBeenCalled();
    });

    it('should orchestrate the toggle comment like action correctly when the comment is liked', async () => {
        // Arrange
        mockCommentLikeRepository.checkLikeStatus.mockResolvedValue(true);
        mockCommentLikeRepository.removeLike.mockResolvedValue();

        // Action
        await toggleCommentLikeUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
        expect(mockCommentLikeRepository.checkLikeStatus).toHaveBeenCalledWith(
            useCasePayload.commentId,
            useCasePayload.owner,
        );
        expect(mockCommentLikeRepository.removeLike).toHaveBeenCalledWith(
            useCasePayload.commentId,
            useCasePayload.owner,
        );
        expect(mockCommentLikeRepository.addLike).not.toHaveBeenCalled();
    });
});