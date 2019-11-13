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
			defaultValue,
			name,
			id
		} = this.props;

		var classes = classList + ' medium';

		return (
			<input
				id={id}
				ref={(input) => { this.input = input; }}
				className={classes}
				type={inputType}
				value={inputValue}
				onChange={onChange}
				onKeyDown={onKeyDown}
				defaultValue={defaultValue}
				name={name}
			/>
		)
	}
}

export default Input;
