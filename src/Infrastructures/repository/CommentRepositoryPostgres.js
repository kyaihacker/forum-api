const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment) {
        const { content, threadId, owner } = newComment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, content, threadId, owner, date],
        };

        const result = await this._pool.query(query);
        return new AddedComment(result.rows[0]);
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT
                c.id, u.username, c.date, c.content, c.is_deleted
                FROM comments c
                INNER JOIN users u ON u.id = c.owner
                WHERE c.thread_id = $1
                ORDER BY c.date ASC`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return result.rows.map((comment) => new DetailComment(comment));
    }

    async verifyCommentExists(commentId) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Komentar tidak ditemukan');
        }
    }

    async verifyCommentOwner(commentId, ownerId) {
        const query = {
            text: 'SELECT owner FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Komentar tidak ditemukan');
        }

        const comment = result.rows[0];

        if (comment.owner !== ownerId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
            values: [commentId],
        };

        await this._pool.query(query);
    }
}

module.exports = CommentRepositoryPostgres;