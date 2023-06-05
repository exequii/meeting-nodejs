const postRepository = require('../../../src/infrastructure/persistence/postRepository');
const { createPost, getAllPosts, getPostById, getPostsByFilters, updatePostById, deletePostById } = require("../../../src/domain/services/postService");
jest.mock('../../../src/infrastructure/persistence/postRepository');

describe("Post Service Test", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const post = {
        title: "Post 1",
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        type: "informative",
        date: "2021-05-05T00:00:00.000Z",
        author: "60a9b0b9e1b3a1b4b8b0b8b0",
        project: "60a9b0b9e1b3a1b4b8b0b8b0",
        messages: []
    };
    const id = "60a9b0b9e1b3a1b4b8b0b8b0"

    describe("createPost", () => {
        it('should create a post', async () => {
            postRepository.create.mockResolvedValue(post);
            const result = await createPost(post);

            expect(result.title).toEqual(post.title);
            expect(result.body).toEqual(post.body);
            expect(result.author).toEqual(post.author);
            expect(postRepository.create).toHaveBeenCalled();
        });

        it('should return an error if an error occurs', async () => {
            postRepository.create.mockRejectedValue(new Error("Error"));
            await expect(createPost(post)).rejects.toThrowError("Error");
            expect(postRepository.create).toHaveBeenCalled();
        });
    });

//     /****************************************************************** */

//     describe("getAllPosts", () => {});

//     /****************************************************************** */

//     describe("getPostById", () => {});

//     /****************************************************************** */

//     describe("getPostsByFilters", () => {});

//     /****************************************************************** */

    describe("updatePostById", () => {
        it('should update a post', async () => {
            postRepository.updateById.mockResolvedValue(post);
            const result = await updatePostById(id, post);

            expect(result.title).toEqual(post.title);
            expect(result.body).toEqual(post.body);
            expect(result.author).toEqual(post.author);
            expect(postRepository.updateById).toHaveBeenCalled();
        });

        it('should return an error if an error occurs', async () => {
            postRepository.updateById.mockRejectedValue(new Error("Error"));
            await expect(updatePostById(id, post)).rejects.toThrowError("Error");
            expect(postRepository.updateById).toHaveBeenCalled();
        });

        it('should return null if the post does not exist', async () => {
            postRepository.updateById.mockResolvedValue(null);
            const result = await updatePostById(id, post);

            expect(result).toEqual(null);
            expect(postRepository.updateById).toHaveBeenCalled();
        });
    });

//     /****************************************************************** */

    describe("deletePostById", () => {
        it('should delete a post', async () => {
            postRepository.deleteById.mockResolvedValue(post);
            const result = await deletePostById(id);

            expect(result.title).toEqual(post.title);
            expect(result.body).toEqual(post.body);
            expect(result.author).toEqual(post.author);
            expect(postRepository.deleteById).toHaveBeenCalled();
        });

        it('should return an error if an error occurs', async () => {
            postRepository.deleteById.mockRejectedValue(new Error("Error"));
            await expect(deletePostById(id)).rejects.toThrowError("Error");
            expect(postRepository.deleteById).toHaveBeenCalled();
        });

        it('should return null if the post does not exist', async () => {
            postRepository.deleteById.mockResolvedValue(null);
            const result = await deletePostById(id);

            expect(result).toEqual(null);
            expect(postRepository.deleteById).toHaveBeenCalled();
        });
    });

});