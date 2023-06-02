const commonRoutes = require('./routes/common.routes');
const userRouter = require('./routes/users.routes');
const projectsRoutes = require('./routes/projects.routes');
const postsRoutes = require('./routes/posts.routes');
const messagesRoutes = require('./routes/message.routes');
const recommendationsRoutes = require('./routes/recommendations.routes');

module.exports = { commonRoutes, userRouter, projectsRoutes, postsRoutes, messagesRoutes, recommendationsRoutes }