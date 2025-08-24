import { createSlice, type GetThunkAPI, type AsyncThunkConfig } from "@reduxjs/toolkit";
import { diagramAPI, type Diagram } from "../services/api";
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
  diagram: Diagram | null
}

// Helper function to get the current diagram from the state as deep copy because of immer
function getCurrentDiagram(thunkAPI: GetThunkAPI<AsyncThunkConfig>): Diagram {
  const state = thunkAPI.getState() as RootState;

  const diagram = state.fishbone.diagram;
  if (!diagram) {
    throw new Error("Unable to add cause: diagram is not loaded");
  }
  
  return JSON.parse(JSON.stringify(diagram)) as Diagram;
}

export const fetchDiagram = createAsyncThunk(
  "diagram/fetchDiagram",
  async ({ diagramId }: { diagramId: string }) => {
    const response = await diagramAPI.getById(diagramId);
    return response.data;
  }
);

export const updateProblem = createAsyncThunk(
  "diagram/updateProblem",
  async ({problem}: {problem: string}, thunkAPI) => {
    const updatedDiagram: Diagram = getCurrentDiagram(thunkAPI);

    updatedDiagram.problem = problem;

    const response = await diagramAPI.updateDiagram(updatedDiagram);
    return response.data;
  }
);

export const addCause = createAsyncThunk(
  "diagram/addCause",
  async ({parentId, causeName, notes}: {parentId: number, causeName: string, notes?: string}, thunkAPI) => {
    const updatedDiagram: Diagram = getCurrentDiagram(thunkAPI);

    // Update diagram before sending to server
    const parentCause = findCauseById(updatedDiagram.causes, parentId);

    if (!parentCause) {
      throw new Error(`Unable to add cause: parent cause ${parentId} not found`);
    }

    const newCause: Cause = {
      id: Math.floor(Math.random() * 10000000) + 1, // TODO make UUID
      name: causeName,
      notes: notes,
      causes: [],
    };

    parentCause.causes = [...parentCause.causes, newCause];

    const response = await diagramAPI.updateDiagram(updatedDiagram);
    return response.data;
  }
);

export const updateCause = createAsyncThunk(
  "diagram/updateCause",
  async ({causeId, causeName, notes}: {causeId: number, causeName: string, notes?: string}, thunkAPI) => {
    const updatedDiagram: Diagram = getCurrentDiagram(thunkAPI);

    // Update diagram before sending to server
    const cause = findCauseById(updatedDiagram.causes, causeId);

    if (!cause) {
      throw new Error(`Unable to update cause: cause ${causeId} not found`);
    }

    cause.name = causeName;
    cause.notes = notes;

    const response = await diagramAPI.updateDiagram(updatedDiagram);
    return response.data;
  }
);

export const deleteCause = createAsyncThunk(
  "diagram/deleteCause",
  async ({causeId}: {causeId: number}, thunkAPI) => {
    const updatedDiagram: Diagram = getCurrentDiagram(thunkAPI);

    const removeCause = (causes: Cause[]): Cause[] =>
      causes.filter((c) => {
        if (c.id === causeId) return false;
        if (c.causes) c.causes = removeCause(c.causes);
        return true;
      });

    updatedDiagram.causes = removeCause(updatedDiagram.causes);

    const response = await diagramAPI.updateDiagram(updatedDiagram);
    return response.data;
  }
);

export const addCauseCategory = createAsyncThunk(
  "diagram/addCauseCategory",
  async ({categoryName, notes}: {categoryName: string, notes?: string}, thunkAPI) => {
    const updatedDiagram: Diagram = getCurrentDiagram(thunkAPI);

    const newCauseCategory: Cause = {
      id: Math.floor(Math.random() * 10000000) + 1, // TODO make UUID
      name: categoryName,
      notes: notes,
      causes: [],
    };
    updatedDiagram.causes = [...updatedDiagram.causes, newCauseCategory];

    const response = await diagramAPI.updateDiagram(updatedDiagram);
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
  diagram: null
};

export const fishboneSlice = createSlice({
  name: "fishbone",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiagram.pending, (state) => {
        state.status = "pending";
        state.diagram = null; // Clear previous diagram data
        state.error = null;
      })
      .addCase(fetchDiagram.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.diagram = action.payload
      })
      .addCase(fetchDiagram.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to fetch diagram";
        state.diagram = null;
      })
      .addCase(addCause.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addCause.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.diagram = action.payload;
      })
      .addCase(addCause.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to add cause";
      })
      .addCase(updateCause.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateCause.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.diagram = action.payload;
      })
      .addCase(updateCause.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to update cause";
      })
      .addCase(addCauseCategory.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addCauseCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.diagram = action.payload;
      })
      .addCase(addCauseCategory.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to add cause category";
      })
      .addCase(deleteCause.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteCause.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.diagram = action.payload;
      })
      .addCase(deleteCause.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to delete cause";
      })
      .addCase(updateProblem.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.diagram = action.payload;
      })
      .addCase(updateProblem.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to update problem";
      });
  },
});

export default fishboneSlice.reducer;
