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
			customerId: props.customerId ? props.customerId : null,
			customerName: '',
			customerCredentials: '',
			customerWeb: '',
		};

		this.onCustomerNameChange = this.onCustomerNameChange.bind(this);
		this.onCustomerCredentialsChange = this.onCustomerCredentialsChange.bind(this);
		this.onCustomerWebChange = this.onCustomerWebChange.bind(this);
		this.fetchCustomer = this.fetchCustomer.bind(this);
		this.clearValues = this.clearValues.bind(this);
	}

	componentDidMount() {
		const { customerId } = this.state;
		const id = parseInt(customerId, 10);

		if (id) {
			this.fetchCustomer(id);
		} else {
			this.clearValues();
		}
	}

	clearValues() {
		this.setState({
			customerId: '',
			customerName: '',
			customerCredentials: '',
			customerWeb: '',
		});
	}

	fetchCustomer(customerId) {
		db.table("customers")
			.where("id")
			.equals(customerId)
			.toArray()
			.then((customer) => {
				var foundCustomer = customer[0];
				this.setState({
					customerId: foundCustomer.id,
					customerName: foundCustomer.name,
					customerCredentials: foundCustomer.credentials,
					customerWeb: foundCustomer.web,
				});

			}).catch(function (err) {
				this.showStatusMessage(err, 'error');
			});
	}

	onCustomerNameChange(event) {
		const name = event.target.value;

		this.setState({
			customerName: name,
		});
	}

	onCustomerCredentialsChange(event) {
		const credentials = event.target.value;

		this.setState({
			customerCredentials: credentials,
		});
	}

	onCustomerWebChange(event) {
		const web = event.target.value;

		this.setState({
			customerWeb: web,
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
			customerId,
			customerName,
			customerCredentials,
			customerWeb
		} = this.state;

		const {
			onClose,
			onSave,
			onRemove,
		} = this.props;

		return (
			<div className='modal'>
				<div className='modal-content shadow'>
					<h5>Customer Entry</h5>
					<hr className='n-fade' />
					<div className='button top-right modal-content-close' onClick={ onClose }>
						<span><i className='fa fa-times'></i></span>
					</div>

					<div className='container'>
						<Label text='Customer' />
						<Input classList='input' onChange={ (e) => this.onCustomerNameChange(e) } inputValue={ customerName} focus={ true } />
						<Label text='Credentials' />
						<Textarea onChange={ (e) => this.onCustomerCredentialsChange(e) } value={ customerCredentials }/>
						<Label text='Web' />
						<Textarea onChange={ (e) => this.onCustomerWebChange(e) } value={ customerWeb } />
						<Button text='Save' onClick={ () => onSave(customerId, customerName, customerCredentials, customerWeb) }/>
						{customerId &&
							<Button style={{ marginLeft: '2px' }} text='Remove' onClick={ () => onRemove(customerId) }/>
						}
						<Status ref={e => this.message = e} {...statusOptions} />
					</div>
				</div>
			</div>
		)
	}
}

export default EntryModal;
