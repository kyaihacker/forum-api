const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(newReply) {
        const { content, commentId, owner } = newReply;
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, content, commentId, owner, date],
        };

        const result = await this._pool.query(query);
        return new AddedReply(result.rows[0]);
    }

    async getRepliesByThreadId(threadId) {
        const query = {
            text: `
                SELECT
                r.id, r.content, r.date, r.owner, r.comment_id, r.is_deleted
                FROM replies r
                INNER JOIN users u ON u.id = r.owner
                INNER JOIN comments c ON c.id = r.comment_id
                INNER JOIN threads t ON t.id = c.thread_id
                WHERE t.id = $1
                ORDER BY r.date ASC`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return result.rows.map((reply) => new DetailReply(reply));
    }

    async verifyReplyExists(replyId) {
        const query = {
            text: 'SELECT id FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Balasan tidak ditemukan');
        }
    }

    async verifyReplyOwner(replyId, ownerId) {
        const query = {
            text: 'SELECT owner FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Balasan tidak ditemukan');
        }

        const reply = result.rows[0];

        if (reply.owner !== ownerId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async deleteReply(replyId) {
        const query = {
            text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
            values: [replyId],
        };

        await this._pool.query(query);
    }
}

module.exports = ReplyRepositoryPostgres;