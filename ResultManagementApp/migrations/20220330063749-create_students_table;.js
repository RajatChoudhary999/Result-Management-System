'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("students", {
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
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  async down(queryInterface, Sequelize) {
   
    await queryInterface.dropTable("students");
  }
};

