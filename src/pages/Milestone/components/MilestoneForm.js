import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import FormModal from '@components/Modal/FormModal';
import {
	Button,
	CircularProgress,
	Grid,
	MenuItem,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import { validators } from '@utils/validators';
import { useInput } from '@hooks/useInput';
import DatePickerComponent from '@components/DatePicker/DatePicker';
import moment from 'moment-timezone';

const useStyles = makeStyles((theme) => ({
	formTitle: {
		fontWeight: 'bold',
		marginTop: '1em',
		textAlign: 'center',
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1),
		[theme.breakpoints.up('sm')]: {
			width: '70%',
			margin: 'auto',
		},
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		borderRadius: '18px',
	},
	loadingWrapper: {
		position: 'relative',
	},
	buttonProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
}));

const MilestoneForm = ({ loading, location, history }) => {
	const classes = useStyles();
	const redirectTo = location.state && location.state.from;
	const isEditPage = location.state && location.state.type === 'edit';
	const editData = (
		location.state
		&& location.state.type === 'edit'
		&& location.state.data
	) || {};

	const buttonText = isEditPage ? 'Update Milestone' : 'Add Milestone';
	const formTitle = isEditPage ? 'Edit Milestone' : 'Add Milestone';
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

	const [formModalOpen, setFormModalOpen] = useState(true);
	const [openConfirmModal, setConfirmModal] = useState(false);

	const [formError, setFormError] = useState({});

	const state = useInput(editData.state || '', { required: true });
	const description = useInput(editData.description || '', { required: true });
	const info = useInput(editData.info || '', {});
	const capacity = useInput(editData.capacity || '', {});
	const ed = useInput(editData.ed || '', {});
	const [startDate, setStartDate] = useState(
		(editData && editData.start_date) || null,
	);
	const [dueDate, setDueDate] = useState(
		(editData && editData.due_date) || null,
	);
	const [burndownDate, setBurndownDate] = useState(
		(editData && editData.burndown_date) || null,
	);

	const states = ['open', 'closed'];

	const handleModalClose = () => {
		const dataHasChanged = (
			state.hasChanged()
			|| description.hasChanged()
			|| info.hasChanged()
			|| capacity.hasChanged()
			|| ed.hasChanged()
			|| startDate !== editData.start_date
			|| dueDate !== editData.due_date
			|| burndownDate !== editData.burndown_date
		);

		if (dataHasChanged) {
			setConfirmModal(true);
		} else {
			setFormModalOpen(false);
			if (redirectTo) {
				history.push(redirectTo);
			}
		}
	};

	const handleBlur = (event, validation, input, parentId) => {
		const validateObj = validators(validation, input);
		const prevState = { ...formError };
		if (validateObj && validateObj.error) {
			setFormError({
				...prevState,
				[event.target.id || parentId]: validateObj,
			});
		} else {
			setFormError({
				...prevState,
				[event.target.id || parentId]: {
					error: false,
					message: '',
				},
			});
		}
	};

	const discardFormData = () => {
		setConfirmModal(false);
		setFormModalOpen(false);
		if (redirectTo) {
			history.push(redirectTo);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		let combinedDescription = description.value;
		if(startDate) {
			combinedDescription += `\n> startdate ${moment(startDate).format('YYYY-MM-DD')}`;
		}
		if(info.value) {
			combinedDescription += `\n> info ${info.value}`;
		}
		if(burndownDate) {
			combinedDescription += `\n> burndowndate ${moment(burndownDate).format('YYYY-MM-DD')}`;
		}
		if(capacity.value) {
			combinedDescription += `\n> capacity ${capacity.value}`;
		}
		if(ed.value) {
			combinedDescription += `\n> ed ${ed.value}`;
		}
		combinedDescription += '\n';

		const data = {
			state: state.value,
			description: combinedDescription,
			due_date: moment(dueDate).toISOString()
		};

		console.log(data);
	};

	const submitDisabled = () => {
		const errorKeys = Object.keys(formError);
		if (!description.value || !state.value || !startDate) {
			return true;
		}
		let errorExists = false;
		errorKeys.every((key) => {
			if (formError[key].error) {
				errorExists = true;
				return false;
			}
			return true;
		});
		return errorExists;
	};

	return <FormModal
		open={ formModalOpen }
		handleClose={ handleModalClose }
		title={ formTitle }
		titleClass={ classes.formTitle }
		maxWidth='md'
		wantConfirm={ true }
		openConfirmModal={ openConfirmModal }
		setConfirmModal={ setConfirmModal }
		handleConfirmModal={ discardFormData }
	>
		{ isEditPage &&
			<Typography id='modal-modal-title' variant='h6' component='h2' className={ classes.formTitle }>
				{ editData.repository } - { editData.milestone }
			</Typography>
		}
		<form
			className={ classes.form }
			noValidate
			onSubmit={ handleSubmit }
		>
			<Grid container spacing={ isDesktop ? 2 : 0 }>
				<Grid item xs={ 12 }>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						id='description'
						label='Description'
						name='description'
						autoComplete='description'
						error={
							formError.description
							&& formError.description.error
						}
						helperText={
							formError.description
								? formError.description.message
								: ''
						}
						onBlur={ (event) => handleBlur(event, 'required', description) }
						{ ...description.bind }
					/>
				</Grid>
				<Grid item xs={ 12 }>
					<TextField
						variant='outlined'
						margin='normal'
						fullWidth
						select
						required
						id='state'
						label='State'
						error={
							formError.state
							&& formError.state.error
						}
						helperText={
							formError.state
								? formError.state.message
								: ''
						}
						onBlur={ (e) => handleBlur(e, 'required', state, 'state') }
						{ ...state.bind }
					>
						<MenuItem value=''>Select</MenuItem>
						{ states.map((state) => <MenuItem
							key={ state }
							value={ state }
						>
							{ state.charAt(0).toUpperCase() + state.slice(1) }
						</MenuItem>) }
					</TextField>
				</Grid>
				<Grid item xs={ 6 }>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						id='info'
						label='Info'
						name='info'
						autoComplete='info'
						error={
							formError.info
							&& formError.info.error
						}
						helperText={
							formError.info
								? formError.info.message
								: ''
						}
						onBlur={ (event) => handleBlur(event, '', info) }
						{ ...info.bind }
					/>
				</Grid>
				<Grid item xs={ 6 }>
					<DatePickerComponent
						label='Start Date'
						selectedDate={ startDate }
						handleDateChange={ setStartDate }
						disabled={ false }
					/>
				</Grid>
				<Grid item xs={ 6 }>
					<DatePickerComponent
						label='Due Date'
						selectedDate={ dueDate }
						handleDateChange={ setDueDate }
						disabled={ false }
					/>
				</Grid>
				<Grid item xs={ 6 }>
					<DatePickerComponent
						label='Burndown Date'
						selectedDate={ burndownDate }
						handleDateChange={ setBurndownDate }
						disabled={ false }
					/>
				</Grid>
				<Grid item xs={ 6 }>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						id='capacity'
						label='Capacity'
						name='capacity'
						autoComplete='capacity'
						error={
							formError.capacity
							&& formError.capacity.error
						}
						helperText={
							formError.capacity
								? formError.capacity.message
								: ''
						}
						onBlur={ (event) => handleBlur(event, '', capacity) }
						{ ...capacity.bind }
					/>
				</Grid>
				<Grid item xs={ 6 }>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						id='ed'
						label='ED'
						name='ed'
						autoComplete='ed'
						error={
							formError.ed
							&& formError.ed.error
						}
						helperText={
							formError.ed
								? formError.ed.message
								: ''
						}
						onBlur={ (event) => handleBlur(event, '', ed) }
						{ ...ed.bind }
					/>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={ isDesktop ? 3 : 0 }
				justifyContent='center'
			>
				<Grid item xs={ 12 } sm={ 4 }>
					<div className={ classes.loadingWrapper }>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={ classes.submit }
							disabled={ loading || submitDisabled() }
						>
							{ buttonText }
						</Button>
						{ loading && (
							<CircularProgress
								size={ 24 }
								className={ classes.buttonProgress }
							/>
						) }
					</div>
				</Grid>
				<Grid item xs={ 12 } sm={ 4 }>
					<Button
						type='button'
						fullWidth
						variant='contained'
						color='primary'
						onClick={ discardFormData }
						className={ classes.submit }
					>
						Cancel
					</Button>
				</Grid>
			</Grid>
		</form>
	</FormModal>;
};

export default MilestoneForm;