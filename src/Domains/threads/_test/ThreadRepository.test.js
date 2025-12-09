const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
    describe('addThread', () => {
        it('should throw error when invoke abstract behavior', async () => {
            // Arrange
            const threadRepository = new ThreadRepository();

            // Action and Assert
            await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        });
    });

    describe('getThreadById', () => {
        it('should throw error when invoke abstract behavior', async () => {
            // Arrange
            const threadRepository = new ThreadRepository();

            // Action and Assert
            await expect(threadRepository.getThreadById('thread-123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        });
    });

    describe('verifyThreadExists', () => {
        it('should throw error when invoke abstract behavior', async () => {
            // Arrange
            const threadRepository = new ThreadRepository();

            // Action and Assert
            await expect(threadRepository.verifyThreadExists('thread-123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        });
    });
});