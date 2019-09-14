import React, { Component } from 'react';

import Button from '../../../../Button';

class Module extends Component {
	render() {
		const {
			isCustomersOn,
			isTimeOn,
			isSnippetsOn,
			onModuleChange,
			saveActiveModules,
		} = this.props;

		return (
			<div className="third">
				<h5>Modules</h5>
				<div className='settings'>
					<table>
						<tbody>
							<tr>
								<td><label className='setting-label'>Customers:</label></td>
								<td>
									<label className='switch'>
										<input
											name="isCustomersOn"
											type="checkbox"
											checked={ isCustomersOn }
											onChange={ (e) => onModuleChange(e) }
										/>
										<span className='slider round'></span>
									</label>
								</td>
							</tr>
							<tr>
								<td><label className='setting-label'>Time:</label></td>
								<td>
									<label className='switch'>
										<input
											name="isTimeOn"
											type="checkbox"
											checked={ isTimeOn }
											onChange={ (e) => onModuleChange(e) }
										/>
										<span className='slider round'></span>
									</label>
								</td>
							</tr>
							<tr>
								<td><label className='setting-label'>Snippets:</label></td>
								<td>
									<label className='switch'>
										<input
											name="isSnippetsOn"
											type="checkbox"
											checked={ isSnippetsOn }
											onChange={ (e) => onModuleChange(e) }
										/>
										<span className='slider round'></span>
									</label>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<Button style={{ width: '30%' }} text='Save' onClick={ (e) => saveActiveModules(e) }/>
			</div>
		);
	}
}

export default Module;
