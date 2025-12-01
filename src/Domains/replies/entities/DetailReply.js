class DetailReply {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, content, date, username, comment_id, is_deleted } = payload;
        this.id = id;
        this.content = is_deleted ? '**balasan telah dihapus**' : content;
        this.date = date;
        this.username = username;
        this.comment_id = comment_id;
    }

    _verifyPayload(payload) {
        const { id, content, date, username, comment_id, is_deleted } = payload;
        
        if (!id || !content || !date || !username || !comment_id || is_deleted === undefined) {
            throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof comment_id !== 'string' || typeof is_deleted !== 'boolean') {
            throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailReply;