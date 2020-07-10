import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import {
  Grid,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  MenuItem,
  CircularProgress,
  Checkbox,
} from "@material-ui/core";
import { MapComponent } from "../../../components/MapComponent/MapComponent";
import { routes } from "../../../routes/routesConstants";
import { MAP_API_URL, compareSort } from "../../../utils/utilMethods";
import { useInput } from "../../../hooks/useInput";
import { SHIPMENT_STATUS, TRANSPORT_MODE } from "../../../utils/mock";
import DatePickerComponent from "../../../components/DatePicker/DatePicker";
import { validators } from "../../../utils/validators";
import {
  editShipment,
  addShipment,
  saveShipmentFormData,
} from "../../../redux/shipment/actions/shipment.actions";
import ItemsInfo from "./ItemInfo";
import ShipmentRouteInfo from "./ShipmentRouteInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      width: "70%",
      margin: "auto",
    },
  },
  submit: {
    borderRadius: "18px",
    fontSize: 11,
  },
  cardItems: {
    marginTop: theme.spacing(4),
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: "center",
    justifyContent: "center",
  },
  alignRight: {
    marginLeft: "auto",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    // margin: theme.spacing(1),
    position: "relative",
  },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function ShipmentInfo(props) {
  const {
    handleNext,
    shipmentFormData,
    history,
    loading,
    dispatch,
    redirectTo,
    handleCancel,
    location,
    shipmentFlag,
    custodianData,
    custodyData,
    unitsOfMeasure,
  } = props;
  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  const editPage = location.state && location.state.type === "edit";
  const editData = location.state && location.state.data;
  const shipment_name = useInput((editData && editData.name) || "", {
    required: true,
  });
  const lading_bill = useInput((editData && editData.bol_order_id) || "");
  const load_no = useInput("");
  const shipment_status = useInput((editData && editData.status) || "");
  const route_desc = useInput((editData && editData.route_description) || "");
  const mode_type = useInput((editData && editData.transport_mode) || "");
  const route_dist = useInput("");
  const [scheduled_departure, handleDepartureDateChange] = useState(
    (editData && new Date(editData.estimated_time_of_departure)) || new Date()
  );
  const [scheduled_arrival, handleScheduledDateChange] = useState(
    (editData && new Date(editData.estimated_time_of_arrival)) || new Date()
  );
  const [flags, setFlags] = useState((editData && editData.flags) || []);
  const [uom_temp, setUomTemp] = useState(
    (editData && editData.uom_temp) || ""
  );
  const [uom_weight, setUomWeight] = useState(
    (editData && editData.uom_weight) || ""
  );
  const [uom_distance, setUomDistance] = useState(
    (editData && editData.uom_distance) || ""
  );
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (editPage && shipmentFormData === null) {
      dispatch(saveShipmentFormData(editData));
    }
  }, []);

  useEffect(() => {
    if (unitsOfMeasure && unitsOfMeasure.length) {
      unitsOfMeasure.forEach((unit) => {
        if (
          unit.supported_class.toLowerCase().includes("temp") &&
          unit.is_default_for_class
        ) {
          setUomTemp(unit.url);
        } else if (
          unit.supported_class.toLowerCase().includes("distance") &&
          unit.is_default_for_class
        ) {
          setUomDistance(unit.url);
        } else if (
          unit.supported_class.toLowerCase().includes("weight") &&
          unit.is_default_for_class
        ) {
          setUomWeight(unit.url);
        }
      });
    }
  }, [unitsOfMeasure]);

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input, parentId) => {
    let validateObj = validators(validation, input);
    let prevState = { ...formError };
    if (validateObj && validateObj.error)
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    else
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: "",
        },
      });
  };

  const submitDisabled = () => {
    let errorKeys = Object.keys(formError);
    let errorExists = false;
    if (!shipment_name.value || !flags.length) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    let shipmentFormValue = {
      name: shipment_name.value,
      status: shipment_status.value,
      bol_order_id: lading_bill.value,
      route_description: route_desc.value,
      transport_mode: mode_type.value,
      estimated_time_of_arrival: scheduled_arrival,
      estimated_time_of_departure: scheduled_departure,
      ...(editData && { id: editData.id }),
      items: (editData && editData.items) || [],
      gateway_ids: (editData && editData.gateway_ids) || [],
      sensor_report_ids: (editData && editData.sensor_report_ids) || [],
      wallet_ids: (editData && editData.wallet_ids) || [],
      custodian_ids: (editData && editData.custodian_ids) || [],
      flags: flags,
      uom_distance: uom_distance,
      uom_temp: uom_temp,
      uom_weight: uom_weight,
    };

    if (editPage && editData) {
      dispatch(
        editShipment(
          shipmentFormValue,
          history,
          `${routes.SHIPMENT}/edit/:${editData.id}`
        )
      );
    } else {
      dispatch(addShipment(shipmentFormValue, history));
    }
  };

  const onShipmentFlagChange = (value) => {
    let flagsUrl = [];
    if (value) {
      value.forEach((val) => {
        flagsUrl.push(val.url);
      });
    }
    setFlags(flagsUrl);
  };
  return (
    <React.Fragment>
      <div>
        {!isDesktop && (
          <Box mb={2}>
            <Typography variant="h4">Shipment Details(1/5)</Typography>
          </Box>
        )}
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="shipment_name"
                      label="Shipment Name"
                      name="shipment_name"
                      autoComplete="shipment_name"
                      error={
                        formError.shipment_name && formError.shipment_name.error
                      }
                      helperText={
                        formError.shipment_name
                          ? formError.shipment_name.message
                          : ""
                      }
                      onBlur={(e) => handleBlur(e, "required", shipment_name)}
                      {...shipment_name.bind}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="lading_bill"
                      label="Bill of Lading"
                      name="lading_bill"
                      autoComplete="lading_bill"
                      {...lading_bill.bind}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="mode_type"
                      select
                      label="Mode Type"
                      {...mode_type.bind}
                    >
                      <MenuItem value={""}>Select</MenuItem>
                      {TRANSPORT_MODE &&
                        TRANSPORT_MODE.sort(compareSort("value")).map(
                          (item, index) => (
                            <MenuItem key={`${item.value}`} value={item.value}>
                              {item.label}
                            </MenuItem>
                          )
                        )}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      multiline
                      rows={6}
                      id="route_desc"
                      label="Route Description"
                      name="route_desc"
                      autoComplete="route_desc"
                      {...route_desc.bind}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="uom_temp"
                      select
                      label="Units of Measure Temperature"
                      value={uom_temp}
                      onChange={(e) => setUomTemp(e.target.value)}
                    >
                      {unitsOfMeasure &&
                        unitsOfMeasure
                          .filter((obj) => {
                            return obj.supported_class === "Temperature";
                          })
                          .sort(compareSort("name"))
                          .map((item, index) => (
                            <MenuItem
                              key={`${item.id}${item.name}`}
                              value={item.url}
                            >
                              {item.name}
                            </MenuItem>
                          ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="shipment_status"
                      name="shipment_status"
                      select
                      label="Shipment Status"
                      {...shipment_status.bind}
                    >
                      <MenuItem value={""}>Select</MenuItem>
                      {SHIPMENT_STATUS &&
                        SHIPMENT_STATUS.sort(compareSort("value")).map(
                          (item, index) => (
                            <MenuItem key={`${item.value}`} value={item.value}>
                              {item.label}
                            </MenuItem>
                          )
                        )}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <DatePickerComponent
                      label={"Scheduled Departure"}
                      selectedDate={scheduled_departure}
                      hasTime={true}
                      handleDateChange={handleDepartureDateChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePickerComponent
                      label={"Scheduled Arrival"}
                      selectedDate={scheduled_arrival}
                      hasTime={true}
                      handleDateChange={handleScheduledDateChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={shipmentFlag || []}
                      getOptionLabel={(option) => {
                        if (option) return `${option.name}(${option.type})`;
                      }}
                      onChange={(event, newValue) => {
                        onShipmentFlagChange(newValue);
                      }}
                      // filterSelectedOptions
                      value={
                        (shipmentFlag &&
                          shipmentFlag.filter((flag) => {
                            return flags.indexOf(flag.url) !== -1;
                          })) ||
                        []
                      }
                      renderOption={(option, { selected }) => (
                        <React.Fragment>
                          <Checkbox
                            // icon={icon}
                            // checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {`${option.name}(${option.type})`}
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Violation/Warnings"
                          placeholder="Select"
                          margin="normal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="uom_distance"
                      select
                      label="Units of Measure Distance"
                      value={uom_distance}
                      onChange={(e) => setUomDistance(e.target.value)}
                    >
                      {unitsOfMeasure &&
                        unitsOfMeasure
                          .filter((obj) => {
                            return (
                              obj.supported_class === "Distance and Length"
                            );
                          })
                          .sort(compareSort("name"))
                          .map((item, index) => (
                            <MenuItem
                              key={`${item.id}${item.name}`}
                              value={item.url}
                            >
                              {item.name}
                            </MenuItem>
                          ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="uom_weight"
                      select
                      label="Units of Measure Mass/Weight"
                      value={uom_weight}
                      onChange={(e) => setUomWeight(e.target.value)}
                    >
                      {unitsOfMeasure &&
                        unitsOfMeasure
                          .filter((obj) => {
                            return obj.supported_class === "Mass and Weight";
                          })
                          .sort(compareSort("name"))
                          .map((item, index) => (
                            <MenuItem
                              key={`${item.id}${item.name}`}
                              value={item.url}
                            >
                              {item.name}
                            </MenuItem>
                          ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
              {(shipmentFormData || editPage) && (
                <Grid item xs={12}>
                  <ShipmentRouteInfo {...props} editData={editData} />
                </Grid>
              )}
            </Grid>
          </Box>
          <Grid container spacing={3} className={classes.buttonContainer}>
            <Grid item xs={6} sm={2}>
              <div className={classes.loadingWrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={loading || submitDisabled()}
                >
                  {`Save`}
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleNext}
                disabled={shipmentFormData === null}
                className={classes.submit}
              >
                {`Next: Add Items`}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.itemsReducer,
  ...state.custodianReducer,
});

export default connect(mapStateToProps)(ShipmentInfo);
