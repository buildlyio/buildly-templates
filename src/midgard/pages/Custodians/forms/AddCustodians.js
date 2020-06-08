import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
// import { register, login } from "../../redux/authuser/actions/authuser.actions";
import Grid from "@material-ui/core/Grid";
import { validators } from "../../../utils/validators";
import Modal from "../../../components/Modal/Modal";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Select from "@material-ui/core/Select";
import { useInput } from "../../../hooks/useInput";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo: {
    width: "100%",
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
  addressContainer: {
    marginTop: theme.spacing(4),
  },
}));

function AddCustodians({
  dispatch,
  loading,
  history,
  loaded,
  error,
  data,
  location,
}) {
  const [openModal, toggleModal] = useState(true);
  const classes = useStyles();
  const company = useInput("", { required: true });
  const alias = useInput("");
  const custodianType = useInput("", { required: true });
  const consortium = useInput("", { required: true });
  const [shipmentId, setShipmentId] = useState("");
  const glnNumber = useInput("", { required: true });
  const address = useInput("", { required: true });
  const city = useInput("", { required: true });
  const state = useInput("", { required: true });
  const zip = useInput("", { required: true });
  const [formError, setFormError] = useState({});

  const buttonText =
    location && location.state && location.state.type === "edit"
      ? "save"
      : "add custodian";

  const formTitle =
    location && location.state && location.state.type === "edit"
      ? "Edit Custodian"
      : "Add Custodian";

  const closeModal = () => {
    toggleModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  /**
   * Submit The form and add custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    location.register = true;
    const registerFormValue = {
      username: username.value,
      email: email.value,
      password: password.value,
      organization_name: organization_name.value,
      first_name: first_name.value,
      last_name: last_name.value,
    };
    dispatch(register(registerFormValue, history));
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
    if (!company) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div>
      {openModal && (
        <Modal open={openModal} setOpen={closeModal} title={formTitle}>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12} md={6} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="company"
                  label="Company Name"
                  name="company"
                  autoComplete="company"
                  error={formError.company && formError.company.error}
                  helperText={
                    formError.company ? formError.company.message : ""
                  }
                  onBlur={(e) => handleBlur(e, "required", company)}
                  {...company.bind}
                />
              </Grid>
              <Grid item item xs={12} md={6} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="alias"
                  label="Alias"
                  name="alias"
                  autoComplete="alias"
                  {...alias.bind}
                />
              </Grid>
            </Grid>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12} md={6} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="custodianType"
                  select
                  required
                  label="Custodian Type"
                  error={
                    formError.custodianType && formError.custodianType.error
                  }
                  helperText={
                    formError.custodianType
                      ? formError.custodianType.message
                      : ""
                  }
                  onBlur={(e) =>
                    handleBlur(e, "required", custodianType, "custodianType")
                  }
                  {...custodianType.bind}
                >
                  <MenuItem value={""}>Select</MenuItem>
                  <MenuItem value={"type1"}>Type 1</MenuItem>
                  <MenuItem value={"type2"}>Type 2</MenuItem>
                </TextField>
              </Grid>
              <Grid item item xs={12} md={6} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="consortium"
                  select
                  required
                  label="Consortium"
                  error={formError.consortium && formError.consortium.error}
                  helperText={
                    formError.consortium ? formError.consortium.message : ""
                  }
                  onBlur={(e) =>
                    handleBlur(e, "required", consortium, "consortium")
                  }
                  {...consortium.bind}
                >
                  <MenuItem value={""}>Select</MenuItem>
                  <MenuItem value={"type1"}>Type 1</MenuItem>
                  <MenuItem value={"type2"}>Type 2</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="glnNumber"
                  label="GLN Number"
                  name="glnNumber"
                  autoComplete="glnNumber"
                  {...glnNumber.bind}
                />
              </Grid>
            </Grid>
            <Card variant="outlined" className={classes.addressContainer}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="address"
                      label="Physical Address"
                      name="address"
                      autoComplete="address"
                      error={formError.address && formError.address.error}
                      helperText={
                        formError.address ? formError.address.message : ""
                      }
                      onBlur={(e) => handleBlur(e, "required", address)}
                      {...address.bind}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="state"
                      select
                      required
                      label="State"
                      error={formError.state && formError.state.error}
                      helperText={
                        formError.state ? formError.state.message : ""
                      }
                      onBlur={(e) => handleBlur(e, "required", state, "state")}
                      {...state.bind}
                    >
                      <MenuItem value={""}>Select</MenuItem>
                      <MenuItem value={"type1"}>Type 1</MenuItem>
                      <MenuItem value={"type2"}>Type 2</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="city"
                      label="City"
                      name="city"
                      autoComplete="city"
                      error={formError.city && formError.city.error}
                      helperText={formError.city ? formError.city.message : ""}
                      onBlur={(e) => handleBlur(e, "required", city)}
                      {...city.bind}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="zip"
                      label="Zip"
                      name="zip"
                      autoComplete="zip"
                      error={formError.zip && formError.zip.error}
                      helperText={formError.zip ? formError.zip.message : ""}
                      onBlur={(e) => handleBlur(e, "required", zip)}
                      {...zip.bind}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Grid container spacing={isDesktop ? 3 : 0} justify="center">
              <Grid item item xs={12} sm={4}>
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
              <Grid item item xs={12} sm={4}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
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
  ...state.authReducer,
});

export default connect(mapStateToProps)(AddCustodians);