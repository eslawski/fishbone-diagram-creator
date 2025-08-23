import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Cause {
  id: number
  name: string
  notes?: string
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
          notes: "This is a note for Cause 1.1",
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
    updateCause: (state, action: PayloadAction<{id: number, newName: string, newNotes: string}>) => {
      if (state.causes) {
      const cause = findCauseById(state.causes, action.payload.id)
        if (cause) {
          cause.name = action.payload.newName
          cause.notes = action.payload.newNotes
        }
      }
    },
    addCause: (state, action: PayloadAction<{parentId: number, newCauseName: string, notes?: string}>) => {
      if (state.causes) {
        const parent = findCauseById(state.causes, action.payload.parentId)

        if (parent) {
          const newCause: Cause = {
            id: Math.floor(Math.random() * 10000000) + 1, // Should be dictated by server
            name: action.payload.newCauseName,
          }
          parent.causes = [...parent.causes || [], newCause]
        }
      }
    },
    addCauseCategory: (state, action: PayloadAction<{newCauseCategoryName: string, notes?: string}>) => {
      const newCauseCategory: Cause = {
        id: Math.floor(Math.random() * 10000000) + 1, // Should be dictated by server
        name: action.payload.newCauseCategoryName,
        notes: action.payload.notes,
      }
      state.causes = [...state.causes || [], newCauseCategory]
    },
    deleteCause: (state, action: PayloadAction<{id: number}>) => {
      const removeCause = (causes: Cause[]): Cause[] =>
        causes.filter(c => {
          if (c.id === action.payload.id) return false
          if (c.causes) c.causes = removeCause(c.causes)
          return true
        })
    
      if (state.causes) {
        state.causes = removeCause(state.causes)
      }
    }
  }
})

export const { updateProblem, updateCause, addCause, deleteCause, addCauseCategory } = fishboneSlice.actions

export default fishboneSlice.reducer