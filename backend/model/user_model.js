module.exports = (sequelize,Sequelize) => {
    const userTable = sequelize.define("user", {
        user_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: { isEmail: true }
        },
        phone: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.ENUM('Teacher', 'Student', 'Institute'),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        online: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.STRING,
            default: "ACTIVE"
        },
    }, {
        timestamps: true,
    })
    return userTable;
    }