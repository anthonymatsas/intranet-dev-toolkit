import React, { Component } from 'react';
import './style.css';

class Button extends Component {
	render() {
		const {
			onClick,
			className = "",
			text,
			style
		} = this.props;

		return (
			<button style={ style } onClick={onClick} className={className} type="button">{text}</button>
		);
	}
}

export default Button;
