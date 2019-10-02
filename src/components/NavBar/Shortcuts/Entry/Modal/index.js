import React, { Component } from 'react';

import './style.css';

class Modal extends Component {
	render() {
		const { message } = this.props;

		return(
			<div className='modal'>
				<div className='modal-content shadow modal-small' style={{ backgroundColor: '#ffffcc' }}>
					<h5>Info</h5>
					<hr className="n-fade" />
					<div className='container'>
						<p>{ message }</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;
