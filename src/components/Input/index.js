import React, { Component } from 'react';

class Input extends Component {
	componentDidMount() {
		if (this.props.focus) {
			this.input.focus();
		}
	}

	render() {
		const {
			classList,
			inputValue,
			onChange,
			inputType = 'text',
			onKeyDown,
			defaultValue
		} = this.props;

		var classes = classList + ' medium';

		return (
			<input
				ref={(input) => { this.input = input; }}
				className={classes}
				type={inputType}
				value={inputValue}
				onChange={onChange}
				onKeyDown={onKeyDown}
				defaultValue={defaultValue}
			/>
		)
	}
}

export default Input;
