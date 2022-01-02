import { User, Action } from "../types";

const CREATE_USER = "CREATE_USER";

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

export function usersReducer(state: User[], action: Action): User[] {
  switch (action.type) {
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
      return [...state];
    }
  }
}
