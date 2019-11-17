import React, { Component } from 'react';
import './style.css';

class Table extends Component {
	onRowClick(e) {
		let color = '';
		const row = e.target.closest('tr');

		if (e.target.tagName === 'TD') {
			if (row.style.backgroundColor !== 'yellow') {
				color = 'yellow';
			}
		}

		row.style.backgroundColor = color;
	}

	render() {
		const {
			taskList,
			onCompleteClick,
			onBillableClick,
			onAddButtonClick,
			onEditButtonClick,
		} = this.props;

		return (
			<div className='container-content'>
				<table className='table-all'>
					<thead>
						<tr>
							<th></th>
							<th>Date</th>
							<th>Customer</th>
							<th>Time</th>
							<th>Description</th>
						</tr>
					</thead>

					<tbody>
						{ taskList.length === 0 &&
							<tr><td style={{ textAlign: 'center' }} colSpan='5'>No time found</td></tr>
						}

						{ taskList.map(task =>
							<tr
								key={ task.id }
								className={task.time === "" ? 'active-task' : null }
								onClick={ (e) => this.onRowClick(e) }
							>
								<td style={{ whiteSpace: 'nowrap' }}>
									<span className='edit-button' onClick={ () => onEditButtonClick(task.id) } style={{ textDecoration: 'none', color: 'black' }}>
										<i className='fa fa-pencil-alt'></i>
									</span>
									<span className='complete' key={ task.id + task.description } onClick={ () => onCompleteClick(task.id, task.complete) }>
										<i className={task.complete ? "fa fa-check complete-task" : "fa fa-check" } ></i>
									</span>
									<span onClick={ () => onBillableClick(task.id, task.billable) }>
										<i className={ task.billable ? "billable fa fa-file-invoice-dollar billable-task" : "billable fa fa-file-invoice-dollar not-billable-task" }></i>
									</span>
								</td>
								<td>{task.taskDate}</td>
								<td>{task.customer}</td>
								<td>{task.time}</td>
								<td>
									{task.description.split("\n").map(text =>
										<div key={ Math.random() }>{text}</div>
									)}
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<span onClick={ (e) => onAddButtonClick(e) }><i className='button addButton circle card large fa fa-plus'></i></span>
			</div>
		)
	}
}

export default Table;
