import { ACTION_TYPES } from '../constants';

export interface ActionType {
  type: 'ADD_KEY_COMMAND';
  payload: string | string[];
}

export interface ReducerState {
  keyCommands: string[];
}

export const initialState = {
  keyCommands: [],
};

const keyCommandsReducer = (
  state: ReducerState = initialState,
  action: ActionType
): ReducerState => {
  const keyCommand = action.payload;

  switch (action.type) {
    case ACTION_TYPES.ADD_KEY_COMMAND:
      return {
        ...state,
        keyCommands: Array.isArray(keyCommand) ? Array.from(new Set([...state.keyCommands, ...keyCommand.map(key => key.toLowerCase())])) : Array.from(new Set([...state.keyCommands, keyCommand.toLowerCase()])),
      };
    default:
      return state;
  }
};

export default keyCommandsReducer;
