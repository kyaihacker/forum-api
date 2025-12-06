const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', date: new Date('2025-12-01').toISOString() });
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist new thread and return added thread correctly', async () => {
            // Arrange
            const newThread = new NewThread({
                title: 'sebuah thread',
                body: 'isi thread',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '234';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addThread(newThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadsById('thread-234');
            expect(threads).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            const newThread = new NewThread({
                title: 'sebuah thread',
                body: 'isi thread',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '234';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(newThread);

            // Assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-234',
                title: 'sebuah thread',
                owner: 'user-123',
            }));
        });
    });

    describe('getThreadById function', () => {
        it('should throw NotFoundError when thread not available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.getThreadById('xx')).rejects.toThrowError(NotFoundError);
        });

        it('should return detail thread correctly', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const thread = await threadRepositoryPostgres.getThreadById('thread-123');

            // Assert
            expect(thread).toStrictEqual({
                id: 'thread-123',
                title: 'sebuah thread',
                body: 'isi thread',
                date: new Date('2025-12-01').toISOString(),
                username: 'dicoding',
            });
        });
    });

    describe('verifyThread function', () => {
        it('should throw NotFoundError when thread not available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyThreadExists('xx')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when thread available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrowError(NotFoundError);
        });
    });
});