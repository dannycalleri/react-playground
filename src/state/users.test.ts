import { createUser, editUser, usersReducer } from "./users";

describe("Users store", () => {
  describe("Create user action", () => {
    it("should return a correct action", () => {
      const action = createUser(1, "Daniele");
      expect(action.type).toBe("CREATE_USER");
      expect(action.payload.id).toBe(1);
      expect(action.payload.name).toBe("Daniele");
    });

    it("should return a correct action when friends are supplied", () => {
      const action = createUser(1, "Daniele", [1, 2, 3]);
      expect(action.type).toBe("CREATE_USER");
      expect(action.payload.id).toBe(1);
      expect(action.payload.name).toBe("Daniele");
      expect(action.payload.friends).toStrictEqual([1, 2, 3]);
    });
  });

  describe("Edit user action", () => {
    it("should return a correct action", () => {
      const action = editUser(1, "Daniele");
      expect(action.type).toBe("EDIT_USER");
      expect(action.payload.id).toBe(1);
      expect(action.payload.name).toBe("Daniele");
    });
  });

  describe("Reducer", () => {
    it("should add a new user to state when createUser action is dispatched", () => {
      const state = usersReducer([], createUser(3, "Daniele", [1, 2, 3]));
      const user = state[0];
      expect(user.id).toBe(3);
      expect(user.name).toBe("Daniele");
      expect(user.friends).toStrictEqual([1, 2, 3]);
    });

    it("should treat friendship correctly when creating a new user", () => {
      const state = usersReducer(
        [
          {
            id: 1,
            name: "Massimo",
            friends: [],
          },
        ],
        createUser(2, "Daniel", [1])
      );
      const user = state[1];
      expect(user.id).toBe(2);
      expect(user.name).toBe("Daniel");
      expect(user.friends).toStrictEqual([1]);

      const userB = state[0];
      expect(userB.id).toBe(1);
      expect(userB.friends).toStrictEqual([2]);
    });

    it("should treat friendship correctly when editing", () => {
      const state = usersReducer(
        [
          {
            id: 1,
            name: "Massimo",
            friends: [],
          },
          {
            id: 2,
            name: "Daniele",
            friends: [],
          },
        ],
        editUser(2, "Daniel", [1])
      );
      const user = state[1];
      expect(user.id).toBe(2);
      expect(user.name).toBe("Daniel");
      expect(user.friends).toStrictEqual([1]);

      const userB = state[0];
      expect(userB.id).toBe(1);
      expect(userB.friends).toStrictEqual([2]);
    });

    it("should remove friendship correctly when editing", () => {
      const state = usersReducer(
        [
          {
            id: 1,
            name: "Massimo",
            friends: [2],
          },
          {
            id: 2,
            name: "Daniele",
            friends: [1],
          },
        ],
        editUser(2, "Daniel", [])
      );
      const user = state[1];
      expect(user.id).toBe(2);
      expect(user.name).toBe("Daniel");
      expect(user.friends).toStrictEqual([]);

      const userB = state[0];
      expect(userB.id).toBe(1);
      expect(userB.friends).toStrictEqual([]);
    });

    it("should remove friendship correctly when editing #2", () => {
      const state = usersReducer(
        [
          {
            id: 1,
            name: "Massimo",
            friends: [2, 3, 4],
          },
          {
            id: 2,
            name: "Daniele",
            friends: [1],
          },
          {
            id: 3,
            name: "Stefano",
            friends: [1],
          },
          {
            id: 4,
            name: "Seby",
            friends: [1],
          },
        ],
        editUser(1, "Massimo", [])
      );
      const user = state[0];
      expect(user.id).toBe(1);
      expect(user.name).toBe("Massimo");
      expect(user.friends).toStrictEqual([]);

      const userB = state[1];
      expect(userB.id).toBe(2);
      expect(userB.friends).toStrictEqual([]);

      const userC = state[2];
      expect(userC.id).toBe(3);
      expect(userC.friends).toStrictEqual([]);

      const userD = state[3];
      expect(userD.id).toBe(4);
      expect(userD.friends).toStrictEqual([]);
    });

    it("should edit an existing user when editUser action is dispatched", () => {
      const state = usersReducer(
        [
          {
            id: 3,
            name: "Daniele",
            friends: [1],
          },
        ],
        editUser(3, "Daniel")
      );
      const user = state[0];
      expect(user.id).toBe(3);
      expect(user.name).toBe("Daniel");
    });

    it("should edit an existing user when editUser action is dispatched and more users are in state", () => {
      const state = usersReducer(
        [
          {
            id: 1,
            name: "Emanuele",
          },
          {
            id: 3,
            name: "Daniele",
            friends: [1],
          },
          {
            id: 4,
            name: "Stefano",
          },
        ],
        editUser(3, "Daniel", [1, 4])
      );
      const user = state[1];
      expect(user.id).toBe(3);
      expect(user.name).toBe("Daniel");
      expect(user.friends).toStrictEqual([1, 4]);
    });
  });
});
