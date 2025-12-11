const CommentLikeRepository = require('../../Domains/likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async checkLikeStatus(commentId, owner) {
        const query = {
            text: 'SELECT 1 FROM comment_likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner],
        };

        const result = await this._pool.query(query);
        return result.rowCount > 0;
    }

    async addLike(commentId, owner) {
        const id = `like-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comment_likes (id, comment_id, owner, date) VALUES($1, $2, $3, $4',
            values: [id, commentId, owner, date],
        };

        await this._pool.query(query);
    }

    async removeLike(commentId, owner) {
        const query = {
            text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner],
        };

        await this._pool.query(query);
    }

    async getLikeCountByThreadId(threadId) {
        const query = {
            text: `
                SELECT 
                    comment_likes.comment_id, COUNT(comment_likes.comment_id)::integer AS count
                FROM comment_likes
                JOIN comments ON comment_likes.comment_id = comments.id
                WHERE comments.thread_id = $1
                GROUP BY comment_likes.comment_id
            `,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = CommentLikeRepositoryPostgres;