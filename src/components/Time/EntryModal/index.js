import React, { Component } from 'react';

import db from '../../../helpers/db';
import Button from '../../Button';
import Input from '../../Input';
import Textarea from '../../Textarea';
import Label from '../../Label';
import Status from 'react-alert';
import { statusOptions } from '../../../constants/statusOptions';

class EntryModal  extends Component {
	constructor(props) {
		super(props);

		this.state = {
			taskId: props.taskId ? props.taskId : null,
			taskDate: '',
			taskCustomer: '',
			taskTime: '',
			taskActualTime: '',
			taskDescription: '',
		}

		this.onTaskDateChange = this.onTaskDateChange.bind(this);
		this.onTaskCustomerChange = this.onTaskCustomerChange.bind(this);
		this.onTaskTimeChange = this.onTaskTimeChange.bind(this);
		this.onTaskDescriptionChange = this.onTaskDescriptionChange.bind(this);
		this.resetEntryInputs = this.resetEntryInputs.bind(this);
		this.fetchTask = this.fetchTask.bind(this);
	}

	componentDidMount() {
		const { taskId } = this.state;
		const id = parseInt(taskId, 10);

		if (id) {
			this.fetchTask(id);
		} else {
			this.resetEntryInputs();
			this.dateInput.valueAsDate = new Date();
			this.setState({
				taskDate: this.formatDate(this.dateInput.value),
			});
		}
	}

	fetchTask(taskId) {
		db.table("time")
			.where("id")
			.equals(taskId)
			.toArray()
			.then((task) => {
				var foundTask = task[0];
				if (foundTask) {

					this.dateInput.valueAsDate = new Date(foundTask.taskDate + '/' + (new Date()).getFullYear());
					var formattedDate = this.formatDate(this.dateInput.value);

					let actualTime = foundTask.actualTime;
					if (! actualTime) {
						let created = new Date(foundTask.createdDateTime);
						let now = new Date();

						actualTime = (Math.abs(now - created) / 3600000).toFixed(2);
					}

					this.setState({
						taskId: foundTask.id,
						taskDate: formattedDate,
						taskCustomer: foundTask.customer,
						taskTime: foundTask.time,
						taskActualTime: actualTime,
						taskDescription: foundTask.description,
						taskCreatedDate: new Date(foundTask.createdDateTime).toString().slice(0,-33),
						taskCompletedDate: foundTask.completedDateTime
							? new Date(foundTask.completedDateTime).toString().slice(0,-33)
							: 'In Progress',
					});
				}

			}).catch(function (err) {
				this.showStatusMessage(err, 'error');
			});

	}

	onTaskDateChange(event) {
		const date = event.target.value;

		var formattedDate = this.formatDate(date);

		this.setState({
			taskDate: formattedDate,
		});
	}

	formatDate(date) {
		var dateArray = date.split('-');

		return dateArray[1] + '/' + dateArray[2];
	}

	onTaskCustomerChange(event) {
		const customer = event.target.value;

		this.setState({
			taskCustomer: customer,
		});
	}

	onTaskTimeChange(event) {
		const time = event.target.value;

		this.setState({
			taskTime: time,
		});
	}

	onTaskDescriptionChange(event) {
		const description = event.target.value;

		this.setState({
			taskDescription: description,
		});
	}

	resetEntryInputs() {
		this.setState({
			taskId: '',
			taskCustomer: '',
			taskTime: '',
			taskDescription: '',
		});
	}

	showStatusMessage(message, type) {
		this.message.show(message, {
			time: 2000,
			type: type,
		});
	}

	render() {
		const {
			taskId,
			taskDate,
			taskCustomer,
			taskTime,
			taskActualTime,
			taskDescription,
			taskCreatedDate,
			taskCompletedDate,
		} = this.state;

		const {
			onClose,
			onSave,
			onRemove,
		} = this.props;

		return (
			<div className='modal'>
				<div className='modal-content shadow'>
					<h5>Time Entry</h5>
					<hr className='n-fade' />
					<div className='button top-right modal-content-close' onClick={ onClose }>
						<span><i className='fa fa-times'></i></span>
					</div>

					<div className='container'>
						<Label text='Date' />
						<input
							ref={(input) => { this.dateInput = input; }}
							className='input medium' type='date' onChange={ (e) => this.onTaskDateChange(e) }
						/>
						<Label text='Customer' />
						<Input classList='input' onChange={ (e) => this.onTaskCustomerChange(e) } inputValue={ taskCustomer } focus={ true }/>
						<Label text='Time' />
						{taskId && <span className='x-small'> (Actual time: <b>{ taskActualTime }</b>)</span> }
						<Input classList='input' inputType='number' onChange={ (e) => this.onTaskTimeChange(e) } inputValue={ taskTime } focus={ false }/>
						<Label text='Description' />
						<Textarea onChange={ (e) => this.onTaskDescriptionChange(e) } value={ taskDescription } />

						{taskId &&
							<div>
								<Label text='Started' />
								<div className='small' style={{ marginLeft: '5px' }}>{taskCreatedDate}</div>

								<Label text='Completed' />
								<div className='small' style={{ marginLeft: '5px' }}>{taskCompletedDate}</div>
							</div>
						}

						<Button text='Save' onClick={ () => onSave(taskId, taskDate, taskCustomer, taskTime, taskDescription, taskActualTime) }/>
						{taskId &&
							<Button style={{ marginLeft: '2px' }} text='Remove' onClick={ () => onRemove(taskId) }/>
						}
						<Status ref={e => this.message = e} {...statusOptions} />
					</div>
				</div>
			</div>
		)
	}
}

export default EntryModal;
