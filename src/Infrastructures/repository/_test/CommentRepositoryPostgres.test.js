const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('CommentRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', date: new Date().toISOString() });
        await CommentsTableTestHelper.addComment({ id: 'comment-123', date: new Date().toISOString() });
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist new comment and return added comment correctly', async () => {
            // Arrange
            const newComment = new NewComment({
                content: 'sebuah komentar',
                threadId: 'thread-123',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '234';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentRepositoryPostgres.addComment(newComment);

            // Assert
            const comments = await CommentsTableTestHelper.findCommentsById('comment-234');
            expect(comments).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            const newComment = new NewComment({
                content: 'sebuah komentar',
                threadId: 'thread-123',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '234';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(newComment);

            // Assert
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-234',
                content: 'sebuah komentar',
                owner: 'user-123',
            }));
        });
    });

    describe('getCommentByThreadId function', () => {
        it('should throw comments by thread id correctly', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

            // Assert
            expect(comments).toHaveLength(1);
            expect(comments[0]).toBeInstanceOf(DetailComment);
            expect(comments[0].id).toEqual('comment-123');
            expect(comments[0].username).toEqual('dicoding');
            expect(comments[0].content).toEqual('isi comment');
            expect(typeof comments[0].date).toBe('string');
            expect(comments[0].is_deleted).toEqual(false);
        });
    });

    describe('deleteComment function', () => {
        it('should soft delete comment correctly', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            const commentId = 'comment-123';

            // Action
            await commentRepositoryPostgres.deleteComment(commentId);

            // Assert
            const comments = await CommentsTableTestHelper.findCommentsById(commentId);
            expect(comments).toHaveLength(1);
            expect(comments[0].is_deleted).toEqual(true);
        });
    });

    describe('verifyComment function', () => {
        it('should throw NotFoundError when comment not available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentExists('xx')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when comment available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Actions and Assert
            await expect(commentRepositoryPostgres.verifyCommentExists('comment-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should throw NotFoundError when comment not available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('xx', 'xx')).rejects.toThrowError(NotFoundError);
        });

        it('should throw AuthorizationError when comment owner is not valid', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'xxx')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw NotFoundError when comment available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(NotFoundError);
        });

        it('should not throw AuthorizationError when comment owner is valid', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
        });
    });
});