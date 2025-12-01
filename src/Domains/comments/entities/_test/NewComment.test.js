const NewComment = require('../NewComment');

describe('NewComment entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {};

        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            content: 123,
            threadId: {},
            owner: [],
        };

        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create NewComment entities correctly', () => {
        // Arrange
        const payload = {
            content: 'isi comment',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        // Action
        const newComment = new NewComment(payload);

        // Assert
        expect(newComment).toBeInstanceOf(NewComment);
        expect(newComment.content).toEqual('isi comment');
    });
});