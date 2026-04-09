import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'NEXT':
      return { ...state, step: Math.min(state.step + 1, state.total - 1) };
    case 'BACK':
      return { ...state, step: Math.max(state.step - 1, 0) };
    case 'GO_TO':
      return { ...state, step: Math.max(0, Math.min(action.step, state.total - 1)) };
    case 'SET_DATA':
      return { ...state, data: { ...state.data, ...action.data } };
    default:
      return state;
  }
}

export function useFlowStepper(totalSteps, initialData = {}) {
  const [state, dispatch] = useReducer(reducer, {
    step: 0,
    total: totalSteps,
    data: initialData,
  });

  return {
    step: state.step,
    total: state.total,
    data: state.data,
    isFirst: state.step === 0,
    isLast: state.step === totalSteps - 1,
    next: () => dispatch({ type: 'NEXT' }),
    back: () => dispatch({ type: 'BACK' }),
    goTo: (step) => dispatch({ type: 'GO_TO', step }),
    setData: (data) => dispatch({ type: 'SET_DATA', data }),
  };
}
