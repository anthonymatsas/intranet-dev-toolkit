import React, { Component } from 'react';

import Button from '../../../../Button';

class Data extends Component {
	render() {
		const {
			onDownloadSelectChange,
			onDownloadClick,
			onUploadClick,
			onUploadSelectChange,
			onClearSelectChange,
			onClearClick,
			downloadDataOption,
			uploadDataOption,
			clearDataOption
		} = this.props;

		return (
			<div className="third">
				<h5>Data</h5>
				<div className='settings'>
					<label className='setting-label'>Download Data:</label><br/>
					<select value={ downloadDataOption } onChange={ (e) => onDownloadSelectChange(e) }>
						<option value=''></option>
						<option value='customers'>Customers</option>
						<option value='dashboard'>Dashboard</option>
						<option value='settings'>Settings</option>
						<option value='snippets'>Snippets</option>
						<option value='time'>Time</option>
					</select><br/>
					<div id="downloadStatus" className="small no-show"></div>
					<div id="downloadLink" className="small no-show"></div>
					<Button style={{ width: '30%' }} text='Download'  onClick={ (e) => onDownloadClick(e) }/>
				</div>

				<form onSubmit={(event) => onUploadClick(event) }>
					<div className='settings'>
						<label className='setting-label'>Upload Data:&nbsp;</label>
						<input id="fileInput" type='file' accept='.json' /><br/>
						<select value={ uploadDataOption } onChange={ (e) => onUploadSelectChange(e) }>
							<option value=''></option>
							<option value='customers'>Customers</option>
							<option value='dashboard'>Dashboard</option>
							<option value='settings'>Settings</option>
							<option value='snippets'>Snippets</option>
							<option value='time'>Time</option>
						</select><br/>
						<Button style={{ width: '30%' }} text='Upload'  onClick={ (e) => onUploadClick(e) }/>
					</div>
				</form>

				<div className='settings'>
					<label className='setting-label'>
						Clear Data: <span className='setting-error'>(Warning: Existing data will be lost!)</span>
					</label>
					<br/>
					<select value={ clearDataOption } onChange={ (e) => onClearSelectChange(e) }>
						<option value=''></option>
						<option value='customers'>Customers</option>
						<option value='dashboard'>Dashboard</option>
						<option value='settings'>Settings</option>
						<option value='snippets'>Snippets</option>
						<option value='time'>Time</option>
					</select><br/>
					<Button style={{ width: '30%' }} text='Clear'  onClick={ (e) => onClearClick(e) }/>
				</div>
			</div>
		);
	}
}

export default Data;
