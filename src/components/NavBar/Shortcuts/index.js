import React, { Component } from 'react';
import Entry from './Entry';

class Shortcuts extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showEntryModal: false,
		};

		this.onClick = this.onClick.bind(this);
		this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	componentDidMount() {
		document.addEventListener("keydown", this.onKeyDown, false);
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyDown, false);
	}

	onKeyDown(event) {
		if (event.keyCode === 27) {
			this.setState({ showEntryModal: false });
			document.querySelector('.sidenav').style.zIndex = '1';

			if (document.querySelector('.addButton')) {
				document.querySelector('.addButton').style.zIndex = '0';
			}
		}

		if (event.ctrlKey && event.keyCode == 75 && !event.target.type) {
			this.showShortcuts();
		}
	}

	onClick = (event) => {
		event.preventDefault()
		var showModal = this.state.showEntryModal;

		if (! showModal) {
			this.showShortcuts();
		}
	}

	showShortcuts = () => {
		this.setState({ showEntryModal: true });
		document.querySelector('.sidenav').style.zIndex = '-1';
		if (document.querySelector('.addButton')) {
			document.querySelector('.addButton').style.zIndex = '-1';
		}
	}

	onCloseButtonClick = () => {
		this.setState({ showEntryModal: false });
		document.querySelector('.sidenav').style.zIndex = '1';

		if (document.querySelector('.addButton')) {
			document.querySelector('.addButton').style.zIndex = '0';
		}
	}

	render() {
		const {
			showEntryModal,
		} = this.state;

		return (
			<div>
				<div
					className='button bar-item'
					style={{ paddingTop: '12px', float: 'right', }}
					onClick={ (event) => {this.onClick(event) }}
				>
					<i className='fa fa-keyboard'></i>
				</div>

				{ showEntryModal && 
					<Entry
						titleValue={ 'Shortcuts' }
						onClose={ e => this.onCloseButtonClick() }
					/>
				}
			</div>
		);
	}
}

export default Shortcuts;
