import { User, Action } from "../types";

const CREATE_USER = "CREATE_USER";
const EDIT_USER = "EDIT_USER";

export function createUser(id: number, name: string, friends: number[] = []) {
  return {
    type: CREATE_USER,
    payload: {
      id,
      name,
      friends,
    },
  };
}

export function editUser(id: number, name: string, friends: number[] = []) {
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
      const friendsIDs: number[] = action.payload.friends;

      // edit old users to add/remove eventual friendships
      const users = state.map((user) => {
        const isFriend = friendsIDs.includes(user.id);
        let newFriends: number[] = [];
        if (isFriend) {
          newFriends = [...(user.friends ?? []), action.payload.id];
        } else {
          const index = user.friends?.findIndex(
            (id) => id === action.payload.id
          );
          if (index) {
            newFriends = [
              ...(user.friends ?? []).slice(0, index),
              ...(user.friends ?? []).slice(index + 1),
            ];
          }
        }

        return {
          id: user.id,
          name: user.name,
          friends: newFriends,
        };
      });

      const userIndex = state.findIndex((u) => u.id === action.payload.id);
      const user = state[userIndex];

      const newUser = {
        id: user.id,
        name: action.payload.name,
        friends: action.payload.friends,
      };

      const newState = [
        ...users.slice(0, userIndex),
        newUser,
        ...users.slice(userIndex + 1),
      ];

      return newState;
    }
    case CREATE_USER: {
      const friendsIDs: number[] = action.payload.friends;

      // edit users to add eventual friendships
      const users = state.map((user) => {
        const isFriend = friendsIDs.includes(user.id);
        return {
          ...(isFriend
            ? {
                id: user.id,
                name: user.name,
                friends: [
                  ...(user.friends ? user.friends : []),
                  action.payload.id,
                ],
              }
            : user),
        };
      });

      return [
        ...users,
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
