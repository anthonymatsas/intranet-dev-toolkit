import React, { Component } from 'react';

import Input from '../../../../Input';
import Button from '../../../../Button';

class Connection extends Component {
	render() {
		const {
			saveConnectFilePath,
			onConnectFilePathChange,
			saveQuickConnect,
			onQuickConnectChange,
			connectFilePath,
			currentQuickConnection,
		} = this.props;

		return (
			<div className="third">
				<h5>Connection</h5>
				<form onSubmit={ (e) => saveConnectFilePath(e) }>
					<div className='settings'>
						<label className='setting-label'>File Path:</label><br/>
						<Input
							classList='setting-input setting-path-input'
							onChange={ (e) => onConnectFilePathChange(e) }
							inputValue={ connectFilePath }
							focus={ true }
						/>
						<Button style={{ width: '30%' }} text='Save'  onClick={ (e) => saveConnectFilePath(e) }/>
					</div>
				</form>

				<form onSubmit={ (e) => saveQuickConnect(e) }>
					<div className='settings'>
						<label className='setting-label'>Quick Connection:</label><br/>
						<Input
							classList='setting-input'
							onChange={ (e) => onQuickConnectChange(e) }
							inputValue={ currentQuickConnection }
						/>
						<Button style={{ width: '30%' }} text='Save'  onClick={ (e) => saveQuickConnect(e) }/>
					</div>
				</form>
			</div>
		);
	}
}

export default Connection;
