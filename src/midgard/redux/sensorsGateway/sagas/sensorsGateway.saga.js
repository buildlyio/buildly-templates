import { put, takeLatest, all, call } from "redux-saga/effects";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environments/environment";
import { showAlert } from "../../alert/actions/alert.actions";
import {
  GET_GATEWAYS,
  GATEWAY_SEARCH_SUCCESS,
  GATEWAY_SEARCH,
  GET_GATEWAYS_TYPE,
  ADD_GATEWAY,
  DELETE_GATEWAY,
  EDIT_GATEWAY,
  GET_GATEWAYS_SUCCESS,
  GET_GATEWAYS_FAILURE,
  GET_GATEWAYS_TYPE_SUCCESS,
  GET_GATEWAYS_TYPE_FAILURE,
  getGateways,
  DELETE_GATEWAY_FAILURE,
  EDIT_GATEWAY_SUCCESS,
  EDIT_GATEWAY_FAILURE,
  ADD_GATEWAY_FAILURE,
  GET_SENSORS,
  SENSOR_SEARCH,
  GET_SENSORS_TYPE,
  GET_SENSORS_REPORT,
  Add_SENSOR,
  DELETE_SENSOR,
  EDIT_SENSOR,
  GET_SENSORS_SUCCESS,
  GET_SENSORS_FAILURE,
  getSensors,
  GET_SENSORS_TYPE_SUCCESS,
  GET_SENSORS_TYPE_FAILURE,
  GET_SENSORS_REPORT_SUCCESS,
  GET_SENSORS_REPORT_FAILURE,
  DELETE_SENSOR_FAILURE,
  EDIT_SENSOR_SUCCESS,
  EDIT_SENSOR_FAILURE,
  Add_SENSOR_FAILURE,
  SENSOR_SEARCH_SUCCESS,
  ADD_GATEWAYS_TYPE,
  ADD_GATEWAYS_TYPE_SUCCESS,
  ADD_GATEWAYS_TYPE_FAILURE,
  EDIT_GATEWAYS_TYPE,
  EDIT_GATEWAYS_TYPE_SUCCESS,
  EDIT_GATEWAYS_TYPE_FAILURE,
  DELETE_GATEWAYS_TYPE,
  DELETE_GATEWAYS_TYPE_SUCCESS,
  DELETE_GATEWAYS_TYPE_FAILURE,
  ADD_SENSORS_TYPE,
  ADD_SENSORS_TYPE_SUCCESS,
  ADD_SENSORS_TYPE_FAILURE,
  EDIT_SENSORS_TYPE,
  EDIT_SENSORS_TYPE_SUCCESS,
  EDIT_SENSORS_TYPE_FAILURE,
  DELETE_SENSORS_TYPE,
  DELETE_SENSORS_TYPE_SUCCESS,
  DELETE_SENSORS_TYPE_FAILURE,
} from "../actions/sensorsGateway.actions";
import { searchFilter } from "../../../utils/utilMethods";

const sensorApiEndPoint = "sensors/";

