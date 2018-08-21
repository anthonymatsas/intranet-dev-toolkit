import React, { Component } from 'react';

import Label from '../../Label';
import Input from '../../Input';
import Textarea from '../../Textarea';
import Button from '../../Button';

class Modal extends Component {
	render() {
		const {
			titleValue,
			titleOnChange,
			snippetValue,
			snippetOnChange,
			snippetOnSave,
			snippetOnClose,
		} = this.props;

		return(
			<div className='modal'>
				<div className='modal-content shadow'>
					<h5>New Snippet</h5>
					<hr className='n-fade' />
					<div className='button top-right modal-content-close' onClick={ snippetOnClose }>
						<span><i className='fa fa-times'></i></span>
					</div>
					<div className='container'>
						<Label text='Title' />
						<Input classList='input' onChange={ titleOnChange } inputValue={ titleValue } focus={ true }/>
						<Label text='Snippet' />
						<Textarea onChange={ snippetOnChange } value={ snippetValue } />
						<Button text='Save' onClick={ snippetOnSave } />
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;
