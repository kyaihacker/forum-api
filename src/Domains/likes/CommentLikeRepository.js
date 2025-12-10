class CommentLikeRepository {
    async checkLikeStatus(commentId, owner) {
        throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async addLike(commentId, owner) {
        throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async removeLike(commentId, owner) {
        throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLikeCountByThreadId(threadId) {
        throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = CommentLikeRepository;