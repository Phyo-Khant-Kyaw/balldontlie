"use client"

const teamSlice = createSlice({
  name: "team",
  initialState: {
    teams: [],
    selectedTeam: null,
  },
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
    addTeam: (state, action) => {
      state.teams.push(action.payload);
    },
    updateTeam: (state, action) => {
      const index = state.teams.findIndex(
        (team) => team.id === action.payload.id
      );
      if (index !== -1) {
        state.teams[index] = action.payload;
      }
    },
    deleteTeam: (state, action) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
    },
  },
});
