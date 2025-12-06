const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {};

        // Action and Assert
        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: [],
            date: {},
            username: 123,
            comment_id: 456,
            is_deleted: [],
        };

        // Action and Assert
        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DetailReply entities correctly', () => {
        const date = new Date().toISOString();
        const payload = {
            id: 'reply-123',
            content: 'sebuah balasan',
            date,
            username: 'dicoding',
            comment_id: 'comment-123',
            is_deleted: false,
        };

        // Action
        const detailReply = new DetailReply(payload);

        // Assert
        expect(detailReply).toBeInstanceOf(DetailReply);
        expect(detailReply.id).toEqual('reply-123');
        expect(detailReply.content).toEqual('sebuah balasan');
        expect(detailReply.date).toEqual(date);
        expect(detailReply.username).toEqual('dicoding');
    });

    it('should create a deleted DetailReply entities correctly', () => {
        const date = new Date().toISOString();
        const payload = {
            id: 'reply-123',
            content: 'sebuah balasan',
            date,
            username: 'dicoding',
            comment_id: 'comment-123',
            is_deleted: true,
        };

        // Action
        const detailReply = new DetailReply(payload);

        // Assert
        expect(detailReply).toBeInstanceOf(DetailReply);
        expect(detailReply.id).toEqual('reply-123');
        expect(detailReply.content).toEqual('**balasan telah dihapus**');
        expect(detailReply.date).toEqual(date);
        expect(detailReply.username).toEqual('dicoding');
    });
});