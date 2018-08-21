import React, { Component } from 'react';
import Content from './Content';
import './style.css';

class Row extends Component {
	constructor(props) {
		super(props);

		this.state = {
			snippetData: this.props.snippetData,
			showContent: false,
			arrowDown: true,
			arrowUp: false,
		};

		this.onRowClick = this.onRowClick.bind(this);
	}

	onRowClick() {
		var currentShowState = this.state.showContent;
		var newState = null,
			up = null,
			down = null;

		if (! currentShowState) {
			newState = true;
			up = true;
			down = false;
		} else {
			newState = false;
			up = false;
			down = true;
		}

		this.setState({
			showContent: newState,
			arrowUp: up,
			arrowDown: down,
		});
	}

	render() {
		const {
			snippetData,
			showContent,
			arrowUp,
			arrowDown,
		} = this.state;

		const {
			snippetOnRemove,
		} = this.props;

		return (
			<div className='row snippet-row' >
				<div key={ Math.random() } className='snippet-tenth'>
					<span onClick={ snippetOnRemove } ><i className='action fa fa-times'></i></span>

					{ arrowDown &&
						<span onClick={ () => this.onRowClick() } ><i className='action fa fa-arrow-down'></i></span>
					}

					{ arrowUp &&
						<span onClick={ () => this.onRowClick() } ><i className='action fa fa-arrow-up'></i></span>
					}

					<span >{ snippetData.title }</span>
				</div>

				<br/><br/>

				{ showContent &&
					<Content data={ snippetData.snippet } />
				}
			</div>
		);
	}
}

export default Row;
