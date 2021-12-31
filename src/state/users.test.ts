import { createUser, usersReducer } from "./users";

describe("Users store", () => {
  describe("Create user action", () => {
    it("should return a correct action", () => {
      const action = createUser("Daniele");
      expect(action.type).toBe("CREATE_USER");
      expect(action.payload.name).toBe("Daniele");
    });

    it("should return a correct action when friends are supplied", () => {
      const action = createUser("Daniele", [1, 2, 3]);
      expect(action.type).toBe("CREATE_USER");
      expect(action.payload.name).toBe("Daniele");
      expect(action.payload.friends).toStrictEqual([1, 2, 3]);
    });
  });

  describe("Reducer", () => {
    it("should add a new user to state when createUser action is dispatched", () => {
      const state = usersReducer([], createUser("Daniele", [1, 2, 3]));
      const user = state[0];
      expect(user.id).toBe(1);
      expect(user.name).toBe("Daniele");
      expect(user.friends).toStrictEqual([1, 2, 3]);
    });
  });
});
