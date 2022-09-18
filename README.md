# Social Network Project Backend
Express JS application, REST API, backend of my social network react project that you can access here https://github.com/AlessandroTrabucco/social-network-frontend.
This application authenticates a client using a Json Web Token, and after that, the client can access all public posts, send request to create, update and delete posts. When the client sends request to create a post, an image is sent and is managed through express middleware and the multer package, and saved on the server.The application stores data in MongoDB, using the mongoose package. I have also used Socket.IO to allow a user to have a private real time chat with another user. 
