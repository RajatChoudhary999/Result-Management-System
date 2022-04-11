const Sequelize = require("sequelize");

module.exports = sequelize.define("students", {
    roll: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dob: {
        type: Sequelize.STRING,
        allowNull: false
    },
    score: {
        type: Sequelize.INTEGER(3),
        allowNull: false
    }
});
