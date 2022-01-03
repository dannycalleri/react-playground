import { GENERIC_ERROR, MAX_RETRIES_HIT, USER_ALREADY_EXISTS } from "../errors";
import { User } from "../types";

async function throttle() {
  return new Promise<void>((resolve) => {
    const randomMs = 100 + Math.random() * 1000;
    setTimeout(() => resolve(), randomMs);
  });
}

async function sendRequest(payload: RequestPayload) {
  const maxRetries = 2;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(
        `REQUEST MOCK: sending request #${retries} with payload ${payload}`
      );

      // does nothing
      await throttle();
      // errors randomly
      if (Math.random() < 0.2) {
        throw new Error(GENERIC_ERROR);
      }

      // identity
      return payload;
    } catch (error) {
      console.error(error);
      const message = (error as Error).message;
      if (message === GENERIC_ERROR) {
        retries++;
        console.log(`retries ${retries}`);

        if (retries >= maxRetries) {
          throw new Error(MAX_RETRIES_HIT);
        }
      } else {
        throw error;
      }
    }
  }
}

interface RequestPayload {
  id?: number;
  users: User[];
  name: string;
  friends: number[];
}

export default class UsersApi {
  /**
   * This implementation does nothing, just adds a throttle and retry logic
   * @param users the in-memory list of existing users
   * @param name name of the user to be created
   * @param friends array of user IDs representing this user's friends
   * @returns Promise
   */
  static async createUser(users: User[], name: string, friends: number[]) {
    const response = await sendRequest({ users, name, friends });

    if (!response) {
      throw new Error(GENERIC_ERROR);
    }

    const userExists = Boolean(
      response.users.find((u) => u.name === response.name)
    );
    if (userExists) {
      throw new Error(USER_ALREADY_EXISTS);
    }

    return {
      name: response.name,
      friends: response.friends,
      id: response.users.length + 1,
    };
  }

  static async editUser(
    users: User[],
    id: number,
    name: string,
    friends: number[]
  ) {
    const response = await sendRequest({ id, users, name, friends });

    if (!response) {
      throw new Error(GENERIC_ERROR);
    }

    const user = response.users.find((u) => u.name === response.name);
    const userWithSameNameExists = Boolean(user);
    if (userWithSameNameExists && user?.id !== id) {
      throw new Error(USER_ALREADY_EXISTS);
    }

    return {
      name: response.name,
      friends: response.friends,
      id: id,
    };
  }
}
