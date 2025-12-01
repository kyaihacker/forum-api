const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {};

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 123,
            owner: {},
        };

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedReply entities correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'sebuah balasan',
            owner: 'user-123',
        };

        // Action
        const addedReply = new AddedReply(payload);

        // Assert
        expect(addedReply).toBeInstanceOf(AddedReply);
        expect(addedReply.id).toEqual('reply-123');
        expect(addedReply.content).toEqual('sebuah balasan');
        expect(addedReply.owner).toEqual('user-123');
    });
});