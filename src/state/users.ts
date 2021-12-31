import { User, Action } from "../types";

const CREATE_USER = "CREATE_USER";

export function createUser(name: string, friends?: number[]) {
  return {
    type: CREATE_USER,
    payload: {
      name,
      friends,
    },
  };
}

export function usersReducer(state: User[], action: Action): User[] {
  switch (action.type) {
    case CREATE_USER: {
      const newId = state.length + 1;
      return [
        ...state,
        {
          id: newId,
          name: action.payload.name,
          friends: action.payload.friends,
        },
      ];
    }
    default: {
      return [...state];
    }
  }
}
