import React, { Component } from 'react';

class Content extends Component {
	render() {
		const {
			data
		} = this.props;

		return (
			<div className='container'>
				<pre><code className='small'>{ data }</code></pre>
			</div>
		);
	}
}

export default Content;
