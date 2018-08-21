import React, { Component } from 'react';
import Entry from './Entry';

const quickStyle = {
	paddingTop: '12px',
	float: 'right',
};

class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showEntryModal: false,
		}

		this.onGearIconClick = this.onGearIconClick.bind(this);
		this.onEditCloseButtonClick = this.onEditCloseButtonClick.bind(this);
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
	}

	onGearIconClick = () => {
		var showModal = this.state.showEntryModal;

		if (! showModal) {
			this.setState({ showEntryModal: true });
			document.querySelector('.sidenav').style.zIndex = '-1';
			if (document.querySelector('.addButton')) {
				document.querySelector('.addButton').style.zIndex = '-1';
			}
		}
	}

	onEditCloseButtonClick = () => {
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
					style={ quickStyle }
					onClick={ e => this.onGearIconClick() }
				>
					<i className='fa fa-cogs'></i>
				</div>

				{ showEntryModal && 
					<Entry
						titleValue={ 'Settings' }
						onClose={ e => this.onEditCloseButtonClick() }
					/>
				}
			</div>
		);
	}
}

export default Settings;
