import React, { Component } from 'react';
import ReactDom from 'react-dom';

import Content from '../Row/Content';

class SubWindow extends Component {
	constructor(props) {
		super(props);

		this.containerElement = document.createElement('div');
		this.externalWindow = null;
	}

	componentDidMount() {
		this.externalWindow = window.open('');
		this.externalWindow.document.body.appendChild(this.containerElement);
	}

	componentWillUnmount() {
		this.externalWindow.close();
	}

	render() {
		const { snippet } = this.props;

		return ReactDom.createPortal(<Content data={ snippet } />, this.containerElement);
	}
}

export default SubWindow;
