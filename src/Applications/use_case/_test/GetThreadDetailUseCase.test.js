const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
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

        mockThreadRepository.verifyThreadExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({
            id: useCasePayload.id,
            title: 'sebuah thread',
            body: 'sebuah body thread',
            username: 'dicoding',
            date,
        }));

        mockCommentRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([{
                id: 'comment-123',
                username: 'dicoding',
                content: 'isi comment',
                date,
        }]));

        mockReplyRepository.getRepliesByCommentIds = jest.fn()
            .mockImplementation(() => Promise.resolve([{
                id: 'reply-123',
                content: 'sebuah balasan',
                date,
                username: 'dicoding',
                comment_id: 'comment-123',
            }]));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const thread = getThreadDetailUseCase.execute(useCasePayload);

        // Assert
        expect(thread).toEqual(threadDetail);
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.id);
        expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith(useCasePayload.id);
    });
});