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
        // Arrange
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

    describe('From Array', () => {
        it('should return array instance when input valid array', () => {
            // Arrange
            const date = new Date().toISOString();
            const validPayload = {
                id: 'reply-123',
                content: 'sebuah balasan',
                date,
                username: 'dicoding',
                comment_id: 'comment-123',
                is_deleted: false,
            };

            const payloads = [
                validPayload,
                { ...validPayload, id: 'reply-124', content: 'Balasan lain' },
            ];

            // Action
            const results = DetailReply.fromArray(payloads);

            // Assert
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBe(payloads.length);
            results.forEach(result => {
                expect(result).toBeInstanceOf(DetailReply);
            });
            expect(results[0].id).toEqual(validPayload.id);
            expect(results[1].content).toEqual('Balasan lain');
        });

        test.each([
            ['string', 'not an array'],
            ['number', 123],
            ['null', null],
            ['object', { key: 'value' }],
            ['undefined', undefined],
        ])('seharusnya melempar Error ketika input adalah %s (bukan array)', (type, invalidInput) => {
            expect(() => {
                DetailReply.fromArray(invalidInput);
            }).toThrowError('DETAIL_REPLY.FROM_ARRAY_PAYLOAD_MUST_BE_ARRAY');
        });
    });
});