const {createPost,getAllPosts, getPostsByFilters, getPostById, updatePostById, deletePostById } = require('../../../src/delivery/controllers/postController');
const postService = require('../../../src/domain/services/postService');
const Post = require('../../../src/domain/models/post');
jest.mock('../../../src/domain/services/postService');

describe('Post Controller', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const fakeReq = {
        params: {
            id: "60a9b0b9e1b3a1b4b8b0b8b0",
            pagination: 1
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
            //given
            const fakePost = givenAFullPost(fakeReq.body);
            //when
            await whenSaveThePost(fakePost,fakeReq,fakeRes);
            //then
            thenPostSavedSuccessfully(fakeRes, fakePost,fakeReq);
        });

        it('should return a 500 if an error occurs', async () => {
            //given
            const fakeError = givenAFullPostWithError();
            //when
            await whenSaveThePostWithError(fakeError,fakeReq,fakeRes);
            //then
            thenPostRejected(fakeRes, fakeError);
        });
    });


/**************************************************************** */

    describe('getAllPost', () => {
        it('should return all posts', async () => {
            //given
            const fakePosts = givenAFullPost(fakeReq.body);
            //when
            await whenGetAllPosts(fakePosts,fakeReq,fakeRes);
            //then
            thenGetAllPosts(fakeRes, fakePosts);
        });

        it('should return a 204 if no posts are found', async () => {
            //given
            const fakePosts = givenANullPost();
            //when
            await whenGetAllPosts(fakePosts,fakeReq,fakeRes);
            //then
            thenNotGetAllOrFilterPosts(fakeRes, fakePosts);
        });

        it('should return a 500 if an error occurs', async () => {
            //given
            const fakeError = givenAFullPostWithError();
            //when
            await whenGetAllPostsWithError(fakeError,fakeReq,fakeRes);
            //then
            thenPostRejected(fakeRes, fakeError);
        });

    });

/**************************************************************** */

    describe('getPostsByFilters', () => {
        it('should return all posts', async () => {
            const fakePosts = [fakeReq.body];
            postService.getPostsByFilters.mockResolvedValue(fakePosts);
            await getPostsByFilters(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakePosts);
            expect(postService.getPostsByFilters).toHaveBeenCalledWith(fakeReq.body,fakeReq.params.pagination);
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
            //given
            const fakePost = givenAFullPost(fakeReq.body);
            //when
            await whenUpdateThePost(fakePost,fakeReq,fakeRes);
            //then
            thenPostUpdatedSuccessfully(fakeRes, fakePost,fakeReq);
        });

        it('should return a 204 if no post is found', async () => {
            //given
            const fakePost = givenANullPost();
            //when
            await whenUpdateThePost(fakePost,fakeReq,fakeRes);
            //then
            thenUpdateOrDeleteWithNullPost(fakeRes, fakePost);
        });

        it('should return a 500 if an error occurs', async () => {
            //given
            const fakeError = givenAFullPostWithError();
            //when
            await whenUpdateThePostWithError(fakeError,fakeReq,fakeRes);
            //then
            thenUpdateOrDeletePostWithError(fakeRes, fakeError);
        });
    });

