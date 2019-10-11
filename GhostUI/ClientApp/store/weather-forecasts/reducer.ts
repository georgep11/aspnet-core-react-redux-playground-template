﻿import { FunctionReturnTypes, ReduxAction } from '../';
import { actionCreators } from './actions';
import { ActionType, IWeatherForecastsState } from './types';

const initialState = (): IWeatherForecastsState => {
    return {
        forecasts: [],
        isLoading: false,
    };
};

export const reducer = (state: IWeatherForecastsState = initialState(), incomingAction: FunctionReturnTypes<typeof actionCreators>) => {
    const action = incomingAction as ReduxAction;

    if (!action.type.startsWith(ActionType.NAMESPACE)) {
        return state;
    }

    switch (action.type) {
        case ActionType.REQUEST:
            const { startDateIndex } = action;
            return {
                ...state,
                startDateIndex,
                isLoading: true,
            };
        case ActionType.RECEIVE:
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                const { forecasts, startDateIndex } = action;
                return {
                    forecasts,
                    startDateIndex,
                    isLoading: false
                };
            }
            return state;
        default:
            return state;
    }
};