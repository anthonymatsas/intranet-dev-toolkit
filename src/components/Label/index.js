import React, { Component } from 'react';

class Label extends Component {
	render() {
		const {
			className = 'small',
			text
		} = this.props;

		return (
			<label className={ className }>{ text }</label>
		)
	}
}

export default Label;
