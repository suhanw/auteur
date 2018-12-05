import { normalize, schema } from 'normalizr';
import { merge, mergeWith, union } from 'lodash';
import { RECEIVE_BLOG } from '../../actions/blog_actions';
import { RECEIVE_POSTS, RECEIVE_POST, REMOVE_POST } from '../../actions/post_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';
import { RECEIVE_USERS } from '../../actions/user_actions';
import { RECEIVE_FOLLOWERS } from '../../actions/follow_actions';
import { replaceArray } from '../../util/misc_util';

const defaultState = {
    byId: {},
    allIds: [],
};

const userSchema = new schema.Entity(
    'users',
    {
        primaryBlog: new schema.Entity('blogs', { author: userSchema }, { idAttribute: '_id' })
    },
    { idAttribute: '_id' }
);

const blogSchema = new schema.Entity(
    'blogs',
    {
        author: userSchema,
        posts: [new schema.Entity('posts', {}, { idAttribute: '_id' })],
    },
    { idAttribute: '_id' }
);

const postSchema = new schema.Entity('posts',
    { blog: blogSchema },
    { idAttribute: '_id' });

let payloadSchema;
let normalizedPayload;


const blogsReducer = function (state = defaultState, action) {
    Object.freeze(state);
    let newState = {};
    let blogIdsArr = [];
    let blogId = '';
    let blogPostsArr = [];
    switch (action.type) {
        case RECEIVE_BLOG:
            normalizedPayload = normalize(action.payload, blogSchema);
            newState.byId = mergeWith(
                {},
                state.byId,
                normalizedPayload.entities.blogs,
                replaceArray,
            );
            newState.allIds = union(
                state.allIds,
                [action.payload._id]
            );
            return newState;
        case RECEIVE_POSTS:
            payloadSchema = [postSchema];
            normalizedPayload = normalize(action.payload, payloadSchema);
            if (normalizedPayload.entities.blogs) {
                blogIdsArr = Object.keys(normalizedPayload.entities.blogs);
            }
            newState.byId = merge(
                {},
                state.byId,
                normalizedPayload.entities.blogs,
            );
            newState.allIds = union(
                state.allIds,
                blogIdsArr,
            );
            return newState;
        case RECEIVE_POST:
            let post = action.payload;
            blogId = action.payload.blog;
            newState = merge({}, state);
            blogPostsArr = newState.byId[blogId].posts;
            // if new post, union will append postId to beginning of blog.posts array
            if (blogPostsArr && !blogPostsArr.includes(post._id)) newState.byId[blogId].posts.unshift(post._id);
            return newState;
        case REMOVE_POST:
            blogId = action.payload.blog;
            const deletedPostId = action.payload._id;
            newState = merge({}, state);
            blogPostsArr = newState.byId[blogId].posts;
            // posts array in the blog slice of state is not always populated
            if (blogPostsArr) newState.byId[blogId].posts = blogPostsArr.filter((postId) => postId !== deletedPostId);
            return newState;
        case RECEIVE_USERS:
            payloadSchema = [userSchema];
            normalizedPayload = normalize(action.payload, payloadSchema);
            newState.byId = merge(
                {},
                state.byId,
                normalizedPayload.entities.blogs,
            );
            newState.allIds = union(
                state.allIds,
                Object.keys(normalizedPayload.entities.blogs)
            );
            return newState;
        case REMOVE_CURRENT_USER:
            return defaultState;
        case RECEIVE_FOLLOWERS:
            payloadSchema = [userSchema];
            normalizedPayload = normalize(action.payload.followers, payloadSchema);
            newState.byId = merge(
                {},
                state.byId,
                normalizedPayload.entities.blogs, // thiese are followers' blogs
                action.payload.blog // this is the current blog
            );
            // to add followers array to the blog for which we are fetching followers
            newState.byId[action.payload.blog._id].followers = normalizedPayload.result;

            // account for scenario that the blog has no followers
            let followerBlogIds = (normalizedPayload.result.length > 0) ? Object.keys(normalizedPayload.entities.blogs) : [];
            newState.allIds = union(
                state.allIds,
                followerBlogIds, // follower's blogIds
                [action.payload.blog._id], // current blogId
            );
            return newState;
        default:
            return state;
    };
};

export default blogsReducer;