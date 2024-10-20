const messageController = require("../controller/message");
const userController = require("../controller/user");
const authController = require("../controller/auth");
const authMiddleware= require('../middleware/index')



module.exports = app => {
    
    //auth
    app.post('/register', authController.register);
    app.post('/login', authController.login);
    app.post('/logout', authMiddleware, authController.logout);

    //users
    app.get('/users', userController.getUsers);
    app.get('/users/:id',  userController.getUserDetails);
    app.put('/users/:id',  userController.updateUser);
    app.delete('/users/:id',  userController.deleteUser);

    // message 
    app.post("/api/message/sendMessage", authMiddleware, messageController.sendMessage );
    app.get("/api/message/getMessages/:receiver_id", authMiddleware, messageController.getMessages );


}
