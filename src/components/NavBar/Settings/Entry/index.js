import React, { Component } from 'react';

import Modal from './Modal';
import Connection from './Connection';
import Data from './Data';
import Module from './Modules';

import Status from 'react-alert';
import db from '../../../../helpers/db';

import {
	QUICK_CONNECT,
	CONNECTION_FILE_PATH,
	MODULES
} from './constants.js';

import './style.css';
import { statusOptions } from '../../../../constants/statusOptions';

const remote = window.require('electron').remote;

class Entry extends Component {
	constructor(props) {
		super(props);

		this.state = {
			files: '',
			uploadDataOption: '',
			clearDataOption: '',
			downloadDataOption: '',
			currentQuickConnectionId: '',
			currentQuickConnection: '',
			connectFilePathId: '',
			connectFilePath: '',
			settings: [],
			modulesId: '',
			isCustomersOn: false,
			isTimeOn: false,
			isSnippetsOn: false,
			showInfoModal: false,
		}

		this.onUploadSelectChange = this.onUploadSelectChange.bind(this);
		this.onClearSelectChange = this.onClearSelectChange.bind(this);
		this.onUploadClick = this.onUploadClick.bind(this);
		this.onClearClick = this.onClearClick.bind(this);
		this.onDownloadSelectChange = this.onDownloadSelectChange.bind(this);
		this.onDownloadClick = this.onDownloadClick.bind(this);
		this.saveQuickConnect = this.saveQuickConnect.bind(this);
		this.saveConnectFilePath = this.saveConnectFilePath.bind(this);
		this.onQuickConnectChange = this.onQuickConnectChange.bind(this);
		this.onConnectFilePathChange = this.onConnectFilePathChange.bind(this);
		this.fetchAllSettings = this.fetchAllSettings.bind(this);
		this.updateQuickConnection = this.updateQuickConnection.bind(this);
		this.addNewQuickConnection = this.addNewQuickConnection.bind(this);
		this.onModuleChange = this.onModuleChange.bind(this);
		this.saveActiveModules = this.saveActiveModules.bind(this);
	}

	componentDidMount() {
		this.fetchAllSettings();
	}

	fetchAllSettings() {
		db.table("settings")
			.toArray()
			.then(allSettings => {
				this.setState({
					settings: allSettings,
				});

				//Will be changed to accomadate all settings
				//Once more are stored
				for (var i in allSettings) {
					var currentSetting = allSettings[i];
					if (currentSetting.type === QUICK_CONNECT) {
						this.setState({ 
							currentQuickConnectionId: currentSetting.id,
							currentQuickConnection: currentSetting.data.link,
						});

					} else if (currentSetting.type === CONNECTION_FILE_PATH) {
						this.setState({
							connectFilePathId: currentSetting.id,
							connectFilePath: currentSetting.data.path,
						});
					} else if (currentSetting.type === MODULES) {
						this.setState({
							modulesId: currentSetting.id,
							isCustomersOn: currentSetting.data.customers,
							isTimeOn: currentSetting.data.time,
							isSnippetsOn: currentSetting.data.snippets,
						});
					}
				}
			});
	}

	onUploadSelectChange(event) {
		const uploadOption = event.target.value;

		this.setState({
			uploadDataOption: uploadOption,
		});
	}

	onClearSelectChange(event) {
		const clearOption = event.target.value;

		this.setState({
			clearDataOption: clearOption,
		});
	}

	onUploadClick(event) {
		event.preventDefault();
		if (! this.state.uploadDataOption) {
			return this.showStatusMessage('No table selected', 'error');
		}

		const file = document.querySelector('#fileInput').files[0]

		var fileReader = new FileReader();
		fileReader.onload = (e) => {
			var fileContent = e.target.result;
			var uploadedData = JSON.parse(fileContent);

			if (uploadedData) {
				this.showStatusMessage('Upload Started...', 'info');
				uploadedData.sort(function orderByCustomer(a, b) {
				if (a.customer < b.customer) {
					return -1;
				} else if (a.customer > b.customer) {
					return 1;
				}

					return 0;
				});

				for (var i in uploadedData) {
					var data = uploadedData[i];

					db.table(this.state.uploadDataOption).add(data)
				}

				this.showStatusMessage('Upload Complete', 'success');
				this.refreshCurrentWindow();
			}
		};
		
		fileReader.readAsText(file);
	}

	onClearClick(event) {
		event.preventDefault()
		if (! this.state.clearDataOption) {
			return this.showStatusMessage('No table selected', 'error');
		}

		db.table(this.state.clearDataOption).clear();
		this.showStatusMessage('Table ' + this.state.clearDataOption + ' cleared', 'success');
		this.refreshCurrentWindow();
	}

	showStatusMessage(message, type) {
		this.message.show(message, {
			time: 2000,
			type: type,
		});
	}

	onDownloadSelectChange(event) {
		const downloadOption = event.target.value;

		this.setState({
			downloadDataOption: downloadOption,
		});
	}

	onDownloadClick(event) {
		event.preventDefault();
		if (! this.state.downloadDataOption) {
			return this.showStatusMessage('No table selected', 'error');
		}

		const exportElement = document.createElement('p');
		exportElement.innerHTML = 'exporting db...';

		db.table(this.state.downloadDataOption)
			.toArray()
			.then((results) => {
				this.exportDB(results);
			}).catch(function (err) {
				return this.showStatusMessage(err, 'error');
			});
	};

