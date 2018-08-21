import React, { Component } from 'react';
import ReactDom from 'react-dom';

import Content from '../Row/Content';

import highlight from 'highlight.js';
import 'highlight.js/styles/xcode.css';

highlight.configure({
	languages: [
		'sql',
		'php',
		'html',
		'javascript',
		'css',
	],
});

class SubWindow extends Component {
	constructor(props) {
		super(props);

		this.containerElement = document.createElement('div');
		this.externalWindow = null;
	}

	componentDidMount() {
		highlight.initHighlighting.called = false
		this.externalWindow = window.open('');

		this.externalWindow.document.body.appendChild(this.containerElement);

		highlight.initHighlightingOnLoad();
	}

	componentWillUnmount() {
		this.externalWindow.close();
	}

	componentDidUpdate () {
		highlight.initHighlighting.called = false
		highlight.initHighlightingOnLoad();
	}

	render() {
		const { snippet } = this.props;

		return ReactDom.createPortal(<Content data={ snippet } />, this.containerElement);
	}
}

export default SubWindow;
