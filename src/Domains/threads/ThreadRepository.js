class ThreadRepository {
    async addThread(newThread, owner) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThreadById(id) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyThreadExists(id) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = ThreadRepository;