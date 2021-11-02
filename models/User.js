const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/connection')
const bcrypt = require('bcrypt')

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [8] }
    },
}, {
    hooks: {
        beforeCreate(newUser) {
            newUser.user_name = newUser.user_name.toLowerCase();
            newUser.password = bcrypt.hashSync(newUser.password, 5);
            return newUser;
        },
        beforeUpdate(updatedUser) {
            updatedUser.user_name = updatedUser.user_name.toLowerCase();
            updatedUser.password = bcrypt.hashSync(updatedUser.password, 5);
            return updatedUser;
        }
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
})

module.exports = User