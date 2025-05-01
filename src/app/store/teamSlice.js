"use client";

import { createSlice } from "@reduxjs/toolkit";

const loadTeams = () => {
  try {
    const data = localStorage.getItem("teamsState");
    return data ? JSON.parse(data) : { teams: [], selectedTeam: null };
  } catch (error) {
    console.error("Error loading teams from localStorage:", error);
    return { teams: [], selectedTeam: null };
  }
};

const saveTeams = (state) => {
  try {
    localStorage.setItem("teamsState", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving teams to localStorage:", error);
  }
};

const initialState = loadTeams();

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
      saveTeams(state);
    },

    addTeam: (state, action) => {
      const newTeam = action.payload;
      const nameExists = state.teams.some((team) => team.name === newTeam.name);
      if (nameExists) {
        state.error = "Team name must be unique";
        return;
      }
      const playerExists = state.teams.some((team) =>
        team.players?.some((p) =>
          newTeam.players?.some((np) => np.value === p.value)
        )
      );
      if (playerExists) {
        state.error = "A player can only be in one team";
        return;
      }
      state.teams.push(newTeam);
      state.error = null;
      saveTeams(state);
    },

    updateTeam: (state, action) => {
      const updatedTeam = action.payload;
      const index = state.teams.findIndex((t) => t.id === updatedTeam.id);
      if (index !== -1) {
        const nameConflict = state.teams.some(
          (t, i) => i !== index && t.name === updatedTeam.name
        );
        if (nameConflict) {
          state.error = "Team name must be unique";
          return;
        }

        const otherPlayers = state.teams
          .filter((_, i) => i !== index)
          .flatMap((t) => t.players ?? []);
        const conflict = updatedTeam.players?.some((p) =>
          otherPlayers.some((op) => op.value === p.value)
        );
        if (conflict) {
          state.error = "A player can only be in one team";
          return;
        }

        state.teams[index] = updatedTeam;
        state.error = null;
        saveTeams(state);
      }
    },

    deleteTeam: (state, action) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
      saveTeams(state);
    },

    selectTeam: (state, action) => {
      state.selectedTeam = action.payload;
      saveTeams(state);
    },
  },
});

export const { setTeams, addTeam, updateTeam, deleteTeam, selectTeam } =
  teamSlice.actions;

// ✅ Selector function (not a reducer!)
export const getTeamById = (state, id) =>
  state.team.teams.find((team) => team.id === id);

export default teamSlice.reducer;
