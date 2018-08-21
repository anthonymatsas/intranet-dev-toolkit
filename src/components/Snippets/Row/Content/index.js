import React, { Component } from 'react';
import highlight from 'highlight.js';
import 'highlight.js/styles/xcode.css';

highlight.configure({
	languages: [
		'php',
		'sql',
		'html',
		'javascript',
		'css',
	],
});

class Content extends Component {

	componentDidMount () {
		highlight.initHighlighting.called = false
		highlight.initHighlighting();
	}

	componentDidUpdate () {
		highlight.initHighlighting.called = false
		highlight.initHighlighting();
	}


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
