const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('/threads endpoint', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123' });
        await RepliesTableTestHelper.addReply({ id: 'reply-123' });
    });

    afterEach(async () => {
        await LikesTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when POST /threads', () => {
        it('should reponse 201 and added thread', async () => {
            // Arrange
            const requestPayload = {
                title: 'sebuah thread',
                body: 'isi thread',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
            expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
            expect(responseJson.data.addedThread.owner).toEqual('user-123');
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'sebuah thread',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                title: 123,
                body: 'isi thread',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
        });
    });

    describe('when GET /threads/{id}', () => {
        it('should return 200 and detail thread', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(typeof responseJson.data.thread).toBe('object');
            expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
            expect(responseJson.data.thread.comments).toHaveLength(1);
            expect(responseJson.data.thread.comments[0]).toHaveProperty('likeCount');
            expect(typeof responseJson.data.thread.comments[0].likeCount).toBe('number');
        });

        it('should return 200 and detail thread with likeCount', async () => {
            // Arrange
            await LikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-123' });
            await LikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-456', id: 'like-456' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user456' });
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread.comments[0].likeCount).toEqual(2);
        });
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and added comment', async () => {
            // Arrange
            const requestPayload = {
                content: 'isi comment',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success'),
            expect(responseJson.data.addedComment).toBeDefined();
            expect(responseJson.data.addedComment.content).toEqual('isi comment');
            expect(responseJson.data.addedComment.owner).toEqual('user-123');
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {};
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                content: 123,
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
        });

        it('should response 404 when thread does not exists or is invalid', async () => {
            // Arrange
            const requestPayload = {
                content: 'isi comment',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/xxx/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread tidak ditemukan');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 if comment and owner valid', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 404 when thread not available', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/xxx/comments/comment-123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread tidak ditemukan');
        });

        it('should response 404 when comment not available', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/xxx',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Komentar tidak ditemukan');
        });

        it('should response 403 when comment owner is not valid', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const owner = 'user-xxx';
            await UsersTableTestHelper.addUser({ id: owner, username: owner });
            await ThreadsTableTestHelper.addThread({ id: 'thread-xxx' });
            await CommentsTableTestHelper.addComment({ id: 'comment-xxx', owner });
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-xxx/comments/comment-xxx',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
        });
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 201 and added reply', async () => {
            // Arrange
            const requestPayload = {
                content: 'sebuah balasan',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
            expect(responseJson.data.addedReply.content).toEqual('sebuah balasan');
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {};
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                content: 123,
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
        });

        it('should response 404 when thread not available', async () => {
            // Arrange
            const requestPayload = {
                content: 'sebuah balasan',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/xxx/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread tidak ditemukan');
        });

        it('should response 404 when comment not available', async () => {
            // Arrange
            const requestPayload = {
                content: 'sebuah balasan',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/xxx/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Komentar tidak ditemukan');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 200 if reply and owner valid', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 404 when thread not available', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/xxx/comments/comment-123/replies/reply-123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread tidak ditemukan');
        });

        it('should response 404 when comment not available', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/xxx/replies/reply-123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Komentar tidak ditemukan');
        });

        it('should response 404 when reply not available', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/xxx',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Balasan tidak ditemukan');
        });

        it('should response 403 when owner reply is not valid', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            await UsersTableTestHelper.addUser({ id: 'xxx', username: 'xxx' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-xxx' });
            await CommentsTableTestHelper.addComment({ id: 'comment-xxx' });
            await RepliesTableTestHelper.addReply({ id: 'reply-xxx', owner: 'xxx' });
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-xxx/comments/comment-xxx/replies/reply-xxx',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
        });
    });

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 200 and like comment when comment is not liked', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            // verify like was added by checking thread detail
            const threadResponse = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });
            const threadJson = JSON.parse(threadResponse.payload);
            expect(threadJson.data.thread.comments[0].likeCount).toEqual(1);
        });

        it('should response 200 and unlike comment when comment is already liked', async () => {
            // Arrange
            await LikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-123' });
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);
            // Verify like exists before
            const threadResponseBefore = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });
            const threadJsonBefore = JSON.parse(threadResponseBefore.payload);
            expect(threadJsonBefore.data.thread.comments[0].likeCount).toEqual(1);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            // Verify like was removed by checking thread detail
            const threadResponseAfter = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });
            const threadJsonAfter = JSON.parse(threadResponseAfter.payload);
            expect(threadJsonAfter.data.thread.comments[0].likeCount).toEqual(0);
        });

        it('should response 404 when thread not available', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/xxx/comments/comment-123/likes',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread tidak ditemukan');
        });

        it('should response 404 when comment not available', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/xxx/likes',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Komentar tidak ditemukan');
        });

        it('should response 401 when request not contain access token', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
        });
    });
});