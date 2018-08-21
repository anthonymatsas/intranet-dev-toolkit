import React, { Component } from 'react';

import Label from '../../Label';
import Input from '../../Input';
import Button from '../../Button';

class Entry extends Component {
	constructor(props) {
		super(props);

		this.state = {
			baseUrlId: '',
			baseUrl: '',
			dashboard: [],
		}

		this.onBaseUrlChange = this.onBaseUrlChange.bind(this);
	}

	onBaseUrlChange(event) {
		const url = event.target.value;

		this.setState({
			baseUrl: url,
		});
	}

	render() {
		const {
			onSubmit,
			onClose,
			dashboard,
			baseUrl
		} = this.props;

		return(
			<div className='modal'>
				<div className='modal-content shadow'>
					<h5>Link Maintenance</h5>
					<hr className='n-fade' />
					<div className='button top-right modal-content-close' onClick={ onClose }>
						<span><i className='fa fa-times'></i></span>
					</div>

					<div className='container'>
						<form
							onSubmit={(event) => {
								this.onSubmit(event)
						}}>

							<div className='row-padding'>
								<Label text='Base URL' />
								<Input
									classList='input'
									inputValue={ baseUrl }
									onChange={ (e) => this.onBaseUrlChange(e) }
									focus={ true }
								/>
							</div>

							<div className='row'>
								{ Object.keys(dashboard).map((dash, index) =>
									<div key={ Math.random() } className='quarter black'>
										<Label text='Section' />
										<Input classList={'input dash-input dash-section'} defaultValue={ dash } />
										<div className='half'><Label text='Name' /></div>
										<div className='half'><Label text='Link' /></div>
										<div className='half'>
											{ Object.keys(dashboard[dash]).map(option =>
												<div key={ dashboard[dash][option].id + Math.random() }>
													<Input
														key={ dashboard[dash][option].id }
														inputType='hidden'
														classList='input dash-input dashId'
														defaultValue={ dashboard[dash][option].id }
													/>
													<Input
														key={ Math.random() + 1 }
														classList={'input dash-input dd dash-description' + dashboard[dash][option].id + ''}
														defaultValue={ dashboard[dash][option].description }
													/>
												</div>
											)}
										</div>

										<div className='half'>
											{ Object.keys(dashboard[dash]).map(option =>
												<Input
													key={ Math.random() + 2 }
													classList={'input dash-input dash-link' + dashboard[dash][option].id + ''}
													defaultValue={ dashboard[dash][option].link }
												/>
											)}
										</div>
									</div>
								)}
							</div>

							{ Object.keys(dashboard).length > 0 &&
								<Button style={{ marginLeft: '2px' }} text='Save' onClick={ (e) => onSubmit(e) } />
							}
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Entry;
