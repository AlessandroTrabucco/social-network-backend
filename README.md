# Social Network Project Backend
Express JS application, backend of my social network react project that you can access here https://github.com/AlessandroTrabucco/social-network-frontend.
This application authenticates a client using a Json Web Token, and after that, the client can access all public posts, send request to create, update and delete posts. When the client sends a post, an image is sent and is managed through the multer package.The application stores data in MongoDB, using mongoose package. I have also used Socket.IO to allow a user to have a real time chat. 