	onModuleChange(event) {
		const target = event.target;
		const value = target.checked;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	saveQuickConnect(event) {
		event.preventDefault();

		const connection = this.state.currentQuickConnection;

		if (this.state.currentQuickConnectionId) {
			this.updateQuickConnection(connection);
		} else {
			this.addNewQuickConnection(connection);
		}

		this.fetchAllSettings();
		this.showStatusMessage('Quick connect saved', 'success');
		this.refreshCurrentWindow();
	}

	updateQuickConnection(connection) {
		const id = parseInt(this.state.currentQuickConnectionId, 10);

		db.table("settings").update(id, { data: { link: connection } });
	}

	addNewQuickConnection(connection) {
		const quickConnectionSetting = {
			type: 'quickConnect',
			data: {
				link: connection,
			}
		};

		db.table("settings").add(quickConnectionSetting);
	}

	saveConnectFilePath(event) {
		const path = this.state.connectFilePath;

		if (this.state.connectFilePathId) {
			this.updateConnectFilePath(path);
		} else {
			this.addNewConnectFilePath(path);
		}

		this.fetchAllSettings();
		this.showStatusMessage('Connection file path saved', 'success');
		this.refreshCurrentWindow();
	}

	updateConnectFilePath(path) {
		const id = parseInt(this.state.connectFilePathId, 10);

		db.table("settings").update(id, { data: { path: path } });
	}

	addNewConnectFilePath(path) {
		const connectFilePathSetting = {
			type: 'connectionFilePath',
			data: {
				path: path,
			}
		};

		db.table("settings").add(connectFilePathSetting);
	}

	onQuickConnectChange(event) {
		const connection = event.target.value;

		this.setState({
			currentQuickConnection: connection
		});
	}

	onConnectFilePathChange(event) {
		const path = event.target.value;

		this.setState({
			connectFilePath: path
		});
	}

	exportDB(downloadData) {
		var date = new Date(),
			m = date.getMonth() + 1,
			d = date.getDate(),
			y = date.getFullYear(),
			s = date.getSeconds(),
			fileName = this.state.downloadDataOption + "_" + m + "_" + d + "_" + y + "_" + s + ".json";

		var link = document.createElement('a');
			link.setAttribute('href', 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(downloadData)));
			link.setAttribute('title', 'file');
			link.setAttribute('download', fileName);
			link.setAttribute('class', 'link');
			link.innerHTML = fileName;

		var downloadLink = document.querySelector('#downloadLink');

		downloadLink.innerHTML = '';
		downloadLink.classList.remove("no-show")
		downloadLink.appendChild(link);
		downloadLink.appendChild(document.createElement('br'));
	}

	saveActiveModules(event) {
		event.preventDefault();

		const {
			modulesId,
			isCustomersOn,
			isTimeOn,
			isSnippetsOn,
		} = this.state;

		const modules = {
			type: 'modules',
			data: {
				customers: isCustomersOn,
				time: isTimeOn,
				snippets: isSnippetsOn,
			}
		};


		if (modulesId) {
			const id = parseInt(modulesId, 10);

			db.table("settings").update(id, { data: modules.data });
		} else {
			db.table("settings").add(modules);
		}

		this.showStatusMessage('Modules updated', 'success');
		this.refreshCurrentWindow();
	}

	refreshCurrentWindow() {
		this.setState({ showInfoModal: true });

		setTimeout(() => {
			remote.app.relaunch();
			remote.app.exit(0);
		}, 5000);
	}

	render() {
		const {
			uploadDataOption,
			clearDataOption,
			downloadDataOption,
			currentQuickConnection,
			connectFilePath,
			showInfoModal
		} = this.state;

		const { onClose } = this.props;

		return(
			<div className='modal'>
				<div className='modal-content shadow'>
					<h5>System Settings</h5>
					<hr className='n-fade' />

					<p className='x-small center'><i>⌘/Ctrl + H - opens help window</i></p>

					<div className='button top-right modal-content-close' onClick={ onClose }>
						<span><i className='fa fa-times'></i></span>
					</div>

					{ showInfoModal &&
						<Modal message={ 'Application will refresh in 5 seconds for changes to take effect...' } />
					}

					<div className='container'>
						<div className="container">
							<div className="row">
								<Connection
									saveConnectFilePath={ this.saveConnectFilePath }
									onConnectFilePathChange={ this.onConnectFilePathChange }
									saveQuickConnect={ this.saveQuickConnect }
									onQuickConnectChange={ this.onQuickConnectChange }
									connectFilePath={ connectFilePath }
									currentQuickConnection={ currentQuickConnection }
								/>

								<Data
									onDownloadSelectChange={ this.onDownloadSelectChange }
									onDownloadClick={ this.onDownloadClick }
									onUploadClick={ this.onUploadClick }
									onUploadSelectChange={ this.onUploadSelectChange }
									onClearSelectChange={ this.onClearSelectChange }
									onClearClick={ this.onClearClick }
									downloadDataOption={ downloadDataOption }
									uploadDataOption={uploadDataOption }
									clearDataOption={ clearDataOption }
								/>

								<Module
									isCustomersOn={ this.state.isCustomersOn }
									isTimeOn={ this.state.isTimeOn }
									isSnippetsOn={ this.state.isSnippetsOn }
									onModuleChange={ this.onModuleChange }
									saveActiveModules={ this.saveActiveModules }
								/>
							</div>

						</div>
					</div>
					<Status ref={e => this.message = e} {...statusOptions} />
				</div>
			</div>
		);
	}
}

export default Entry;
