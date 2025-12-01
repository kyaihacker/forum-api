const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', date: new Date().toISOString() });
        await CommentsTableTestHelper.addComment({ id: 'comment-123', date: new Date().toISOString() });
        await RepliesTableTestHelper.addReply({ id: 'reply-123', date: new Date().toISOString() });
    });

    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addReply function', () => {
        it('should persist new reply and return added reply correctly', async () => {
            // Arrange
            const newReply = new NewReply({
                content: 'sebuah balasan',
                commentId: 'comment-123',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '234';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedReply = await replyRepositoryPostgres.addReply(newReply);

            // Assert
            const replies = await RepliesTableTestHelper.findRepliesById('reply-234');
            expect(replies).toHaveLength(1);
        });

        it('should return added reply correctly', async () => {
            // Arrange
            const newReply = new NewReply({
                content: 'sebuah balasan',
                commentId: 'comment-123',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '234';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedReply = await replyRepositoryPostgres.addReply(newReply);

            // Assert
            expect(addedReply).toStrictEqual(new AddedReply({
                id: 'reply-234',
                content: 'sebuah balasan',
                owner: 'user-123',
            }));
        });
    });

    describe('getRepliesByThreadId function', () => {
        it('should throw replies by thread id correctly', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action
            const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

            // Assert
            expect(replies).toStrictEqual([
                new DetailReply({
                    id: 'reply-123',
                    content: 'sebuah balasan',
                    date: new Date().toISOString(),
                    username: 'dicoding',
                    comment_id: 'comment-123',
                    is_deleted: false,
                }),
            ]);
        });
    });

    describe('deleteReply function', () => {
        it('should soft delete reply correctly', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            const replyId = 'reply-123';

            // Action
            await replyRepositoryPostgres.deleteReply(replyId);

            // Assert
            const replies = await RepliesTableTestHelper.findRepliesById(replyId);
            expect(replies).toHaveLength(1);
            expect(replies[0].is_deleted).toEqual(true);
        });
    });

    describe('verifyReplyOwner function', () => {
        it('should throw NotFoundError when reply not available', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner('xx', 'user-123')).rejects.toThrowError(NotFoundError);
        });

        it('should throw AuthorizationError when reply owner is not valid', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'xx')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw NotFoundError when reply available', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(NotFoundError);
        });

        it('should not throw AuthorizationError when reply owner is valid', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
        });
    });
});