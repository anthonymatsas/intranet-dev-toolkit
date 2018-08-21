import React, { Component } from 'react';

class Textarea extends Component {
	render() {
		const {
			value = '',
			className = '',
			onChange,
			rows = 10,
		} = this.props;

		let classList = className + ' input medium';
		return (
			<textarea rows={rows} className={classList} onChange={onChange} value={value} />
		)
	}
}

export default Textarea;
