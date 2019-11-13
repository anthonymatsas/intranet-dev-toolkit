import React, { Component } from 'react';

import Status from 'react-alert';
import Entry from './Entry';

import db from '../../helpers/db';
import { statusOptions } from '../../constants/statusOptions';
import { openLink } from '../../helpers/link.js';
import { BASE_URL } from '../NavBar/Settings/Entry/constants.js';
import { EMAIL_URL } from './constants';

import { getSetting } from '../NavBar/Settings/Entry/helper.js';

class SideNav extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dashboard: [],
			maintainDashboard: [],
			showEntryModal: false,
			baseUrlId: '',
			baseUrl: '',
			shortcut: []
		}

		this.fetchAllDashOptions = this.fetchAllDashOptions.bind(this);
		this.generateLinks = this.generateLinks.bind(this);
		this.onLinkClick = this.onLinkClick.bind(this);
		this.onEditButtonClick = this.onEditButtonClick.bind(this);
		this.onEditCloseButton = this.onEditCloseButton.bind(this);
		this.fetchAllOptionsToMaintain = this.fetchAllOptionsToMaintain.bind(this);
		this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.fetchKeyboardShortcut = this.fetchKeyboardShortcut.bind(this);
	}

	componentDidMount() {
		this.fetchAllDashOptions();
		this.fetchKeyboardShortcut();
		document.addEventListener("keydown", this.onKeyDown, false);
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyDown, false);
	}

	onKeyDown(event) {
		if (event.keyCode === 27) {
			this.setState({ showEntryModal: false });
		}

		if (event.ctrlKey && event.keyCode === 68 && !event.target.type) {
			this.setState({ showEntryModal: true });
			this.fetchAllOptionsToMaintain();
		}
	}

	onLinkClick(event) {
		event.preventDefault();

		let link = event.target.href;
		openLink(link);
	}

	onEditButtonClick = () => {
		var showModal = this.state.showEntryModal;

		if (! showModal) {
			this.setState({ showEntryModal: true });
			this.fetchAllOptionsToMaintain();
		}
	}

	fetchAllOptionsToMaintain() {
		const groupedDashOptions = [];
		db.table("dashboard")
			.toArray()
			.then(dashOptions => {

				for (var i in dashOptions) {
					var dash = dashOptions[i];
					if (! groupedDashOptions[dash.title]) {
						groupedDashOptions[dash.title] = [];
					}

					groupedDashOptions[dash.title].push({
						id: dash.id,
						description: dash.description,
						link: dash.link
					});
				}

				this.setState({ maintainDashboard: groupedDashOptions });
		});

		db.table("settings")
			.toArray()
			.then(settings => {
				for (var i in settings) {
					if (settings[i].type === BASE_URL) {
						this.setState({
							baseUrlId: settings[i].id,
							baseUrl: settings[i].data.url,
						});
					}
				}
			});
	}

	fetchKeyboardShortcut = () => {
		getSetting('shortcuts', 'sideNav').then((shortcut) => {
			this.setState({
				shortcut: shortcut
			});
		});
	}

	onEditCloseButton = () => {
		this.setState({ showEntryModal: false });
	}

	showStatusMessage(message, type) {
		this.message.show(message, {
			time: 2000,
			type: type,
		});
	}

	onSaveButtonClick = (e) => {
		e.preventDefault();

		var dashData = [];
		const idInputs = document.querySelectorAll('.dashId');
		for (var i = 0; i < idInputs.length; i++) {
			var dashId = parseInt(idInputs[i].value, 10);

			var dashLinkElement = document.querySelector('.dash-link' + dashId);
			var dashDescriptionElement = document.querySelector('.dash-description' + dashId);

			var dashLink = dashLinkElement.value;
			var dashDescription = dashDescriptionElement.value;

			switch (true) {
				case (i === 0):
				case (i === 8):
				case (i === 16):
				case (i === 24):
				case (i === 32):
					var section = dashDescriptionElement.parentNode
						.parentNode
						.previousSibling
						.previousSibling
						.previousSibling
						.value;
					break;
				default:
					break;
			}

			if (dashId) {
				dashData.push({
					id: dashId,
					title: section,
					description: dashDescription,
					link: dashLink,
					modifiedDateTime: Date.now(),
					createdDateTime: Date.now() + Math.random(),
				});
			}
		}

		var baseUrlId = parseInt(this.state.baseUrlId, 10);
		if (baseUrlId) {
			db.table("settings").update(baseUrlId, { data: { url: this.state.baseUrl } });
		} else {
			const baseUrlData = {
				type: 'baseUrl',
				data: {
					url: this.state.baseUrl
				}
			};

			db.table("settings").add(baseUrlData);
		}

		db.table("dashboard").bulkPut(dashData).then(() => {
			this.setState({ showEntryModal: false });
			this.fetchAllDashOptions();
		});
	}

	fetchAllDashOptions() {
		const groupedDashOptions = [];
		db.table("settings")
			.toArray()
			.then(settings => {
				for (var i in settings) {
					if (settings[i].type === BASE_URL) {
						const baseUrl = settings[i].data.url;
						db.table("dashboard")
							.toArray()
							.then(dashOptions => {

								for (var i in dashOptions) {
									var dash = dashOptions[i];
									if (dash.title !== "") {
										if (! groupedDashOptions[dash.title]) {
											groupedDashOptions[dash.title] = [];
										}

										var url = dash.link;
										if (url.search("http") < 0) {
											url = baseUrl + url;
										}

										groupedDashOptions[dash.title].push({
											id: dash.id,
											description: dash.description,
											link: url
										});
									}
								}

								this.setState({ dashboard: groupedDashOptions });
						});
					}
				}
			});
	}

	onEmailClick = (e) => {
		e.preventDefault();
		window.open(EMAIL_URL, '_blank');
	}

	generateLinks(dashboard) {
		let list = [];
		let emailAdded = false;
		list.push(<hr key={ Math.random() } className='b-fade' />);

		for (var dash in dashboard) {
			var detail = dashboard[dash];

			list.push(<h7 className='s-title' key={ Math.random() }>{ dash }</h7>);
			list.push(<hr key={ Math.random() } className='b-fade' />);
			if (! emailAdded) {
				list.push(<a
					key={ Math.random() }
					href="#"
					onClick={ (e) => { this.onEmailClick(e) }}
					>
						{ 'Email' }
					</a>
				);
				emailAdded = true;
			}

			for (var d in detail) {
				if (detail[d].description !== '') {
					list.push(<a
						key={ Math.random() }
						href={ detail[d].link }
						onClick={ (e) => {this.onLinkClick(e) }}
						>
							{ detail[d].description }
						</a>);
				}
			}

			list.push(<hr key={ Math.random() } className='b-fade' />);
		}

		list.push(
			<div key={ Math.random() } className='sidebar-bottom' onClick={ () => this.onEditButtonClick() }>
				<i className='fa fa-pencil-alt'></i>
 			</div>
		);

		return list;
	}

	render() {
		const {
			dashboard,
			maintainDashboard,
			showEntryModal,
			baseUrl,
			baseUrlId
		} = this.state;

		return (
			<div className='sidenav'>
				{ this.generateLinks(dashboard) }

				{ showEntryModal && 
					<Entry
						titleValue={ 'Sidenav Entry' }
						onClose={ e => this.onEditCloseButton() }
						onSubmit={ e => this.onSaveButtonClick(e) }
						dashboard={ maintainDashboard }
						baseUrl={ baseUrl }
						baseUrlId={ baseUrlId }
					/>
				}

				<Status ref={e => this.message = e} {...statusOptions} />
			</div>
		);
	}
}

export default SideNav;
