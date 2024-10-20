
const User = require('./user_model');

module.exports = (sequelize, Sequelize) => {
    const messageTable = sequelize.define("message", {
        message_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sender_id: {
            type: Sequelize.INTEGER,
        },
        receiver_id: {
            type: Sequelize.INTEGER,
        },
        content: {
            type: Sequelize.TEXT,
        },
    }, {
        timestamps: true
    })
    return messageTable;
}