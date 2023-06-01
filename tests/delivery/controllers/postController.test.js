const {createPost,getAllPosts, getPostsByFilters, getPostById, updatePostById, deletePostById } = require('../../../src/delivery/controllers/postController');
const postService = require('../../../src/domain/services/postService');
jest.mock('../../../src/domain/services/postService');

describe('Post Controller', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const fakeReq = {
        params: {
            id: "60a9b0b9e1b3a1b4b8b0b8b0"
        },
        body: {
            title: "Post 1",
            body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            type: "informative",
            date: "2021-05-05T00:00:00.000Z",
            author: "60a9b0b9e1b3a1b4b8b0b8b0",
            project: "60a9b0b9e1b3a1b4b8b0b8b0",
            messages: []
        },
    }

    const fakeRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    describe('createPost', () => {
        it('should create a post', async () => {
            const fakePost = fakeReq.body;
            postService.createPost.mockResolvedValue(fakePost);
            await createPost(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakePost);
            expect(postService.createPost).toHaveBeenCalledWith(fakeReq.body);
            expect(fakeRes.status).toHaveBeenCalledWith(201);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            postService.createPost.mockRejectedValue(fakeError);
            await createPost(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });


/**************************************************************** */

    describe('getAllPost', () => {
        it('should return all posts', async () => {
            const fakePosts = [fakeReq.body];
            postService.getAllPosts.mockResolvedValue(fakePosts);
            await getAllPosts(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakePosts);
            expect(postService.getAllPosts).toHaveBeenCalledWith();
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if no posts are found', async () => {
            const fakePosts = null;
            postService.getAllPosts.mockResolvedValue(fakePosts);
            await getAllPosts(fakeReq, fakeRes);
            expect(fakeRes.json).toHaveBeenCalledWith({results:[], message: 'Posts not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            postService.getAllPosts.mockRejectedValue(fakeError);
            await getAllPosts(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });

    });

/**************************************************************** */

    describe('getPostsByFilters', () => {
        it('should return all posts', async () => {
            const fakePosts = [fakeReq.body];
            postService.getPostsByFilters.mockResolvedValue(fakePosts);
            await getPostsByFilters(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakePosts);
            expect(postService.getPostsByFilters).toHaveBeenCalledWith(fakeReq.body);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if no posts are found', async () => {
            const fakePosts = null;
            postService.getPostsByFilters.mockResolvedValue(fakePosts);
            await getPostsByFilters(fakeReq, fakeRes);
            expect(fakeRes.json).toHaveBeenCalledWith({results:[], message: 'Posts not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            postService.getPostsByFilters.mockRejectedValue(fakeError);
            await getPostsByFilters(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });

/**************************************************************** */

    describe('getPostById', () => {
        it('should return a post', async () => {
            const fakePost = fakeReq.body;
            postService.getPostById.mockResolvedValue(fakePost);
            await getPostById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakePost);
            expect(postService.getPostById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if no post is found', async () => {
            const fakePost = null;
            postService.getPostById.mockResolvedValue(fakePost);
            await getPostById(fakeReq, fakeRes);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Post not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            postService.getPostById.mockRejectedValue(fakeError);
            await getPostById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });

/**************************************************************** */

    describe('updatePostById', () => {
        it('should update a post', async () => {
            const fakePost = fakeReq.body;
            postService.updatePostById.mockResolvedValue(fakePost);
            await updatePostById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakePost);
            expect(postService.updatePostById).toHaveBeenCalledWith(fakeReq.params.id, fakeReq.body);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if no post is found', async () => {
            const fakePost = null;
            postService.updatePostById.mockResolvedValue(fakePost);
            await updatePostById(fakeReq, fakeRes);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Post not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            postService.updatePostById.mockRejectedValue(fakeError);
            await updatePostById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });

/**************************************************************** */

    describe('deletePostById', () => {
        it('should delete a post', async () => {
            const fakePost = fakeReq.body;
            postService.deletePostById.mockResolvedValue(fakePost);
            await deletePostById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakePost);
            expect(postService.deletePostById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if no post is found', async () => {
            const fakePost = null;
            postService.deletePostById.mockResolvedValue(fakePost);
            await deletePostById(fakeReq, fakeRes);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Post not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            postService.deletePostById.mockRejectedValue(fakeError);
            await deletePostById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });

});