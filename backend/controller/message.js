const { Op } = require("sequelize");
const mainDb = require("../model/index");
const User = mainDb.userModel;
const Message =  mainDb.messageModel

exports.sendMessage = async (req, res) => {
    const { receiver_id, content, parent_id } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const receiver = await User.findByPk(receiver_id);
        if (!receiver) return res.status(404).json({ msg: 'Receiver not found' });

        const message = await Message.create({
            sender_id: req.user.user_id,
            receiver_id,
            content,
        });
        return res.json(message); 
    } catch (err) {
        res.status(500).send('Server error');
    }
};


exports.getMessages = async (req, res) => {
    const { receiver_id } = req.params; 

    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: req.user.user_id, receiver_id: parseInt(receiver_id) },
                    { sender_id: req.user.user_id, receiver_id: parseInt(receiver_id) }
                ]
            },
            order: [['message_id', 'ASC']]
        });
        return res.json({messages: "show data", data: messages});
    } catch (err) {
        res.status(500).send('Server error');
    }
};
