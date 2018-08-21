import React, { Component } from 'react';
import { openLink } from '../../../helpers/link.js';

import getSetting from '../../NavBar/Settings/Entry/helper.js';
import {
	CONNECTION_FILE_PATH,
} from '../../NavBar/Settings/Entry/constants.js';

class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filesPath: '',
		};

		this.onLinkClick = this.onLinkClick.bind(this);
		this.getFilesPath = this.getFilesPath.bind(this);
	}

	componentDidMount() {
		this.getFilesPath();
	}

	onLinkClick(event, link) {
		event.preventDefault()

		const path = this.state.filesPath + link;
		openLink(path);
	}

	getFilesPath() {
		getSetting(CONNECTION_FILE_PATH, 'path').then((setting) => {
			this.setState({ filesPath: setting });
		});
	}

	onWebLinkClick(event, link) {
		event.preventDefault();
		openLink(link);
	}

	render() {
		const {
			customerList = [],
			onAddButtonClick,
			onEditButtonClick,
		} = this.props;

		return (
			<div className='container-content'>
				<table className='table-all'>
					<thead>
						<tr>
							<th></th>
							<th>Customer</th>
							<th>Credentials</th>
							<th>Web</th>
						</tr>
					</thead>

					<tbody>
						{ customerList.length === 0 &&
							<tr><td style={{ textAlign: 'center' }} colSpan='5'>No customers found</td></tr>
						}

						{ customerList.map((customer,index) =>
							<tr key={ customer.id }>
								<td colSpan='2' style={{ whiteSpace: 'nowrap' }}>
									<span className='edit-button' onClick={ () => onEditButtonClick(customer.id) } style={{ textDecoration: 'none', color: 'black' }}>
										<i className='fa fa-pencil-alt'></i>
									</span>
									<span
										style={{ marginLeft: '10px' }}
									>
										<a
											href={customer.connection}
											onClick={ (event) => {this.onLinkClick(event, customer.connection) }}
										>
										{customer.name}
									</a>
									</span>
								</td>
								<td>
									<pre>{customer.credentials}</pre>
								</td>
								<td>
									{customer.web.split("\n").map(link => 
										<a
											key={index + Math.random()}
											href={link}
											onClick={ (event) => { this.onWebLinkClick(event, link.split('-')[1]) }}
										>
											{ link.split('-')[0] }
											<br/>
										</a>
									)}
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<span onClick={ (e) => onAddButtonClick(e) }><i className='button addButton circle card large fa fa-plus'></i></span>
			</div>
		);
	}
}

export default Table;
