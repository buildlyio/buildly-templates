import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { MapComponent } from "../../components/MapComponent/MapComponent";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import {
  SHIPMENT_COLUMNS,
  getFormattedRow,
  svgIcon,
  MAP_TOOLTIP,
  SHIPMENT_LIST_TOOLTIP
} from "./ShipmentConstants";
import ShipmentList from "./components/ShipmentList";
import { routes } from "../../routes/routesConstants";
import { Route } from "react-router-dom";
import AddShipment from "./forms/AddShipment";
import AddOriginInfo from "./forms/AddOriginInfo";
import AddShipperInfo from "./forms/AddShipperInfo";
import AddDestinationInfo from "./forms/AddDestinationInfo";
import {
  getCustodians,
  getCustodianType,
  getContact,
  getCustody,
  GET_CUSTODY_OPTIONS_SUCCESS,
  GET_CUSTODY_OPTIONS_FAILURE,
} from "midgard/redux/custodian/actions/custodian.actions";
import {
  getItems,
  getItemType,
  getUnitsOfMeasure,
} from "midgard/redux/items/actions/items.actions";
import {
  getGateways,
  getGatewayType,
  getSensors,
  getSensorType,
  getSensorReport,
} from "midgard/redux/sensorsGateway/actions/sensorsGateway.actions";
import { MAP_API_URL, convertUnitsOfMeasure } from "midgard/utils/utilMethods";
import {
  getShipmentDetails,
  deleteShipment,
  FILTER_SHIPMENT_SUCCESS,
  GET_SHIPMENT_OPTIONS_SUCCESS,
  GET_SHIPMENT_OPTIONS_FAILURE,
} from "midgard/redux/shipment/actions/shipment.actions";
import ConfirmModal from "midgard/components/Modal/ConfirmModal";
import AlertInfo from "./AlertInfo";
import Loader from "midgard/components/Loader/Loader";
import CustomizedTooltips from "midgard/components/ToolTip/ToolTip";
import { httpService } from "midgard/modules/http/http.service";
import { environment } from "environments/environment";
import { UserContext } from "midgard/context/User.context";
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
    marginBottom: "0.5em",
  },
  tileHeading: {
    flex: 1,
    padding: theme.spacing(1, 2),
    textTransform: "uppercase",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
  },
  addButton: {
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(2),
    },
  },
  switchViewSection: {
    background: "#383636",
    width: "100%",
    display: "flex",
    minHeight: "40px",
    alignItems: "center",
  },
  menuButton: {
    marginLeft: "auto",
  },
}));

