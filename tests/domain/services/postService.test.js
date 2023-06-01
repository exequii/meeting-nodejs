// const Post = require("../.././src/models/post");
// const { createPost, getAllPosts, getPostById, getPostsByFilters, updatePostById, deletePostById } = require("../.././src/services/postService");
// const Utils = require("../.././src/utils/utilities");
// jest.mock('../.././src/utils/utilities');

// describe("Post Service Test", () => {
//     afterEach(() => {
//         jest.restoreAllMocks();
//     });

//     const post = {
//         title: "Post 1",
//         body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//         type: "informative",
//         date: "2021-05-05T00:00:00.000Z",
//         author: "60a9b0b9e1b3a1b4b8b0b8b0",
//         project: "60a9b0b9e1b3a1b4b8b0b8b0",
//         messages: []
//     };

//     describe("createPost", () => {
//         it('should create a post', async () => {
//             const spy = jest.spyOn(Utils, "createPostAndUpdateRelations").mockImplementation(jest.fn().mockResolvedValue(post));
//             const result = await createPost(post);

//             expect(result.title).toEqual(post.title);
//             expect(result.body).toEqual(post.body);
//             expect(result.author).toEqual(post.author);
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return an error if an error occurs', async () => {
//             const spy = jest.spyOn(Utils, "createPostAndUpdateRelations").mockImplementation(jest.fn().mockRejectedValue(new Error("Error")));
//             await expect(createPost(post)).rejects.toThrowError("Error");
//             expect(spy).toHaveBeenCalled();
//         });
//     });

//     /****************************************************************** */

//     describe("getAllPosts", () => {});

//     /****************************************************************** */

//     describe("getPostById", () => {});

//     /****************************************************************** */

//     describe("getPostsByFilters", () => {});

//     /****************************************************************** */

//     describe("updatePostById", () => {
//         it('should update a post', async () => {
//             const spy = jest.spyOn(Post, "findByIdAndUpdate").mockImplementation(jest.fn().mockResolvedValue(post));
//             const result = await updatePostById(post._id, post);

//             expect(result.title).toEqual(post.title);
//             expect(result.body).toEqual(post.body);
//             expect(result.author).toEqual(post.author);
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return an error if an error occurs', async () => {
//             const spy = jest.spyOn(Post, "findByIdAndUpdate").mockImplementation(jest.fn().mockRejectedValue(new Error("Error")));
//             await expect(updatePostById(post._id, post)).rejects.toThrowError("Error");
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return null if the post does not exist', async () => {
//             const spy = jest.spyOn(Post, "findByIdAndUpdate").mockImplementation(jest.fn().mockResolvedValue(null));
//             const result = await updatePostById(post._id, post);

//             expect(result).toEqual(null);
//             expect(spy).toHaveBeenCalled();
//         });
//     });

//     /****************************************************************** */

//     describe("deletePostById", () => {
//         it('should delete a post', async () => {
//             const spy = jest.spyOn(Post, "findByIdAndDelete").mockImplementation(jest.fn().mockResolvedValue(post));
//             const result = await deletePostById(post._id);

//             expect(result.title).toEqual(post.title);
//             expect(result.body).toEqual(post.body);
//             expect(result.author).toEqual(post.author);
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return an error if an error occurs', async () => {
//             const spy = jest.spyOn(Post, "findByIdAndDelete").mockImplementation(jest.fn().mockRejectedValue(new Error("Error")));
//             await expect(deletePostById(post._id)).rejects.toThrowError("Error");
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return null if the post does not exist', async () => {
//             const spy = jest.spyOn(Post, "findByIdAndDelete").mockImplementation(jest.fn().mockResolvedValue(null));
//             const result = await deletePostById(post._id);

//             expect(result).toEqual(null);
//             expect(spy).toHaveBeenCalled();
//         });
//     });

// });