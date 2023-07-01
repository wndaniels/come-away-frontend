export const getAllUsers = async () => ({
  users: [
    {
      id: 1,
      username: "testuser",
      password: "yupp1234",
      first_name: "Test",
      last_name: "User",
      email: "testuser@gmail.com",
      is_admin: true,
    },
  ],
});

export const getAllCals = async () => ({
  calendars: [
    {
      id: 1,
      business_begins_hour_id: 1,
      business_ends_hour_id: 1,
      user_id: 1,
    },
  ],
});

export const getBeginHours = async () => ({
  begin_hours: [
    { business_begins_hour: 1, hour_title: "12:00 AM", iso_time: "00:00:00" },
  ],
});

export const getEndHours = async () => ({
  end_hours: [
    {
      business_ends_hour: 1,
      hour_title: "1:00 AM",
      iso_time: "01:00:00",
    },
  ],
});

export const getAllDueDates = async () => ({
  due_dates: [
    {
      id: 1,
      baby_name: "Test Baby Name",
      year_id: 1,
      month_id: 1,
      day_id: 1,
      user_id: 1,
    },
  ],
});

export const getDays = async () => ({
  days: [
    {
      id: 1,
      day: "1",
    },
  ],
});

export const getMonths = async () => ({
  months: [
    {
      id: 1,
      month: "January",
    },
  ],
});

export const getYears = async () => {
  {
    years: [
      {
        id: 1,
        year: "2023",
      },
    ];
  }
};

// export const createVisit = async (visitData) => {
//   // Return mock created visit data
// };
