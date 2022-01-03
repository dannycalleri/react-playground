import { User, Action } from "../types";

const CREATE_USER = "CREATE_USER";
const EDIT_USER = "EDIT_USER";

export function createUser(id: number, name: string, friends?: number[]) {
  return {
    type: CREATE_USER,
    payload: {
      id,
      name,
      friends,
    },
  };
}

export function editUser(id: number, name: string, friends?: number[]) {
  return {
    type: EDIT_USER,
    payload: {
      id,
      name,
      friends,
    },
  };
}

export function usersReducer(state: User[], action: Action): User[] {
  switch (action.type) {
    case EDIT_USER: {
      const userIndex = state.findIndex((u) => u.id === action.payload.id);
      const user = state[userIndex];
      const newUser = {
        id: user.id,
        name: action.payload.name,
        friends: action.payload.friends,
      };

      return [
        ...state.slice(0, userIndex),
        newUser,
        ...state.slice(userIndex + 1),
      ];
    }
    case CREATE_USER: {
      return [
        ...state,
        {
          id: action.payload.id,
          name: action.payload.name,
          friends: action.payload.friends,
        },
      ];
    }
    default: {
      throw new Error();
    }
  }
}
