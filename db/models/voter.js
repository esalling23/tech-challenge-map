'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const Voter = db.define('voters', {
  title: {
  	type: Sequelize.STRING,
  	allowNull: false
  },
  approves: {
  	type: Sequelize.BOOLEAN,
  	allowNull: false
  },
  address: {
  	type: Sequelize.STRING,
  	allowNull: false
  }

});

module.exports = Voter;