function Shipment(props) {
  const {
    shipmentData,
    history,
    custodianData,
    dispatch,
    itemData,
    gatewayData,
    shipmentFlag,
    unitsOfMeasure,
    filteredData,
    custodyData,
    sensorData,
    sensorReportData,
    loading,
    shipmentOptions,
    custodyOptions,
  } = props;
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [mapShipmentFilter, setMapShipmentFilter] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [tileView, setTileView] = useState(true);
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (shipmentData === null) {
      dispatch(getShipmentDetails(organization));
    }
    // if (!shipmentFlag) {
    //   dispatch(getShipmentFlag());
    // }
    if (custodianData === null) {
      dispatch(getCustodians(organization));
      dispatch(getCustodianType());
      dispatch(getContact(organization));
    }
    if (itemData === null) {
      dispatch(getItems(organization));
      dispatch(getItemType(organization));
    }
    if (gatewayData === null) {
      dispatch(getGateways(organization));
      dispatch(getGatewayType());
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
    if (!custodyData) {
      dispatch(getCustody());
    }
    if (!sensorData) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
    if (!sensorReportData) {
      dispatch(getSensorReport());
    }
    if (shipmentOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}shipment/shipment/`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_SHIPMENT_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_SHIPMENT_OPTIONS_FAILURE, error: err });
        });
    }

    if (custodyOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}custodian/custody/`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_CUSTODY_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_CUSTODY_OPTIONS_FAILURE, error: err });
        });
    }

    return function cleanup() {
      dispatch({ type: FILTER_SHIPMENT_SUCCESS, data: undefined });
    };
  }, []);

  const returnIcon = (row) => {
    let flagType = "";
    let flag = "";
    let shipmentFlags = row.flag_list;
    if (shipmentFlags && shipmentFlags.length) {
      flagType = shipmentFlags[0].type;
      flag = shipmentFlags[0].name;
    }
    return svgIcon(flagType, flag);
  };

  useEffect(() => {
    if (
      shipmentData &&
      custodianData &&
      custodyData &&
      itemData &&
      sensorReportData &&
      shipmentFlag
    ) {
      let routesInfo = [];
      let formattedRows = getFormattedRow(
        shipmentData,
        custodianData,
        itemData,
        shipmentFlag,
        custodyData,
        sensorReportData
      );
      formattedRows.forEach((row) => {
        if (row.custody_info && row.custody_info.length > 0) {
          row.custody_info.forEach((custody) => {
            if (
              (custody.has_current_custody || custody.first_custody) &&
              (row.status.toLowerCase() === "planned" ||
                row.status.toLowerCase() === "enroute")
            ) {
              if (custody.start_of_custody_location) {
                routesInfo.push({
                  lat:
                    custody.start_of_custody_location &&
                    parseFloat(custody.start_of_custody_location.split(",")[0]),
                  lng:
                    custody.start_of_custody_location &&
                    parseFloat(custody.start_of_custody_location.split(",")[1]),
                  label: `${row.name}:${row.shipment_uuid}(Start Location)`,
                  icon: returnIcon(row),
                });
              }
              if (custody.end_of_custody_location) {
                routesInfo.push({
                  lat:
                    custody.end_of_custody_location &&
                    parseFloat(custody.end_of_custody_location.split(",")[0]),
                  lng:
                    custody.end_of_custody_location &&
                    parseFloat(custody.end_of_custody_location.split(",")[1]),
                  label: `${row.name}:${row.shipment_uuid}(End Location)`,
                  icon: returnIcon(row),
                });
              }
            }
          });
        }
        // if (row.sensor_report && row.sensor_report.length > 0) {
        //   row.sensor_report.forEach((report) => {
        //     if (report.report_location != null && Array.isArray(report.report_location)) {
        //       try {
        //         // data uses single quotes which throws an error
        //         const parsedLocation = JSON.parse(report.report_location[0].replaceAll(`'`, `"`));
        //         // console.log('Lat Long: ', parsedLocation);
        //       } catch(e) {
        //         console.log(e);
        //       }
        //     }
        //   });
        // }
      });
      // setMarkers(routesInfo);
      setRows(formattedRows);
      setFilteredRows(formattedRows);
      if (!mapShipmentFilter && formattedRows.length) {
        setMapShipmentFilter(formattedRows[0])
      }
    }
  }, [shipmentData, custodianData, itemData, shipmentFlag, custodyData, sensorReportData]);

  useEffect(() => {
    if (filteredData && filteredData.length >= 0) {
      setFilteredRows(filteredData);
    }
  }, [filteredData]);

  useEffect(() => {
    if (mapShipmentFilter) {
      let markersToSet = [];
      let temperatureUnit = unitsOfMeasure.filter((obj) => {
        return obj.supported_class === "Temperature";
      })[0]["name"].toLowerCase()
      let tempConst = temperatureUnit[0].toUpperCase()
      mapShipmentFilter.sensor_report.forEach((report) => {
        if (report.report_location != null && Array.isArray(report.report_location)) {
          try {
            // data uses single quotes which throws an error
            const parsedLocation = JSON.parse(report.report_location[0].replaceAll(`'`, `"`));
            const temperature = convertUnitsOfMeasure('celsius',report.report_temp,temperatureUnit,'temperature');  // Data in ICLP is coming in Celsius, conversion to selected unit
            const humidity = report.report_humidity;
            const marker = {
              lat: parsedLocation && parsedLocation.latitude,
              lng: parsedLocation && parsedLocation.longitude,
              label: parsedLocation && `Temperature: ${temperature}\u00b0${tempConst}, Humidity: ${humidity}% recorded at ${moment(parsedLocation.timeOfPosition).format('llll')}`,
              icon: returnIcon(mapShipmentFilter),
              temp: temperature,
              humidity: humidity
            }
            // Skip a marker on map only if temperature, humidity and lat long are all same.
            // Considered use case: If a shipment stays at some position for long, temperature and humidity changes can be critical
            const markerFound = markersToSet.some(pointer => (pointer.temperature === marker.temperature &&
              pointer.humidity === marker.humidity && pointer.lat === marker.lat && pointer.lng === marker.lng))
            if (!markerFound) {
              markersToSet.push(marker);
            }

          } catch(e) {
            console.log(e);
          }
        }
      });
      setMarkers(markersToSet);
    }
  }, [mapShipmentFilter]);

  const onAddButtonClick = () => {
    history.push(`${routes.SHIPMENT}/add`, {
      from: routes.SHIPMENT,
    });
  };

  const handleEdit = (item) => {
    // dispatch(saveShipmentFormData(item));
    history.push(`${routes.SHIPMENT}/edit/:${item.id}`, {
      type: "edit",
      data: item,
      from: routes.SHIPMENT,
    });
  };
  const handleDelete = (item) => {
    setDeleteItemId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteShipment(deleteItemId, organization));
    setConfirmModal(false);
  };

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <AlertInfo {...props} />
      <Box mb={3} mt={2}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.addButton}
          onClick={onAddButtonClick}
        >
          <AddIcon /> {"Add Shipment"}
        </Button>
      </Box>
      <Typography className={classes.dashboardHeading} variant={"h4"}>
        Shipments
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <CustomizedTooltips toolTipText={SHIPMENT_LIST_TOOLTIP} />
            <Hidden smDown>
              <IconButton
                className={classes.menuButton}
                onClick={() => setTileView(!tileView)}
                color="default"
                aria-label="menu"
              >
                {!tileView ? <ViewCompactIcon /> : <ViewComfyIcon />}
              </IconButton>
            </Hidden>
          </div>
          <ShipmentList
            rows={rows}
            filteredRows={filteredRows}
            columns={SHIPMENT_COLUMNS}
            hasSearch={true}
            searchValue={""}
            dispatch={dispatch}
            editAction={handleEdit}
            deleteAction={handleDelete}
            hasSort={true}
            mapShipmentFilter={mapShipmentFilter}
            setMapShipmentFilter={setMapShipmentFilter}
          />
        </Grid>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            {
              mapShipmentFilter
              ? (
                <Typography
                  className={classes.tileHeading}
                  variant="h5">
                  {mapShipmentFilter.name}
                  <CustomizedTooltips toolTipText={MAP_TOOLTIP} />
                </Typography>
              )
              : (<CustomizedTooltips toolTipText={MAP_TOOLTIP} />)
            }
            <Hidden smDown>
              <IconButton
                className={classes.menuButton}
                onClick={() => setTileView(!tileView)}
                color="default"
                aria-label="menu"
              >
                {!tileView ? <ViewCompactIcon /> : <ViewComfyIcon />}
              </IconButton>
            </Hidden>
          </div>
          <MapComponent
            isMarkerShown
            markers={markers}
            googleMapURL={MAP_API_URL}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `550px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Grid>
      </Grid>
      <Route path={`${routes.SHIPMENT}/add`} component={AddShipment} />
      <Route path={`${routes.SHIPMENT}/add/origin`} component={AddOriginInfo} />
      <Route
        path={`${routes.SHIPMENT}/add/shipper`}
        component={AddShipperInfo}
      />
      <Route
        path={`${routes.SHIPMENT}/add/destination`}
        component={AddDestinationInfo}
      />
      <Route path={`${routes.SHIPMENT}/edit/:id`} component={AddShipment} />
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title={"Are You sure you want to Delete this Shipment?"}
        submitText={"Delete"}
      />
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.custodianReducer,
  ...state.itemsReducer,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(Shipment);
