import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  GET_USER,
  GET_USER_FAIL,
  GET_USER_SUCCESS,
  INVITE,
  INVITE_FAIL,
  INVITE_SUCCESS,
  GET_ORGANIZATION,
  GET_ORGANIZATION_SUCCESS,
  GET_ORGANIZATION_FAILURE,
  GET_USER_OPTIONS,
  GET_USER_OPTIONS_SUCCESS,
  GET_USER_OPTIONS_FAILURE,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_CONFIRM,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAILURE,
  RESET_PASSWORD_CHECK,
  RESET_PASSWORD_CHECK_SUCCESS,
  RESET_PASSWORD_CHECK_FAILURE,
  GET_ORGANIZATION_OPTIONS_SUCCESS,
  GET_ORGANIZATION_OPTIONS_FAILURE,
  UPDATE_ORGANIZATION,
  UPDATE_ORGANIZATION_SUCCESS,
  UPDATE_ORGANIZATION_FAILURE,
} from '@redux/authuser/actions/authuser.actions';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
  organizationData: null,
  userOptions: null,
  orgOptions: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case REGISTER:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
        error: null,
      };

    case REGISTER_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_USER:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
      };

    case UPDATE_USER_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_USER:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
      };

    case GET_USER_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case INVITE:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: null,
        error: null,
      };

    case INVITE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        data: action.user,
      };

    case INVITE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: null,
        error: action.error,
      };

    case GET_ORGANIZATION:
      return {
        ...state,
        loading: true,
        loaded: false,
        organizationData: null,
        error: null,
      };

    case GET_ORGANIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        organizationData: (action.data && action.data.data) || null,
        error: null,
      };

    case GET_ORGANIZATION_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        organizationData: null,
        error: action.error,
      };

    case GET_USER_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        userOptions: null,
        error: null,
      };

    case GET_USER_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        userOptions: action.data,
        error: null,
      };

    case GET_USER_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        userOptions: null,
        error: action.error,
      };

    case RESET_PASSWORD:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      };

    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case RESET_PASSWORD_CONFIRM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case RESET_PASSWORD_CONFIRM_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      };

    case RESET_PASSWORD_CONFIRM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case RESET_PASSWORD_CHECK:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case RESET_PASSWORD_CHECK_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        resetPasswordCheckData: action.data,
      };

    case RESET_PASSWORD_CHECK_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_ORGANIZATION_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        orgOptions: action.data,
        error: null,
      };

    case GET_ORGANIZATION_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        orgOptions: null,
        error: action.error,
      };

    case UPDATE_ORGANIZATION:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_ORGANIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
        organizationData: (action.org && action.org.data) || null,
      };

    case UPDATE_ORGANIZATION_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    default:
      return state;
  }
};