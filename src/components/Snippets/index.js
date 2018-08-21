import React, { Component } from 'react';

import Row from './Row';
import Modal from './Modal';

import db from '../../helpers/db';

class Snippets extends Component {

	constructor(props) {
		super(props);

		this.state = {
			snippetTitle: '',
			snippet: '',
			snippetList: [],
			showEntryModal: false,
		}

		this.onNewButtonClick = this.onNewButtonClick.bind(this);
		this.fetchAllSnippets = this.fetchAllSnippets.bind(this);
		this.titleOnChange = this.titleOnChange.bind(this);
		this.snippetOnChange = this.snippetOnChange.bind(this);
		this.snippetOnSave = this.snippetOnSave.bind(this);
		this.snippetOnClose = this.snippetOnClose.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.resetEntryInputs = this.resetEntryInputs.bind(this);
		this.snippetOnRemove = this.snippetOnRemove.bind(this);
		this.snippetOnEdit = this.snippetOnEdit.bind(this);
	}

	componentDidMount() {
		this.fetchAllSnippets();
		document.addEventListener("keydown", this.onKeyDown, false);
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyDown, false);
	}

	onKeyDown(event) {
		if (event.keyCode === 78 && ! event.target.type) {
			event.preventDefault();
			this.setState({ showEntryModal: true });
		} else if (event.keyCode === 27) {
			this.setState({ showEntryModal: false });
		}
	}

	titleOnChange = e => {
		var title = e.target.value;
		this.setState({ snippetTitle: title });
	}

	snippetOnChange = e => {
		var snippet = e.target.value;
		this.setState({ snippet: snippet });
	}

	snippetOnSave = e => {
		e.preventDefault();

		const { snippetTitle, snippet } = this.state;
		const newSnippet = {
			title: snippetTitle,
			snippet: snippet,
			modifiedDateTime: Date.now(),
			createdDateTime: Date.now()
		};

		db.table('snippets')
			.add(newSnippet)
			.then((id) => {
				db.table('snippets').get(id, this.fetchAllSnippets());
				this.resetEntryInputs();
				this.setState({ showEntryModal: false });
			});
	}

	snippetOnEdit(snippetId) {
		//TODO
	}

	snippetOnRemove(snippetId) {
		const id = parseInt(snippetId, 10);

		if (! id) {
			return true;
		}

		db.table('snippets')
			.delete(id)
			.then(() => {
				this.fetchAllSnippets();
				this.resetEntryInputs();
			});
	}

	resetEntryInputs() {
		this.setState({
			snippetTitle: null,
			snippet: null,
		});
	}

	snippetOnClose = () => {
		this.setState({ showEntryModal: false });
		document.querySelector('.sidenav').style.zIndex = '1';

		if (document.querySelector('.addButton')) {
			document.querySelector('.addButton').style.zIndex = '0';
		}
	}

	onNewButtonClick = () => {
		var showModal = this.state.showEntryModal;

		if (! showModal) {
			this.setState({ showEntryModal: true });
			document.querySelector('.sidenav').style.zIndex = '-1';
			if (document.querySelector('.addButton')) {
				document.querySelector('.addButton').style.zIndex = '-1';
			}
		}
	}

	fetchAllSnippets = () => {
		db.table("snippets")
			.toArray()
			.then((snippetList) => {
				this.sortSnippetList(snippetList);
				this.setState({ snippetList: snippetList });
		});
	}

	sortSnippetList(snippetList) {
		snippetList.sort(function(a,b) {
			return b.createdDateTime - a.createdDateTime;
		});
	}

	render() {
		const {
			snippetList,
			showEntryModal,
			snippetTitle,
			snippet,
		} = this.state;

		return (
			<div className='container snippet'>
				{ snippetList.map(snippet =>
					<Row
						key={ snippet.id }
						snippetOnEdit={ (id) => this.snippetOnEdit(snippet.id) }
						snippetOnRemove={ (id) => this.snippetOnRemove(snippet.id) }
						snippetData={ snippet }
					/>
				)}

				{ showEntryModal && 
					<Modal
						titleValue={ snippetTitle }
						snippetValue={ snippet }
						titleOnChange={ e => this.titleOnChange(e) }
						snippetOnSave={ e => this.snippetOnSave(e) }
						snippetOnClose={ () => this.snippetOnClose() }
						snippetOnChange={ e => this.snippetOnChange(e) }
					/>
				}

				<span onClick={ () => this.onNewButtonClick() }><i className='button addButton circle card large fa fa-plus'></i></span>
			</div>
		);
	}
}

export default Snippets;
