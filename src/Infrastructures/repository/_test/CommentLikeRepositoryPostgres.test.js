const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
    it('should be instance of CommentLikeRepository', () => {
        const commentLikeRepositoryPostgres = new CommentLikeRepository();

        expect(commentLikeRepositoryPostgres).toBeInstanceOf(CommentLikeRepository);
    });

    describe('behavior test', () => {
        beforeAll(async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'someuser' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
        });

        afterEach(async () => {
            await LikesTableTestHelper.cleanTable();
        });

        afterAll(async () => {
            await UsersTableTestHelper.cleanTable();
            await ThreadsTableTestHelper.cleanTable();
            await CommentsTableTestHelper.cleanTable();
            await pool.end();
        });

        describe('checkLikeStatus function', () => {
            it('should return true when like exists', async () => {
                // Arrange
                const payload = {
                    commentId: 'comment-123',
                    owner: 'user-123',
                };
                await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
                const commentLikeRepositoryPostgres = new CommentLikeRepository(pool, {});

                // Action
                const isLiked = await commentLikeRepositoryPostgres.checkLikeStatus(payload);

                // Assert
                expect(isLiked).toBe(true);
            });

            it('should return false when like does not exist', async () => {
                // Arrange
                const commentLikeRepositoryPostgres = new CommentLikeRepository(pool, {});

                // Action
                const isLiked = await commentLikeRepositoryPostgres.checkLikeStatus({ commentId: 'comment-123', owner: 'user' });

                // Assert
                expect(isLiked).toBe(false);
            });
        });

        describe('addLike function', () => {
            it('should add like to comment', async () => {
                // Arrange
                const payload = {
                    commentId: 'comment-123',
                    owner: 'user-123',
                };
                const fakeIdGenerator = () => '123';
                const commentLikeRepositoryPostgres = new CommentLikeRepository(pool, fakeIdGenerator);

                // Action
                const isLiked = await commentLikeRepositoryPostgres.addLike(payload);

                // Assert
                expect(isLiked).toBe(true);
            });
        });

        describe('removeLike function', () => {
            it('should call pool.query with correct query and values to delete a like', async () => {
                // Arrange
                mockPool = {
                    query: jest.fn(),
                };
                mockIdGenerator = jest.fn(() => '12345');
                mockPool.query.mockResolvedValue({ rowCount: 1 });

                // Action
                const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(mockPool, mockIdGenerator);
                await commentLikeRepositoryPostgres.removeLike(commentId, owner);

                // Assert
                expect(mockPool.query).toHaveBeenCalledTimes(1);
                expect(mockPool.query).toHaveBeenCalledWith({
                    text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
                    values: [commentId, owner],
                });
            });
        });

        describe('getLikeCountByThreadId function', () => {
            it('should return like counts aggregated by comment id', async () => {
                // Arrange
                const expectedRows = [
                    { comment_id: 'comment-A', count: 5 },
                    { comment_id: 'comment-B', count: 2 },
                ];
                mockPool.query.mockResolvedValue({
                    rows: expectedRows,
                });
                mockIdGenerator = jest.fn(() => '12345');

                const expectedQueryText = `
                    SELECT 
                        comment_likes.comment_id, COUNT(comment_likes.comment_id)::integer AS count
                    FROM comment_likes
                    JOIN comments ON comment_likes.comment_id = comments.id
                    WHERE comments.thread_id = $1
                    GROUP BY comment_likes.comment_id
                `;

                // Action
                const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(mockPool, mockIdGenerator);
                const likeCounts = await commentLikeRepositoryPostgres.getLikeCountByThreadId('thread-789');

                // Assert
                expect(mockPool.query).toHaveBeenCalledTimes(1);
                expect(mockPool.query).toHaveBeenCalledWith({
                    text: expectedQueryText,
                    values: [threadId],
                });
                expect(likeCounts).toEqual(expectedRows);
            });
        });
    });
});
