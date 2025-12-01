const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddTreadUseCase = require('../../../Applications/use_case/AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrate the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = { 
            title: 'sebuah thread',
            body: 'isi thread',
            owner: 'user-123',
        };

        const addedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: 'user-123',
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: 'user-123',
        })));

        const addThreadUseCase = new AddTreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const newThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(newThread).toStrictEqual(addedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
        });
    });
});