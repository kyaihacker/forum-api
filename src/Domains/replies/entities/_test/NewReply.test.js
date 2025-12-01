const NewReply = require('../NewReply');

describe('NewReply entities', () => {
    it('should throw error when payload not contain needed property', () => {
        const payload = {};

        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            content: 123,
            commentId: {},
            owner: [],
        };

        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create NewReply entities correctly', () => {
        // Arrange
        const payload = {
            content: 'sebuah balasan',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        // Action
        const newReply = new NewReply(payload);

        // Assert
        expect(newReply).toBeInstanceOf(NewReply);
        expect(newReply.content).toEqual('sebuah balasan');
    });
});