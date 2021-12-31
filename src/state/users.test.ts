import { createUser, usersReducer } from "./users";

describe("Users store", () => {
  describe("Create user action", () => {
    it("should return a correct action", () => {
      const action = createUser("Daniele");
      expect(action.type).toBe("CREATE_USER");
      expect(action.payload.name).toBe("Daniele");
    });
  });

  describe("Reducer", () => {
    it("should add a new user to state when createUser action is dispatched", () => {
      const state = usersReducer([], createUser("Daniele"));
      const user = state[0];
      expect(user.id).toBe(1);
      expect(user.name).toBe("Daniele");
    });
  });
});
