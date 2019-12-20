import React, { Component } from 'react';

import db from '../../helpers/db';
import Table from './Table';
import EntryModal from './EntryModal';
import Status from 'react-alert';
import { statusOptions } from '../../constants/statusOptions';

import './style.css';

class Time extends Component {
	constructor(props) {
		super(props);

		this.state = {
			taskId: null,
			taskList: [],
			showEntryModal: false,
		}

		this.fetchAllTasks = this.fetchAllTasks.bind(this);
		this.sortTaskList = this.sortTaskList.bind(this);
		this.onCompleteClick = this.onCompleteClick.bind(this);
		this.onBillableClick = this.onBillableClick.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onAddButtonClick = this.onAddButtonClick.bind(this);
		this.onSaveClick = this.onSaveClick.bind(this);
		this.onEntryCloseButtonClick = this.onEntryCloseButtonClick.bind(this);
		this.onEditButtonClick = this.onEditButtonClick.bind(this);
		this.onRemoveClick = this.onRemoveClick.bind(this);
		this.refreshData = this.refreshData.bind(this);
		this.showEntryModal = this.showEntryModal.bind(this);
	}

	componentDidMount() {
		this.fetchAllTasks();
		document.addEventListener("keydown", this.onKeyDown, false);
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyDown, false);
	}

	onAddButtonClick = () => {
		this.showEntryModal();
	}

	onKeyDown(event) {
		if (event.keyCode === 78 && ! event.target.type) {
			event.preventDefault();
			this.showEntryModal();
		} else if (event.keyCode === 27) {
			this.refreshData();
		}
	}

	showEntryModal = (taskId) => {
		var showModal = this.state.showEntryModal;

		if (! showModal) {
			this.setState({
				taskId: taskId,
				showEntryModal: true
			});
		}
	}

	sortTaskList(taskList) {
		taskList.sort(function(a,b) {
			return b.createdDateTime - a.createdDateTime;
		});

		for (var task in taskList) {
			var todo = taskList[task];

			if (! todo.time) {
				var element = taskList.splice(task ,1);
				taskList.unshift(element[0]);
			}
		}

		return taskList;
	}

	getPastWeek(numberOfDaysAgo) {
		var today = new Date();
		var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - numberOfDaysAgo);

		return lastWeek;
	}

	fetchAllTasks() {
		var lastWeek = this.getPastWeek(14).getTime();

		db.table("time")
			.where("createdDateTime")
			.aboveOrEqual(lastWeek)
			.or("time")
			.equals("")
			.toArray()
			.then((taskList) => {
				this.sortTaskList(taskList);
				this.setState({ taskList: taskList });
		});
	}

	showStatusMessage(message, type) {
		this.message.show(message, {
			time: 2000,
			type: type,
		});
	}

	onCompleteClick(taskId, complete) {
		const id = parseInt(taskId, 10);

		if (! id) {
			return true;
		}

		if (complete === 1) {
			complete = 0;
		} else {
			complete = 1;
		}

		db.table("time")
			.update(id, {complete: complete})
			.then(() =>  {
				this.fetchAllTasks();
			});
	}

	onBillableClick(taskId, billable) {
		const id = parseInt(taskId, 10);

		if (! id) {
			return true;
		}

		if (billable === 1) {
			billable = 0;
		} else {
			billable = 1;
		}

		db.table("time")
			.update(id, {billable: billable})
			.then(() =>  {
				this.fetchAllTasks();
			});
	}

	onEntryCloseButtonClick = () => {
		this.refreshData();
		document.querySelector('.sidenav').style.zIndex = '1';

		if (document.querySelector('.addButton')) {
			document.querySelector('.addButton').style.zIndex = '0';
		}
	}

	onSaveClick = (taskId, taskDate, taskCustomer, taskTime, taskComment, actualTime) => {
		if (parseInt(taskId, 10)) {
			this.updateTime(taskId, taskDate, taskCustomer, taskTime, taskComment, actualTime);
		} else {
			this.addNewTime(taskDate, taskCustomer, taskTime, taskComment);
		}
	}

	updateTime(taskId, taskDate, taskCustomer, taskTime, taskDescription, actualTime) {
		const task = {
			customer: taskCustomer,
			time: taskTime,
			description: taskDescription,
			taskDate: taskDate,
			modifiedDateTime: Date.now(),
			completedDateTime: taskTime ? Date.now() : null,
			actualTime: (actualTime && taskTime) ? actualTime : null,
		};

		let id = null;
		if (taskId) {
			id = parseInt(taskId, 10);
		}

		if (! id) {
			this.showStatusMessage('No selected time to update', 'error');
			return;
		}

		db.table("time")
			.update(id, task)
			.then(() =>  {
				this.refreshData();
			});
	}

	addNewTime(taskDate, taskCustomer, taskTime, taskDescription) {
		const task = {
			customer: taskCustomer,
			time: taskTime,
			description: taskDescription,
			taskDate: taskDate,
			billable: true,
			createdDateTime: Date.now(),
			completedDateTime: taskTime ? Date.now() : null,
			actualTime: taskTime ? taskTime : null,
			modifiedDateTime: Date.now(),
		};

		db.table("time")
			.add(task)
			.then((id) => {
				this.refreshData();
			});
	}

	onEditButtonClick(taskId) {
		this.showEntryModal(taskId);
	}

	onRemoveClick(taskId) {
		const id = parseInt(taskId, 10);

		if (! id) {
			return;
		}

		db.table("time")
		.delete(id)
		.then(() => {
			this.refreshData();
		});
	}

	refreshData() {
		this.setState({
			taskId: null,
			showEntryModal: false
		});

		this.fetchAllTasks();
	}

	render() {
		const {
			taskId,
			taskList,
			showEntryModal
		} = this.state;

		return (
			<div className='time-table'>
				<Table
					taskList={ taskList }
					onCompleteClick={ this.onCompleteClick }
					onBillableClick={ this.onBillableClick }
					onAddButtonClick={ this.onAddButtonClick }
					onEditButtonClick={ this.onEditButtonClick }
				/>

				{ taskList.length > 0 &&
					<p className='center small'>Total: { taskList.length }</p>
				}

				{ showEntryModal &&
					<EntryModal
						taskId={ taskId }
						titleValue={ 'Settings' }
						onClose={ e => this.onEntryCloseButtonClick() }
						onSave={ this.onSaveClick }
						onRemove={ this.onRemoveClick }
					/>
				}

				<Status ref={e => this.message = e} {...statusOptions} />
			</div>
		)
	}
}

export default Time;
