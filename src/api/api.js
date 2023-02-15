import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ComeAwayApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ComeAwayApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  static async getCalData(calViewId, businessBeginsHourId, businessEndsHourId) {
    let res = await this.request(
      `calendar`,
      calViewId,
      businessBeginsHourId,
      businessEndsHourId
    );
    return res;
  }

  static async createCal(data) {
    let res = await this.request(`calendar/create`, data, "post");
    return res;
  }

  static async getCalViews(id, viewType) {
    let res = await this.request(`calendar/cal-views`, id, viewType);
    return res;
  }

  static async getBeginHours(id, businessBeginsHour) {
    let res = await this.request(
      `calendar/begin-hours`,
      id,
      businessBeginsHour
    );
    return res;
  }

  static async getEndtHours(id, businessEndsHour) {
    let res = await this.request(`calendar/end-hours`, id, businessEndsHour);
    return res;
  }
}

export default ComeAwayApi;
