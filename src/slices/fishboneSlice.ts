import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Cause {
  id: number
  name: string
  causes?: Cause[]
}

export interface FishboneState {
  problem: string
  causes?: Cause[]
}

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
  problem: "The problem",
  causes: [
    {
      id: 1,
      name: "Cause 1",
      causes: [
        {
          id: 2,
          name: "Cause 1.1",
          causes: [
            {
              id: 3,
              name: "Cause 1.1.1",
            },
          ],
        },
        {
          id: 4,
          name: "Cause 1.2",
        },
      ],
    },
    {
      id: 5,
      name: "Cause 2",
      causes: [
        {
          id: 6,
          name: "Cause 2.1",
        },
        {
          id: 7,
          name: "Cause 2.2",
        },
      ]
    }
  ],
}

export const fishboneSlice = createSlice({
  name: "fishbone",
  initialState,
  reducers: {
    updateProblem: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
      state.problem = "foo"
    },
    updateCauseName: (state, action: PayloadAction<Cause>) => {
      if (state.causes) {
      const cause = findCauseById(state.causes, action.payload.id)
        if (cause) {
          cause.name = action.payload.name
        }
      }
    }
  },
})

export const { updateProblem, updateCauseName } = fishboneSlice.actions

export default fishboneSlice.reducer