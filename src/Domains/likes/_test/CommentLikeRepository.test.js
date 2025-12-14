const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const commentLikeRepository = new CommentLikeRepository();

        // Action and Assert
        await expect(commentLikeRepository.checkLikeStatus({}))
            .rejects
            .toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentLikeRepository.addLike({}))
            .rejects
            .toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentLikeRepository.removeLike({}))
            .rejects
            .toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentLikeRepository.getLikeCountByThreadId({}))
            .rejects
            .toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});