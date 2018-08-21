import React, { Component } from 'react';

import { openLink } from '../../../helpers/link.js';
import getSetting from '../Settings/Entry/helper.js';

import {
	QUICK_CONNECT,
	CONNECTION_FILE_PATH,
} from '../Settings/Entry/constants.js';

const quickStyle = {
	paddingTop: '12px',
	float: 'right',
};

class QuickConnect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			connection: '',
			filesPath: ''
		};

		this.fetchConnection = this.fetchConnection.bind(this);
		this.getConnectionFilePath = this.getConnectionFilePath.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		this.fetchConnection();
		this.getConnectionFilePath();
	}

	onClick(event, link) {
		event.preventDefault()
		openLink(this.state.filesPath + link);
	}

	fetchConnection() {
		getSetting(QUICK_CONNECT, 'link').then((setting) => {
			this.setState({
				connection: setting,
			});
		});
	}

	getConnectionFilePath() {
		getSetting(CONNECTION_FILE_PATH, 'path').then((setting) => {
			this.setState({ filesPath: setting });
		});
	}

	render() {
		const {
			connection,
		} = this.state;

		return (
			<div
				className='button bar-item'
				style={ quickStyle }
				onClick={ (event) => {this.onClick(event, connection) }}
			>
				<i className='fa fa-plug'></i>
			</div>
		);
	}
}

export default QuickConnect;
