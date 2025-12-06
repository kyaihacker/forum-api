const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'isi comment',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: 'isi comment',
            owner: {},
        };

        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedComment entities correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'isi comment',
            owner: 'user-123',
        };

        // Action
        const addedComment = new AddedComment(payload);

        // Assert
        expect(addedComment).toBeInstanceOf(AddedComment);
        expect(addedComment.id).toEqual('comment-123');
        expect(addedComment.content).toEqual('isi comment');
        expect(addedComment.owner).toEqual('user-123');
    });
});