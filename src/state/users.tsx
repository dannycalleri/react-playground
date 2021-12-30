import { User, Action } from "../types";

const CREATE_USER = "CREATE_USER";

export function createUser(name: string) {
  return {
    type: CREATE_USER,
    payload: {
      name,
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
        },
      ];
    }
    default: {
      return [...state];
    }
  }
}
