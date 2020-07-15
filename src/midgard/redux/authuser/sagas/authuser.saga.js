import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  INVITE,
  INVITE_FAIL,
  INVITE_SUCCESS,
  GET_USER_SUCCESS,
  GET_USER,
  GET_USER_FAIL,
  GET_ORGANIZATION,
  GET_ORGANIZATION_FAILURE,
  GET_ORGANIZATION_SUCCESS,
  getOrganization,
  RESET_PASSWORD,
  RESET_PASSWORD_CONFIRM,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAILURE,
  RESET_PASSWORD_CHECK,
  RESET_PASSWORD_CHECK_SUCCESS,
  RESET_PASSWORD_CHECK_FAILURE,
} from "../actions/authuser.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { oauthService } from "../../../modules/oauth/oauth.service";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environment";
import { showAlert } from "../../alert/actions/alert.actions";
import { routes } from "../../../routes/routesConstants";

function* logout() {
  try {
    yield call(oauthService.logout);
    yield [yield put({ type: LOGOUT_SUCCESS })];
  } catch (error) {
    console.log("error", error);
    yield put({ type: LOGOUT_FAIL });
  }
}

function* login(payload) {
  let { history } = payload;
  try {
    const token = yield call(
      oauthService.authenticateWithPasswordFlow,
      payload.credentials
    );
    yield call(oauthService.setAccessToken, token.data);
    const user = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}coreuser/me/`
    );
    yield call(oauthService.setOauthUser, user, payload);
    const coreUser = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}coreuser/`
    );
    yield call(oauthService.setCurrentCoreUser, coreUser, user);
    yield [
      // yield put({ type: LOGIN_SUCCESS, user }),
      yield call(history.push, routes.DASHBOARD),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put({ type: LOGIN_FAIL, error: "Invalid credentials given" }),
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Login Failed!",
        })
      ),
    ];
  }
}

function* getUserDetails() {
  try {
    const user = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}coreuser/me/`
    );
    yield put({ type: GET_USER_SUCCESS, user });
    if (user && user.data && user.data.organization) {
      yield put(getOrganization(user.data.organization.organization_uuid));
    }
  } catch (error) {
    yield [
      yield put({ type: GET_USER_FAIL, error: "Error in loading user data" }),
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in loading user data",
        })
      ),
    ];
  }
}

function* register(payload) {
  let { history } = payload;
  try {
    const user = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/`,
      payload.data
    );
    yield [
      yield put({ type: REGISTER_SUCCESS, user }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Registered",
        })
      ),
      yield call(history.push, routes.LOGIN),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Registration Failed!",
        })
      ),
      yield put({ type: REGISTER_FAIL, error: "Registration failed" }),
    ];
  }
}

function* invite(payload) {
  try {
    const user = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/invite/`,
      payload.data
    );
    yield [yield put({ type: INVITE_SUCCESS, user })];
  } catch (error) {
    yield put({
      type: INVITE_FAIL,
      error: "One or more email address is invalid",
    });
  }
}

function* updateUser(payload) {
  try {
    const user = yield call(
      httpService.makeRequest,
      "patch",
      `${environment.API_URL}coreuser/${payload.data.id}/`,
      payload.data
    );
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}organization/${payload.data.organization_uuid}/`,
      { name: payload.data.organization_name }
    );
    yield [
      yield put({ type: UPDATE_USER_SUCCESS, user }),
      yield put({ type: GET_ORGANIZATION_SUCCESS, data }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Account Details successfully updated!",
        })
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Failed to update Details",
        })
      ),
      yield put({
        type: UPDATE_USER_FAIL,
        error: "Updating user fields failed",
      }),
    ];
  }
}

function* getOrganizationData(payload) {
  let { uuid } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}organization/${uuid}/`,
      null,
      true
    );
    yield put({ type: GET_ORGANIZATION_SUCCESS, data });
  } catch (error) {
    yield put({ type: GET_ORGANIZATION_FAILURE, error });
  }
}

function* resetPassword(payload) {
  let { history } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/reset_password/`,
      payload.data
    );
    console.log("data", data);
    if (data.data && data.data.count > 0) {
      yield [
        yield put({ type: RESET_PASSWORD_SUCCESS, data: data.data }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: data.data.detail,
          })
        ),
        // yield call(history.push, routes.LOGIN),
      ];
    } else {
      yield [
        yield put(
          showAlert({
            type: "error",
            open: true,
            message: "Email does not exist. Please enter a vaild email.",
          })
        ),
        yield put({
          type: RESET_PASSWORD_FAILURE,
          error: "Email does not exist. Please enter a vaild email.",
        }),
      ];
    }
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Email not sent due to some error!",
        })
      ),
      yield put({
        type: RESET_PASSWORD_FAILURE,
        error: "Email not sent due to some error!",
      }),
    ];
  }
}

function* resetPasswordConfirm(payload) {
  let { history } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/reset_password_confirm/`,
      payload.data
    );
    console.log("data", data);
    yield [
      yield put({ type: RESET_PASSWORD_CONFIRM_SUCCESS, data: data.data }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: data.data.detail,
        })
      ),
      yield call(history.push, routes.LOGIN),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Password Rest Failed",
        })
      ),
      yield put({
        type: RESET_PASSWORD_CONFIRM_FAILURE,
        error: "Password Rest Failed",
      }),
    ];
  }
}

function* resetPasswordCheck(payload) {
  let { history } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/reset_password_check/`,
      payload.data
    );
    if (data.data && data.data.success) {
      yield [
        yield put({ type: RESET_PASSWORD_CHECK_SUCCESS, data: data.data }),
        yield call(history.push, routes.RESET_PASSWORD_CONFIRM),
      ];
    } else {
      yield [
        yield put(
          showAlert({
            type: "error",
            open: true,
            message: "Not Valid UID or Token.Try sending mail again",
          })
        ),
        yield put({
          type: RESET_PASSWORD_CHECK_FAILURE,
          error: "Not Valid UID or Token.Try sending mail again",
        }),
        yield call(history.push, routes.LOGIN),
      ];
    }
    console.log("data", data);
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Password Rest Failed",
        })
      ),
      yield put({
        type: RESET_PASSWORD_CHECK_FAILURE,
        error: "Password Rest Failed",
      }),
    ];
  }
}

function* watchResetPasswordCheck() {
  yield takeLatest(RESET_PASSWORD_CHECK, resetPasswordCheck);
}

function* watchResetPassword() {
  yield takeLatest(RESET_PASSWORD, resetPassword);
}

function* watchConfirmResetPassword() {
  yield takeLatest(RESET_PASSWORD_CONFIRM, resetPasswordConfirm);
}

function* watchLogout() {
  yield takeLatest(LOGOUT, logout);
}

function* watchLogin() {
  yield takeLatest(LOGIN, login);
}

function* watchRegister() {
  yield takeLatest(REGISTER, register);
}

function* watchUpdateUser() {
  yield takeLatest(UPDATE_USER, updateUser);
}

function* watchInvite() {
  yield takeLatest(INVITE, invite);
}

function* watchGetUser() {
  yield takeLatest(GET_USER, getUserDetails);
}

function* watchGetOrganization() {
  yield takeLatest(GET_ORGANIZATION, getOrganizationData);
}

export default function* authSaga() {
  yield all([
    watchLogin(),
    watchLogout(),
    watchRegister(),
    watchUpdateUser(),
    watchInvite(),
    watchGetUser(),
    watchGetOrganization(),
    watchResetPassword(),
    watchConfirmResetPassword(),
    watchResetPasswordCheck(),
  ]);
}