/**************************************************************** */

    describe('deletePostById', () => {
        it('should delete a post', async () => {
            //given
            const fakePost = givenAFullPost(fakeReq.body);
            //when
            await whenDeleteThePost(fakePost,fakeReq,fakeRes);
            //then
            thenPostDeletedSuccessfully(fakeRes, fakePost, fakeReq);
        });

        it('should return a 204 if no post is found', async () => {
            //given
            const fakePost = givenANullPost();
            //when
            await whenDeleteThePost(fakePost,fakeReq,fakeRes);
            //then
            thenUpdateOrDeleteWithNullPost(fakeRes, fakePost, fakeReq);
        });

        it('should return a 500 if an error occurs', async () => {
            //given
            const fakeError = givenAFullPostWithError();
            //when
            await whenDeleteThePostWithError(fakeError,fakeReq,fakeRes);
            //then
            thenUpdateOrDeletePostWithError(fakeRes, fakeError);
        });
    });


        /*************************************************************************** GIVEN ********************************************************************/

        const givenAFullPost = (fakePost) => {
            const post = new Post(fakePost);
            if(post.validateEssentialData()) return post;
            else return new Error("");
        }
    
        const givenAFullPostWithError = () => {
            const post = new Post({});
            if(post.validateEssentialData()) return post;
            else return new Error("Error");
        }
    
        const givenANullPost = () => {
            return null;
        }
    
    /*************************************************************************** WHEN ********************************************************************/
    
        const whenSaveThePost = async (fakePost,fakeReq,fakeRes) => {
            postService.createPost.mockResolvedValue(fakePost);
            return await createPost(fakeReq, fakeRes);
        }
    
        const whenSaveThePostWithError = async (fakeError,fakeReq,fakeRes) => {
            postService.createPost.mockRejectedValue(fakeError);
            return await createPost(fakeReq, fakeRes);
        }
    
        const whenUpdateThePost = async (fakePost,fakeReq,fakeRes) => {
            postService.updatePostById.mockResolvedValue(fakePost);
            return await updatePostById(fakeReq, fakeRes);
        }
    
        const whenUpdateThePostWithError = async (fakeError,fakeReq,fakeRes) => {
            postService.updatePostById.mockRejectedValue(fakeError);
            return await updatePostById(fakeReq, fakeRes);
        }
    
        const whenDeleteThePost = async (fakePost,fakeReq,fakeRes) => {
            postService.deletePostById.mockResolvedValue(fakePost);
            return await deletePostById(fakeReq, fakeRes);
        }
    
        const whenDeleteThePostWithError = async (fakeError,fakeReq,fakeRes) => {
            postService.deletePostById.mockRejectedValue(fakeError);
            return await deletePostById(fakeReq, fakeRes);
        }

        const whenGetAllPosts = async (fakePosts,fakeReq,fakeRes) => {
            postService.getAllPosts.mockResolvedValue(fakePosts);
            return await getAllPosts(fakeReq, fakeRes);
        }

        const whenGetAllPostsWithError = async (fakeError,fakeReq,fakeRes) => {
            postService.getAllPosts.mockRejectedValue(fakeError);
            return await getAllPosts(fakeReq, fakeRes);
        }
    
    /*************************************************************************** THEN ********************************************************************/
    
        const thenPostSavedSuccessfully = (fakeRes, fakePost,fakeReq) => {
            expect(fakeRes.json).toHaveBeenCalledWith(fakePost);
            expect(postService.createPost).toHaveBeenCalledWith(fakeReq.body);
            expect(fakeRes.status).toHaveBeenCalledWith(201);
        }
    
        const thenPostRejected = (fakeRes, fakeError) => {
            expect(fakeRes.json).toHaveBeenCalled();
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        }

        const thenGetAllPosts = (fakeRes, fakePosts) => {
            expect(fakeRes.json).toHaveBeenCalledWith(fakePosts);
            expect(postService.getAllPosts).toHaveBeenCalled();
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        }
    
        const thenUpdateOrDeleteWithNullPost = (fakeRes) => {
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Post not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        }

        const thenNotGetAllOrFilterPosts = (fakeRes, fakePosts) => {
            expect(fakeRes.json).toHaveBeenCalledWith({results:[], message: 'Posts not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        }
    
        const thenUpdateOrDeletePostWithError = (fakeRes, fakeError) => {
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        }
    
        const thenPostUpdatedSuccessfully = (fakeRes, fakePost,fakeReq) => {
            expect(fakeRes.json).toHaveBeenCalledWith(fakePost);
            expect(postService.updatePostById).toHaveBeenCalledWith(fakeReq.params.id,fakeReq.body);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        }
    
        const thenPostDeletedSuccessfully = (fakeRes, fakePost,fakeReq) => {
            expect(fakeRes.json).toHaveBeenCalledWith(fakePost);
            expect(postService.deletePostById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        }

});