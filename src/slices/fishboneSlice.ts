import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { diagramAPI } from "../services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Cause {
  id: number;
  name: string;
  notes?: string;
  causes: Cause[];
}

export interface FishboneState {
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  problem: string | null;
  causes?: Cause[] | null;
}

export const fetchDiagram = createAsyncThunk(
  "diagram/fetchDiagram",
  async ({ userId, diagramId }: { userId: string; diagramId: string }) => {
    const response = await diagramAPI.getByUserIdAndId(userId, diagramId);
    return response.data;
  }
);

export const updateDiagram = createAsyncThunk(
  "diagram/updateDiagram",
  async ({
    userId,
    diagramId,
    problem,
    causes,
  }: {
    userId: string;
    diagramId: string;
    problem: string;
    causes?: Cause[];
  }) => {
    const response = await diagramAPI.updateDiagram(
      userId,
      diagramId,
      problem,
      causes || []
    );
    return response.data;
  }
);

function findCauseById(causes: Cause[], targetId: number): Cause | null {
  for (const cause of causes) {
    if (cause.id === targetId) {
      return cause;
    }
    if (cause.causes) {
      const found = findCauseById(cause.causes, targetId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

const initialState: FishboneState = {
  status: "idle",
  error: null,
  problem: null,
  causes: [],
};

export const fishboneSlice = createSlice({
  name: "fishbone",
  initialState,
  reducers: {
    // updateProblem: (state, action: PayloadAction<string>) => {
    //   state.problem = action.payload;
    // },
    updateCause: (
      state,
      action: PayloadAction<{ id: number; newName: string; newNotes: string }>
    ) => {
      if (state.causes) {
        const cause = findCauseById(state.causes, action.payload.id);
        if (cause) {
          cause.name = action.payload.newName;
          cause.notes = action.payload.newNotes;
        }
      }
    },
    addCause: (
      state,
      action: PayloadAction<{
        parentId: number;
        newCauseName: string;
        notes?: string;
      }>
    ) => {
      if (state.causes) {
        const parent = findCauseById(state.causes, action.payload.parentId);

        if (parent) {
          const newCause: Cause = {
            id: Math.floor(Math.random() * 10000000) + 1, // Should be dictated by server
            name: action.payload.newCauseName,
          };
          parent.causes = [...(parent.causes || []), newCause];
        }
      }
    },
    addCauseCategory: (
      state,
      action: PayloadAction<{ newCauseCategoryName: string; notes?: string }>
    ) => {
      const newCauseCategory: Cause = {
        id: Math.floor(Math.random() * 10000000) + 1, // Should be dictated by server
        name: action.payload.newCauseCategoryName,
        notes: action.payload.notes,
      };
      state.causes = [...(state.causes || []), newCauseCategory];
    },
    deleteCause: (state, action: PayloadAction<{ id: number }>) => {
      const removeCause = (causes: Cause[]): Cause[] =>
        causes.filter((c) => {
          if (c.id === action.payload.id) return false;
          if (c.causes) c.causes = removeCause(c.causes);
          return true;
        });

      if (state.causes) {
        state.causes = removeCause(state.causes);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiagram.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchDiagram.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.causes = action.payload.causes as Cause[];
        state.problem = action.payload.problem;
      })
      .addCase(fetchDiagram.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to fetch diagram";
      })
      .addCase(updateDiagram.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateDiagram.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.causes = action.payload.causes as Cause[];
        state.problem = action.payload.problem;
      })
      .addCase(updateDiagram.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to update diagram";
      });
  },
});

export const {
  updateCause,
  addCause,
  deleteCause,
  addCauseCategory,
} = fishboneSlice.actions;

export default fishboneSlice.reducer;

export const selectDiagram = (state: RootState) => state.fishbone.problem;
export const selectDiagramStatus = (state: RootState) => state.fishbone.status;
