import React, { Component } from 'react';
import Input from '../../../Input';
import Button from '../../../Button';
import Modal from './Modal';

import Status from 'react-alert';
import { statusOptions } from '../../../../constants/statusOptions';

import db from '../../../../helpers/db';
import { getSetting } from '../../Settings/Entry/helper.js';

const defaultShortcuts = {
	'devTools': {
		name: 'devTools',
		action: 'Opens development tools',
		keys: '⌘/Ctrl + I',
		editable: false,
	},
	'help': {
		name: 'help',
		action: 'Opens help window',
		keys: '⌘/Ctrl + H',
		editable: false,
	},
	'settings': {
		name: 'settings',
		action: 'Opens settings',
		keys: 'Ctrl + S',
		editable: false,
	},
	'shortCuts': {
		name: 'shortCuts',
		action: 'Opens keyboard shortcut maintenance',
		keys: 'Ctrl + K',
		editable: false,
	},
	'sideNav': {
		name: 'sideNav',
		action: 'Opens side navigation maintenance',
		keys: 'Ctrl + D',
		editable: false,
	},
	'openEntry': {
		name: 'openEntry',
		action: 'Opens entry/maintenance dialogs',
		keys: 'n/N',
		editable: false,
	},
	'closeEntry': {
		name: 'closeEntry',
		action: 'Closes entry/maintenance dialogs',
		keys: 'ESC',
		editable: false,
	},
	'nextModule': {
		name: 'nextModule',
		action: 'Go to next module',
		keys: 'Ctrl + Tab',
		editable: false,
	},
	'prevModule': {
		name: 'prevModule',
		action: 'Go to previous module',
		keys: 'Ctrl + Shift + Tab',
		editable: false,
	},
};

const remote = window.require('electron').remote;

class Entry extends Component {
	constructor(props) {
		super(props);

		this.state = {
			shortcuts: [],
			showInfoModal: false,
		};

		this.fetchShortcuts = this.fetchShortcuts.bind(this);
		this.saveShortcuts = this.saveShortcuts.bind(this);
	}

	componentDidMount() {
		this.fetchShortcuts();
	}

	fetchShortcuts = () => {
		getSetting('shortcuts').then((fetchedShortcuts) => {
			this.setState({
				shortcuts: fetchedShortcuts
			});
		})
		.then(() => {
			if (! Object.keys(this.state.shortcuts).length) {
				this.saveShortcuts(defaultShortcuts);
			}
		});
	}

	saveShortcuts = (shortcuts) => {
		const shortcutData = {
			type: 'shortcuts',
			data: shortcuts
		};

		db.table("settings").add(shortcutData);

		this.showStatusMessage('Shortcuts updated', 'success');
		this.refreshCurrentWindow();
	}

	refreshCurrentWindow() {
		this.setState({ showInfoModal: true });

		setTimeout(() => {
			remote.app.relaunch();
			remote.app.exit(0);
		}, 5000);
	}

	showStatusMessage(message, type) {
		this.message.show(message, {
			time: 2000,
			type: type,
		});
	}

	render() {
		const { shortcuts, showInfoModal } = this.state;
		const { onClose } = this.props;

		return(
			<div className='modal'>
				<div className='modal-content shadow'>
					<h5>Keyboard Shortcuts</h5>
					<hr className='n-fade' />

					<div className='button top-right modal-content-close' onClick={ onClose }>
						<span><i className='fa fa-times'></i></span>
					</div>

					{ showInfoModal &&
						<Modal message={ 'Application will refresh in 5 seconds for changes to take effect...' } />
					}

					<div className='container'>
						<form>
							<table className='small table-all'>
								<thead>
									<tr>
										<th>Action</th>
										<th>Keys</th>
									</tr>
								</thead>

								<tbody>
									{ Object.keys(shortcuts).map((shortcut, index) =>
										<tr key={ Math.random() } >
											<td>{ shortcuts[shortcut].action }</td>
											{
												shortcuts[shortcut].editable === true
												? (<td>
														<Input
															classList='input'
															inputValue={ shortcuts[shortcut].keys }
															onChange={ (e) => this.onKeyChange(e) }
															name={ shortcut }
														/>
													</td>)
												: (<td>{ shortcuts[shortcut].keys }</td>)
											}
										</tr>
									)}
								</tbody>
							</table>
						</form>
					</div>

				</div>

				<Status ref={e => this.message = e} {...statusOptions} />
			</div>
		);
	}
}

export default Entry;