function* getGatewayList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${sensorApiEndPoint}gateway/?organization_uuid=${payload.organization_uuid}`,
      null,
      true
    );
    yield [yield put({ type: GET_GATEWAYS_SUCCESS, data: data.data })];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_GATEWAYS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* getGatewayTypeList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${sensorApiEndPoint}gateway_type/`,
      null,
      true
    );
    yield [
      yield put({
        type: GET_GATEWAYS_TYPE_SUCCESS,
        data: data.data,
      }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_GATEWAYS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteGatewayItem(payload) {
  let { gatewayId, organization_uuid } = payload;
  try {
    yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${sensorApiEndPoint}gateway/${gatewayId}/`,
      null,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Gateway deleted successfully!",
        })
      ),
      yield put(getGateways(organization_uuid)),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in deleting Gateway!",
        })
      ),
      yield put({
        type: DELETE_GATEWAY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editGateWayItem(action) {
  let { payload, history, redirectTo } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${sensorApiEndPoint}gateway/${payload.id}/`,
      payload,
      true
    );
    yield [
      yield put(getGateways(payload.organization_uuid)),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Gateway successfully Edited!",
        })
      ),
      yield call(history.push, redirectTo),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't edit Gateway due to some error!",
        })
      ),
      yield put({
        type: EDIT_GATEWAY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addGateway(action) {
  let { history, payload, redirectTo } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${sensorApiEndPoint}gateway/`,
      payload,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Added Gateway",
        })
      ),
      yield put(getGateways(payload.organization_uuid)),
      yield call(history.push, redirectTo),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in creating Gateway",
        })
      ),
      yield put({
        type: ADD_GATEWAY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* searchGateway(payload) {
  try {
    let filteredData = searchFilter(payload);
    yield put({ type: GATEWAY_SEARCH_SUCCESS, data: filteredData });
  } catch (error) {
    // yield put({ type: UPDATE_USER_FAIL, error: "Updating user fields failed" });
  }
}

function* getSensorList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${sensorApiEndPoint}sensor/?organization_uuid=${payload.organization_uuid}`,
      null,
      true
    );
    yield [yield put({ type: GET_SENSORS_SUCCESS, data: data.data })];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_SENSORS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* getSensorTypeList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${sensorApiEndPoint}sensor_type/`,
      null,
      true
    );
    yield [
      yield put({
        type: GET_SENSORS_TYPE_SUCCESS,
        data: data.data,
      }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_SENSORS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* getSensorReportList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${sensorApiEndPoint}aggregate_report/`, // aggregate_report
      null,
      true
    );
    yield [yield put({ type: GET_SENSORS_REPORT_SUCCESS, data: data.data })];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_SENSORS_REPORT_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteSensorItem(payload) {
  let { sensorId, organization_uuid } = payload;
  try {
    yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${sensorApiEndPoint}sensor/${sensorId}/`,
      null,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Sensor deleted successfully!",
        })
      ),
      yield put(getSensors(organization_uuid)),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in deleting Gateway!",
        })
      ),
      yield put({
        type: DELETE_SENSOR_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editSensorItem(action) {
  let { payload, history, redirectTo } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${sensorApiEndPoint}sensor/${payload.id}/`,
      payload,
      true
    );
    yield [
      yield put(getSensors(payload.organization_uuid)),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Sensor successfully Edited!",
        })
      ),
      yield call(history.push, redirectTo),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't edit Gateway due to some error!",
        })
      ),
      yield put({
        type: EDIT_SENSOR_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addSensor(action) {
  let { history, payload, redirectTo } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${sensorApiEndPoint}sensor/`,
      payload,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Added Sensor",
        })
      ),
      yield put(getSensors(payload.organization_uuid)),
      yield call(history.push, redirectTo),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in creating Gateway",
        })
      ),
      yield put({
        type: Add_SENSOR_FAILURE,
        error: error,
      }),
    ];
  }
}

function* searchSensors(payload) {
  try {
    let filteredData = searchFilter(payload);
    yield put({ type: SENSOR_SEARCH_SUCCESS, data: filteredData });
  } catch (error) {
    // yield put({ type: UPDATE_USER_FAIL, error: "Updating user fields failed" });
  }
}

function* addGatewayType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${sensorApiEndPoint}gateway_type/`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({
          type: ADD_GATEWAYS_TYPE_SUCCESS,
          gatewayType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Added Gateway Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Add Gateway Type due to some error!",
        })
      ),
      yield put({
        type: ADD_GATEWAYS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editGatewayType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${sensorApiEndPoint}gateway_type/${payload.id}`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({
          type: EDIT_GATEWAYS_TYPE_SUCCESS,
          gatewayType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Edited Gateway Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Edit Gateway Type due to some error!",
        })
      ),
      yield put({
        type: EDIT_GATEWAYS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteGatewayType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${sensorApiEndPoint}gateway_type/${payload.id}`,
      null,
      true
    );
    yield [
      yield put({
        type: DELETE_GATEWAYS_TYPE_SUCCESS,
        gatewayType: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Deleted Gateway Type",
        })
      ),
    ];
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Delete Gateway Type due to some error!",
        })
      ),
      yield put({
        type: DELETE_GATEWAYS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addSensorType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${sensorApiEndPoint}sensor_type/`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({
          type: ADD_SENSORS_TYPE_SUCCESS,
          sensorType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Added Sensor Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Add Sensor Type due to some error!",
        })
      ),
      yield put({
        type: ADD_SENSORS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editSensorType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${sensorApiEndPoint}sensor_type/${payload.id}`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({
          type: EDIT_SENSORS_TYPE_SUCCESS,
          sensorType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Edited Sensor Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Edit Sensor Type due to some error!",
        })
      ),
      yield put({
        type: EDIT_SENSORS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteSensorType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${sensorApiEndPoint}sensor_type/${payload.id}`,
      null,
      true
    );
    yield [
      yield put({
        type: DELETE_SENSORS_TYPE_SUCCESS,
        sensorType: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Deleted Sensor Type",
        })
      ),
    ];
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Delete Sensor Type due to some error!",
        })
      ),
      yield put({
        type: DELETE_SENSORS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* watchGetGateway() {
  yield takeLatest(GET_GATEWAYS, getGatewayList);
}

function* watchGatewaySearch() {
  yield takeLatest(GATEWAY_SEARCH, searchGateway);
}

function* watchGetGatewayType() {
  yield takeLatest(GET_GATEWAYS_TYPE, getGatewayTypeList);
}

function* watchAddGateway() {
  yield takeLatest(ADD_GATEWAY, addGateway);
}

function* watchDeleteGateway() {
  yield takeLatest(DELETE_GATEWAY, deleteGatewayItem);
}

function* watchEditGateway() {
  yield takeLatest(EDIT_GATEWAY, editGateWayItem);
}

function* watchGetSensor() {
  yield takeLatest(GET_SENSORS, getSensorList);
}

function* watchSensorSearch() {
  yield takeLatest(SENSOR_SEARCH, searchSensors);
}

function* watchGetSensorType() {
  yield takeLatest(GET_SENSORS_TYPE, getSensorTypeList);
}

function* watchGetSensorReport() {
  yield takeLatest(GET_SENSORS_REPORT, getSensorReportList);
}

function* watchAddSensor() {
  yield takeLatest(Add_SENSOR, addSensor);
}

function* watchDeleteSensor() {
  yield takeLatest(DELETE_SENSOR, deleteSensorItem);
}

function* watchEditSensor() {
  yield takeLatest(EDIT_SENSOR, editSensorItem);
}

function* watchAddGatewayType() {
  yield takeLatest(ADD_GATEWAYS_TYPE, addGatewayType);
}

function* watchEditGatewayType() {
  yield takeLatest(EDIT_GATEWAYS_TYPE, editGatewayType);
}

function* watchDeleteGatewayType() {
  yield takeLatest(DELETE_GATEWAYS_TYPE, deleteGatewayType);
}

function* watchAddSensorType() {
  yield takeLatest(ADD_SENSORS_TYPE, addSensorType);
}

function* watchEditSensorType() {
  yield takeLatest(EDIT_SENSORS_TYPE, editSensorType);
}

function* watchDeleteSensorType() {
  yield takeLatest(DELETE_SENSORS_TYPE, deleteSensorType);
}

export default function* sensorsGatewaySaga() {
  yield all([
    watchGatewaySearch(),
    watchGetGateway(),
    watchGetGatewayType(),
    watchAddGateway(),
    watchDeleteGateway(),
    watchEditGateway(),
    watchGetSensor(),
    watchGetSensorType(),
    watchGetSensorReport(),
    watchAddSensor(),
    watchEditSensor(),
    watchDeleteSensor(),
    watchSensorSearch(),
    watchAddGatewayType(),
    watchEditGatewayType(),
    watchDeleteGatewayType(),
    watchAddSensorType(),
    watchEditSensorType(),
    watchDeleteSensorType(),
  ]);
}