const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
    it('should orchestrate the get thread detail action correctly', async () => {
        // Arrange
        const useCasePayload = { id: 'thread-123' };
        const date = new Date().toISOString();
        const threadDetail = {
            id: useCasePayload.id,
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date,
            username: 'dicoding',
            comments: [
                {
                    id: 'comment-123',
                    username: 'dicoding',
                    date,
                    likeCount: 2,
                    replies: [
                        {
                            id: 'reply-123',
                            content: 'sebuah balasan',
                            date,
                            username: 'dicoding',
                        },
                    ],
                },
            ],
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();
        const mockCommentLikeRepository = new CommentLikeRepository();

        mockThreadRepository.verifyThreadExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({
            id: useCasePayload.id,
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date,
            username: 'dicoding',
        }));

        mockCommentRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([{
                id: 'comment-123',
                username: 'dicoding',
                date,
        }]));

        mockReplyRepository.getRepliesByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([{
                id: 'reply-123',
                content: 'sebuah balasan',
                date,
                username: 'dicoding',
                comment_id: 'comment-123',
            }]));
        
        mockCommentLikeRepository.getLikeCountByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([{
                comment_id: 'comment-123',
                count: 2,
            }]));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
            commentLikeRepository: mockCommentLikeRepository,
        });

        // Action
        const thread = await getThreadDetailUseCase.execute(useCasePayload);

        // Assert
        expect(thread).toEqual(threadDetail);
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.id);
        expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.id);
        expect(mockCommentLikeRepository.getLikeCountByThreadId).toBeCalledWith(useCasePayload.id);
    });
});