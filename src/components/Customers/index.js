import React, { Component } from 'react';
import Status from 'react-alert';

import Table from './Table';
import Search from './Search';
import EntryModal from './EntryModal';

import db from '../../helpers/db';
import { statusOptions } from '../../constants/statusOptions';

const customers = [];

class Customers extends Component {
	constructor(props) {
		super(props);

		this.state = {
			results: null,
			searchKey: '',
			searchTerm: '',
			customerList: [],
			showEntryModal: false,
			customerId: null,
		}

		this.onSearchChange = this.onSearchChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.fetchAllCustomers = this.fetchAllCustomers.bind(this);
		this.fetchCustomer = this.fetchCustomer.bind(this);
		this.sortCustomerList = this.sortCustomerList.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.showEntryModal = this.showEntryModal.bind(this);
		this.refreshData = this.refreshData.bind(this);
		this.onEntryCloseButtonClick = this.onEntryCloseButtonClick.bind(this);
		this.onSaveClick = this.onSaveClick.bind(this);
		this.onRemoveClick = this.onRemoveClick.bind(this);
		this.onAddButtonClick = this.onAddButtonClick.bind(this);
		this.onEditButtonClick = this.onEditButtonClick.bind(this);
	}

	componentDidMount() {
		const { searchTerm } = this.state;

		this.setState({ searchKey: searchTerm });
		this.fetchAllCustomers();

		document.addEventListener("keydown", this.onKeyDown, false);
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyDown, false);
	}

	onKeyDown(event) {
		if (event.keyCode === 78 && ! event.target.type) {
			event.preventDefault();
			this.showEntryModal();
		} else if (event.keyCode === 27) {
			this.refreshData();
		}
	}

	onAddButtonClick = () => {
		this.showEntryModal();
	}

	onEditButtonClick(customerId) {
		this.showEntryModal(customerId);
	}

	showEntryModal = (customerId) => {
		var showModal = this.state.showEntryModal;

		if (! showModal) {
			this.setState({
				customerId: customerId,
				showEntryModal: true
			});
		}
	}

	refreshData() {
		this.setState({
			customerId: null,
			showEntryModal: false,
			searchTerm: ''
		});

		this.fetchAllCustomers();
	}

	onEntryCloseButtonClick = () => {
		this.refreshData();

		document.querySelector('.sidenav').style.zIndex = '1';

		if (document.querySelector('.addButton')) {
			document.querySelector('.addButton').style.zIndex = '0';
		}
	}

	onSaveClick = (customerId, customerName, customerCredentials, customerWeb) => {
		if (parseInt(customerId, 10)) {
			this.updateCustomer(customerId, customerName, customerCredentials, customerWeb);
		} else {
			this.addNewCustomer(customerName, customerCredentials, customerWeb);
		}
	}

	updateCustomer(customerId, customerName, customerCredentials, customerWeb) {
		const customer = {
			name: customerName,
			credentials: customerCredentials,
			connection: customerName + '.tnt',
			web: customerWeb,
			modifiedDateTime: Date.now(),
		};
		const id = parseInt(customerId, 10);

		if (! id) {
			this.showStatusMessage('No selected customer to update', 'error');
			return;
		}

		db.table("customers")
			.update(id, customer)
			.then(() =>  {
				this.refreshData();
			});
	}

	addNewCustomer(customerName, customerCredentials, customerWeb) {
		const customer = {
			name: customerName,
			credentials: customerCredentials,
			connection: customerName + '.tnt',
			web: customerWeb,
			modifiedDateTime: Date.now(),
			createdDateTime: Date.now(),
		};

		if (! customerName) {
			return this.showStatusMessage('Customer name required', 'error');
		}

		db.table("customers")
			.add(customer)
			.then((id) => {
				this.refreshData();
			});
	}

	onRemoveClick(customerId) {
		const id = parseInt(customerId, 10);

		if (! id) {
			return;
		}

		db.table("customers")
		.delete(id)
		.then(() => {
			this.refreshData();
		});
	}

	setCustomerlist(result) {
		const { hits, page } = result;
		const { searchKey, results } = this.state;

		const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

		const updatedHits = [
			...oldHits, ...hits
		];

		this.setState({
			results: {
				...results,
				[searchKey]: { hits: updatedHits, page }
			}
		});
	}

	onSearchChange(value) {
		this.setState({ searchTerm: value });
	}

	onSearchClick(event) {
		event.preventDefault();
		const { searchTerm } = this.state;

		this.setState({ searchKey: searchTerm });

		this.fetchCustomer(searchTerm);
	}

	fetchCustomer(searchTerm) {
		if (! searchTerm) {
			return this.fetchAllCustomers();
		}

		db.table("customers")
			.where("name")
			.equals(searchTerm)
			.toArray()
			.then((customerList) => {
				this.sortCustomerList(customerList);
				this.setState({ customerList: customerList });

			}).catch(function (err) {
				this.showStatusMessage(err, 'error');
			});

	}

	fetchAllCustomers() {
		customers.push("");
		db.table("customers")
			.toArray()
			.then((customerList) => {
				this.sortCustomerList(customerList);
				this.setState({ customerList });

				for (var y = 0; y < customerList.length; y++) {
					if (customers.indexOf(customerList[y].name) < 0) {
						customers.push(customerList[y].name);
					}
				}
		});
	}

	sortCustomerList(customerList) {
		customerList.sort(function(a, b) {
			var nameA = a.name.toUpperCase();
			var nameB = b.name.toUpperCase();

			return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
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
			searchKey,
			customerList,
			showEntryModal,
			customerId
		} = this.state;

		return (
			<div>
				<Search
					suggestions={ customers }
					searchTerm={ searchKey }
					onChange={ this.onSearchChange }
					onClick={(e) => this.onSearchClick(e) }
				/>

				<Table
					customerList={ customerList }
					onAddButtonClick={ this.onAddButtonClick }
					onEditButtonClick={ this.onEditButtonClick }
				/>

				{ customerList.length > 0 &&
					<p className='center small'>Total: { customerList.length }</p>
				}

				{ showEntryModal &&
					<EntryModal
						customerId={ customerId }
						titleValue={ 'Customer entry' }
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

export default Customers;
