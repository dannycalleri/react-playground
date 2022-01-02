import { MAX_RETRIES_HIT } from "../errors";

async function throttle() {
  return new Promise<void>((resolve) => {
    const randomMs = 100 + Math.random() * 1000;
    setTimeout(() => resolve(), randomMs);
  });
}

async function sendRequest(payload: any) {
  const maxRetries = 2;
  let retries = 0;

  async function doRequest() {
    console.log(
      `REQUEST MOCK: sending request #${retries} with payload ${payload}`
    );

    // do nothing

    await throttle();

    if (Math.random() < 0.2) {
      throw new Error("request failed");
    }
  }

  while (retries < maxRetries) {
    try {
      await doRequest();
      break;
    } catch (error) {
      console.error(error);
      retries++;

      if (retries >= maxRetries) {
        throw new Error(MAX_RETRIES_HIT);
      }
    }
  }
}

export default class UsersApi {
  /**
   * This implementation does nothing, just adds a throttle and retry logic
   * @param name name of the user
   * @param friends user IDs representing a list of friends
   * @returns Promise
   */
  static async createUser(name: string, friends: number[]) {
    // request mock
    await sendRequest({ payload: { name, friends } });
    return { name, friends };
  }
}
