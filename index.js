const { Board } = require("./models/Board");
const { Cheese } = require("./models/Cheese");
const { User } = require("./models/User");

Board.belongsTo(User);
User.hasMany(Board);

Board.belongsToMany(Cheese, { through: "Board_cheeses" });
Cheese.belongsToMany(Board, { through: "Board_cheeses" });

module.exports = {
	Board,
	Cheese,
	User,
};
