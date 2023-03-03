const { sequelize } = require("./db");
const { Board, Cheese, User } = require("./index");

describe("Band and Musician Models", () => {
	beforeAll(async () => {
		await sequelize.sync({ force: true });
	});

	test("populate board", async () => {
		const testBoard = await Board.create({
			type: "stinky",
			description: "chez",
			rating: 5,
		});

		expect(testBoard.type).toBe("stinky");
		expect(testBoard.description).toBe("chez");
		expect(testBoard.rating).toBe(5);
	});
	test("populate cheese", async () => {
		const testCheese = await Cheese.create({
			title: "stinky",
			description: "chez",
		});

		expect(testCheese.title).toBe("stinky");
		expect(testCheese.description).toBe("chez");
	});
	test("populate User", async () => {
		const testUser = await User.create({
			name: "kevin",
			email: "something@gmail.com",
		});

		expect(testUser.name).toBe("kevin");
		expect(testUser.email).toBe("something@gmail.com");
	});

	test("user to board relationship", async () => {
		const user = await User.create({
			name: "kevin",
			email: "something@gmail.com",
		});

		const board1 = await Board.create({
			type: "type1",
			description: "board1",
			rating: 5,
		});

		const board2 = await Board.create({
			type: "type2",
			description: "board2",
			rating: 4,
		});

		await user.addBoard(board1);
		await user.addBoard(board2);

		const boards = await user.getBoards();

		expect(boards).toHaveLength(2);
		expect(boards[0].type).toBe("type1");
		expect(boards[1].type).toBe("type2");
	});

	test("board can have many cheeses", async () => {
		const board = await Board.create({
			type: "Type1",
			description: "Board1",
			rating: 5,
		});

		const cheese1 = await Cheese.create({
			title: "Cheese1",
			description: "Des1",
		});
		const cheese2 = await Cheese.create({
			title: "Cheese2",
			description: "Des2",
		});
		await board.addCheese(cheese1);
		await board.addCheese(cheese2);

		const cheeses = await board.getCheeses();
		expect(cheeses).toHaveLength(2);
		expect(cheeses[0].title).toBe("Cheese1");
		expect(cheeses[1].title).toBe("Cheese2");
	});
	test("cheese can be on many boards", async () => {
		const board1 = await Board.create({
			type: "Type1",
			description: "Board1",
			rating: 5,
		});
		const board2 = await Board.create({
			type: "Type2",
			description: "Board2",
			rating: 4,
		});

		const cheese = await Cheese.create({
			title: "Cheese3",
			description: "Des3",
		});

		await board1.addCheese(cheese);
		await board2.addCheese(cheese);

		const boards = await cheese.getBoards();
		expect(boards).toHaveLength(2);
		expect(boards[0].type).toBe("Type1");
		expect(boards[1].type).toBe("Type2");
	});

	test("board can be loaded with its cheeses", async () => {
		const board = await Board.create({
			type: "type11",
			description: "board11",
			rating: 5,
		});

		const cheese1 = await Cheese.create({
			title: "chez1",
			description: "des1",
		});
		const cheese2 = await Cheese.create({
			title: "chez2",
			description: "des2",
		});
		await board.addCheese(cheese1);
		await board.addCheese(cheese2);

		const boardWithCheese = await Board.findOne({
			where: { id: board.id },
			include: Cheese,
		});

		expect(boardWithCheese.cheeses).toHaveLength(2);
		expect(boardWithCheese.cheeses[0].title).toBe("chez1");
		expect(boardWithCheese.cheeses[1].title).toBe("chez2");
	});
});
