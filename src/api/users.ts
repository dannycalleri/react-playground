import { GENERIC_ERROR, MAX_RETRIES_HIT, USER_ALREADY_EXISTS } from "../errors";
import { User } from "../types";

async function throttle() {
  return new Promise<void>((resolve) => {
    const randomMs = 100 + Math.random() * 1000;
    setTimeout(() => resolve(), randomMs);
  });
}

async function sendRequest(payload: {
  users: User[];
  name: string;
  friends: number[];
}) {
  const maxRetries = 2;
  let retries = 0;

  async function doRequest() {
    console.log(
      `REQUEST MOCK: sending request #${retries} with payload ${payload}`
    );

    // do nothing

    await throttle();

    if (Math.random() < 0.2) {
      throw new Error(GENERIC_ERROR);
    }

    const userExists = Boolean(
      payload.users.find((u) => u.name === payload.name)
    );
    if (userExists) {
      throw new Error(USER_ALREADY_EXISTS);
    }

    return {
      name: payload.name,
      friends: payload.friends,
      id: payload.users.length + 1,
    };
  }

  while (retries < maxRetries) {
    try {
      const response = await doRequest();
      return response;
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

export default class UsersApi {
  /**
   * This implementation does nothing, just adds a throttle and retry logic
   * @param users the in-memory list of existing users
   * @param name name of the user to be created
   * @param friends array of user IDs representing this user's friends
   * @returns Promise
   */
  static async createUser(users: User[], name: string, friends: number[]) {
    // request mock
    return await sendRequest({ users, name, friends });
  }
}
