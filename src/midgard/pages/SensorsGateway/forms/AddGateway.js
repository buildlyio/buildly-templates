import React, { useState, useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { validators } from "../../../utils/validators";
import Modal from "../../../components/Modal/Modal";
import MenuItem from "@material-ui/core/MenuItem";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Select from "@material-ui/core/Select";
import { useInput } from "../../../hooks/useInput";
import Loader from "../../../components/Loader/Loader";
import { Card, CardContent, Typography } from "@material-ui/core";
import DatePickerComponent from "../../../components/DatePicker/DatePicker";
import {
  addGateway,
  editGateway,
} from "../../../redux/sensorsGateway/actions/sensorsGateway.actions";
import { MAP_API_URL } from "../../../utils/utilMethods";
import { MapComponent } from "../../../components/MapComponent/MapComponent";

/**
 *
 * The current organization
 */
let organization = localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")).organization.organization_uuid : '';

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
    margin: theme.spacing(3, 0, 2),
    borderRadius: "18px",
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
  cardItems: {
    marginTop: theme.spacing(4),
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
  },
}));

function AddGateway({
  dispatch,
  loading,
  history,
  loaded,
  error,
  location,
  gatewayTypeList,
  gatewayOptions,
}) {
  const redirectTo = location.state && location.state.from;
  const editPage = location.state && location.state.type === "edit";
  const editData =
    (location.state && location.state.type === "edit" && location.state.data) ||
    {};
  const [openModal, toggleModal] = useState(true);
  const classes = useStyles();
  const gateway_name = useInput(editData.name || "", {
    required: true,
  });
  const gateway_type = useInput(editData.gateway_type || "", {
    required: true,
  });
  const [activation_date, handleDateChange] = useState(
    editData.activation_date || moment()
  );
  const sim_card_id = useInput(editData.sim_card_id || "");
  const battery_level = useInput(editData.last_known_battery_level || "");
  const mac_address = useInput(editData.mac_address || "");
  const [last_known_location, setLastLocation] = useState(
    (editData &&
      editData.last_known_location &&
      editData.last_known_location[0]) ||
      ""
  );
  const gateway_uuid = useInput(editData.gateway_uuid || "");
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? "save" : "Submit";
  const formTitle = editPage ? "Edit Gateway" : "Add Gateway";

  const [gatewayMetaData, setGatewayMetaData] = useState({});

  useEffect(() => {
    if (gatewayOptions && gatewayOptions.actions) {
      setGatewayMetaData(gatewayOptions.actions.POST);
    }
  }, [gatewayOptions]);

  const closeModal = () => {
    toggleModal(false);
    if (location && location.state) {
      history.push(redirectTo);
    }
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const gatewayFormValues = {
      name: gateway_name.value,
      sensors: "",
      sim_card_id: sim_card_id.value,
      gateway_type: gateway_type.value,
      shipment_ids: [],
      activation_date: activation_date,
      last_known_battery_level: battery_level.value,
      ...(editPage && editData && { id: editData.id }),
      mac_address: mac_address.value,
      last_known_location: [last_known_location],
      last_known_battery_level: battery_level.value,
      organization_uuid: organization,
    };
    if (editPage) {
      dispatch(editGateway(gatewayFormValues, history, redirectTo));
    } else {
      dispatch(addGateway(gatewayFormValues, history, redirectTo));
    }
  };

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
    if (!gateway_type.value || !gateway_name.value) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const setLastKnownLocation = (value) => {
    setLastLocation(value);
  };

  return (
    <div>
      {openModal && (
        <Modal
          open={openModal}
          setOpen={closeModal}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth={"md"}
        >
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="gateway_name"
                  required
                  label="Gateway Name"
                  name="gateway_name"
                  autoComplete="gateway_name"
                  error={formError.gateway_name && formError.gateway_name.error}
                  helperText={
                    formError.gateway_name ? formError.gateway_name.message : ""
                  }
                  onBlur={(e) => handleBlur(e, "required", gateway_name)}
                  {...gateway_name.bind}
                  InputProps={
                    gatewayMetaData["name"] &&
                    gatewayMetaData["name"].help_text && {
                      endAdornment: (
                        <InputAdornment position="end">
                          {gatewayMetaData["name"].help_text && (
                            <CustomizedTooltips
                              toolTipText={gatewayMetaData["name"].help_text}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }
                  }
                />
              </Grid>
            </Grid>
            <Card variant="outlined" className={classes.cardItems}>
              <CardContent>
                <Typography
                  className={classes.dashboardHeading}
                  variant={"body1"}
                >
                  Gateway Info
                </Typography>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="gateway_type"
                      select
                      label="Gateway Type"
                      error={
                        formError.gateway_type && formError.gateway_type.error
                      }
                      helperText={
                        formError.gateway_type
                          ? formError.gateway_type.message
                          : ""
                      }
                      onBlur={(e) =>
                        handleBlur(e, "required", gateway_type, "gateway_type")
                      }
                      {...gateway_type.bind}
                      InputProps={
                        gatewayMetaData["gateway_type"] &&
                        gatewayMetaData["gateway_type"].help_text && {
                          endAdornment: (
                            <InputAdornment position="start">
                              {gatewayMetaData["gateway_type"].help_text && (
                                <CustomizedTooltips
                                  toolTipText={
                                    gatewayMetaData["gateway_type"].help_text
                                  }
                                />
                              )}
                            </InputAdornment>
                          ),
                        }
                      }
                    >
                      <MenuItem value={""}>Select</MenuItem>
                      {gatewayTypeList &&
                        gatewayTypeList.map((item, index) => (
                          <MenuItem
                            key={`gatewayType${index}:${item.id}`}
                            value={item.url}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <DatePickerComponent
                      label={"Activated"}
                      selectedDate={activation_date}
                      handleDateChange={handleDateChange}
                      helpText={
                        gatewayMetaData["activation_date"] &&
                        gatewayMetaData["activation_date"].help_text
                          ? gatewayMetaData["activation_date"].help_text
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="sim_card_id"
                      label="IMEI"
                      name="sim_card_id"
                      autoComplete="sim_card_id"
                      {...sim_card_id.bind}
                      InputProps={
                        gatewayMetaData["sim_card_id"] &&
                        gatewayMetaData["sim_card_id"].help_text && {
                          endAdornment: (
                            <InputAdornment position="end">
                              {gatewayMetaData["sim_card_id"].help_text && (
                                <CustomizedTooltips
                                  toolTipText={
                                    gatewayMetaData["sim_card_id"].help_text
                                  }
                                />
                              )}
                            </InputAdornment>
                          ),
                        }
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="battery_level"
                      label="Battery(%)"
                      name="battery_level"
                      autoComplete="battery_level"
                      {...battery_level.bind}
                      InputProps={
                        gatewayMetaData["last_known_battery_level"] &&
                        gatewayMetaData["last_known_battery_level"]
                          .help_text && {
                          endAdornment: (
                            <InputAdornment position="end">
                              {gatewayMetaData["last_known_battery_level"]
                                .help_text && (
                                <CustomizedTooltips
                                  toolTipText={
                                    gatewayMetaData["last_known_battery_level"]
                                      .help_text
                                  }
                                />
                              )}
                            </InputAdornment>
                          ),
                        }
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="mac_address"
                      label="Mac Address"
                      name="mac_address"
                      autoComplete="mac_address"
                      {...mac_address.bind}
                      InputProps={
                        gatewayMetaData["mac_address"] &&
                        gatewayMetaData["mac_address"].help_text && {
                          endAdornment: (
                            <InputAdornment position="end">
                              {gatewayMetaData["mac_address"].help_text && (
                                <CustomizedTooltips
                                  toolTipText={
                                    gatewayMetaData["mac_address"].help_text
                                  }
                                />
                              )}
                            </InputAdornment>
                          ),
                        }
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="last_known_location"
                      label="Last Known Location"
                      name="last_known_location"
                      autoComplete="last_known_location"
                      value={last_known_location}
                      InputProps={
                        gatewayMetaData["last_known_location"] &&
                        gatewayMetaData["last_known_location"].help_text && {
                          endAdornment: (
                            <InputAdornment position="end">
                              {gatewayMetaData["last_known_location"]
                                .help_text && (
                                <CustomizedTooltips
                                  toolTipText={
                                    gatewayMetaData["last_known_location"]
                                      .help_text
                                  }
                                />
                              )}
                            </InputAdornment>
                          ),
                        }
                      }
                    />
                    <MapComponent
                      isMarkerShown
                      googleMapURL={MAP_API_URL}
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `200px` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                      markers={[
                        {
                          lat:
                            last_known_location &&
                            parseFloat(last_known_location.split(",")[0]),
                          lng:
                            last_known_location &&
                            parseFloat(last_known_location.split(",")[1]),
                          onMarkerDrag: setLastKnownLocation,
                          draggable: true,
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Grid container spacing={2} justify="center">
              <Grid item xs={6} sm={4}>
                <div className={classes.loadingWrapper}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading || submitDisabled()}
                  >
                    {buttonText}
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => closeModal()}
                  className={classes.submit}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Modal>
      )}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(AddGateway);
