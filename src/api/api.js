import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/**************
 *
 * API Class
 *
 **************/

class ComeAwayApi {
  // Token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

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

  /**************
   *
   * USER DATA
   *
   **************/

  // Get currentUser
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  // Get all users
  static async getAllUsers() {
    let res = await this.request(`users`);
    return res;
  }

  // Get token for login from username, password.
  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  // Sign up for new account
  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  // Updates user information after updating.
  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  /**************
   *
   * CALENDAR DATA
   *
   **************/

  // Get all calendars and displays calendar that userId === currentUser.id
  static async getAllCals(id, businessBeginsHour, businessEndsHour, userId) {
    let res = await this.request(
      `calendar`,
      id,
      businessBeginsHour,
      businessEndsHour,
      userId
    );
    return res;
  }

  // Get start hour data for seeding start times options in form.
  static async getBeginHours(businessBeginsHour, hourTitle, isoTime) {
    let res = await this.request(
      `calendar/begin-hours`,
      businessBeginsHour,
      hourTitle,
      isoTime
    );
    return res;
  }

  // Get end hour data for seeding end times options in form.
  static async getEndtHours(businessEndsHour, hourTitle, isoTime) {
    let res = await this.request(
      `calendar/end-hours`,
      businessEndsHour,
      hourTitle,
      isoTime
    );
    return res;
  }

  // Create new calendar which is the second form in creating a new calendar.
  static async createCal(username, data) {
    let res = await this.request(`calendar/${username}/create`, data, "post");
    return res;
  }

  // Update calendar which in turn updates the start and end times for the calendar.
  static async updateCal(username, id, data) {
    let res = await this.request(
      `calendar/${id}/${username}/edit`,
      data,
      "patch"
    );
    return res;
  }

  // Delete calendar by verifying userId === currentUser.id
  static async deleteCal(username, id, data) {
    let res = await this.request(
      `calendar/${id}/${username}/delete`,
      data,
      "delete"
    );
    return res;
  }

  /**************
   *
   * DUE DATE DATA
   *
   **************/

  // Get day data for seeding day options in form.
  static async getDays(id, day) {
    let res = await this.request(`due-date/days`, id, day);
    return res;
  }

  // Get month data for seeding month options in form.
  static async getMonths(id, month) {
    let res = await this.request(`due-date/months`, id, month);
    return res;
  }

  // Get year data for seeding year options in form.
  static async getYears(id, year) {
    let res = await this.request(`due-date/years`, id, year);
    return res;
  }

  // Initial creation of users due date which is the first form in creating a new calendar.
  static async createDueDate(username, data) {
    let res = await this.request(`due-date/${username}/create`, data, "post");
    return res;
  }

  // Get all due dates and return data where userId === currentUser.id
  static async getAllDueDates(data) {
    let res = await this.request(`due-date`, data);
    return res;
  }

  // Edit due date data which in turn updates calendar start date.
  static async editDueDate(username, id, data) {
    let res = await this.request(
      `due-date/${id}/${username}/edit`,
      data,
      "patch"
    );
    return res;
  }

  // Delete due date by verifying currentUser and due date id.
  static async deleteDueDate(username, id, data) {
    let res = await this.request(
      `due-date/${id}/${username}/delete`,
      data,
      "delete"
    );
    return res;
  }

  /**************
   *
   * VISITOR DATA
   *
   **************/

  // Get all visitors.
  // Will use calendarId to return the correct visitors to the users Calendar.
  static async getAllVisitors(data) {
    let res = await this.request(`visitors`, data);
    return res;
  }

  // Create new visitor.
  static async createVisit(data) {
    let res = await this.request(`visitors/add`, data, "post");
    return res;
  }

  // Delete single visitor event by id.
  static async deleteVisitor(id, username, data) {
    let res = await this.request(
      `visitors/${id}/${username}/delete`,
      data,
      "delete"
    );
    return res;
  }
}

export default ComeAwayApi;
