import React, { Component, Fragment } from 'react';

import Input from '../Input';

class Autocomplete extends Component {
	static defaultProps = {
		suggestions: []
	};

	constructor(props) {
		super(props);

		this.state = {
			activeSuggestion: 0,
			filteredSuggestions: [],
			showSuggestions: false,
			userInput: ''
		};
	}

	onChange = e => {
		const { suggestions } = this.props;
		const userInput = e.currentTarget.value;

		//Filter our suggestions that don't contain the user's input
		const filteredSuggestions = suggestions.filter(
			suggestion => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
		);

		// Update the user input and filtered suggestions, reset the active
		// suggestion and make sure the suggestions are shown
		this.setState({
			activeSuggestion: 0,
			filteredSuggestions,
			showSuggestions: true,
			userInput: userInput
		});

		this.props.onChange(userInput);
	}

	onClick = e => {
		//Update user input and reset rest of state
		this.setState({
			activeSuggestions: 0,
				filteredSuggestions: [],
				showSuggestions: false,
				userInput: e.currentTarget.innerText
		});

		this.props.onChange(e.currentTarget.innerText);
	}

	onKeyDown = e => {
		const { activeSuggestion, filteredSuggestions } = this.state;

		if (e.keyCode === 13 || e.keyCode === 9) {
			this.setState({
				activeSuggestion: 0,
				showSuggestions: false,
				userInput: filteredSuggestions[activeSuggestion]
			});

			this.props.onChange(filteredSuggestions[activeSuggestion]);
		} else if (e.keyCode === 38) {
			if (activeSuggestion === 0) {
				return;
			}

			this.setState({ activeSuggestion: activeSuggestion - 1 });
		} else if (e.keyCode === 40) {
			if (activeSuggestion - 1 === filteredSuggestions.length) {
				return;
			}

			this.setState({ activeSuggestion: activeSuggestion + 1 });
		}
	}

	render() {
		const {
			onChange,
			onClick,
			onKeyDown,
			state: {
				activeSuggestion,
				filteredSuggestions,
				showSuggestions,
				userInput
			}
		} = this;

		let suggestionsListComponent;
		if (showSuggestions && userInput) {
			suggestionsListComponent = (
				<ul className='suggestions'>
					{filteredSuggestions.map((suggestion, index) => {
						let className;

						if (index === activeSuggestion) {
							className = 'suggestion-active';
						}

						return (
							<li
								className={ className }
								key={ suggestion }
								onClick={ onClick }
							>
								{ suggestion }
							</li>
						);
					})}
				</ul>
			);
		}

		return (
			<Fragment>
				<Input
					id='searchInput'
					focus={ true }
					classList='search-input'
					onChange={ onChange }
					onKeyDown={ onKeyDown }
					inputValue={ userInput }
				/>
				{ suggestionsListComponent }
			</Fragment>
		)
	}
}

export default Autocomplete;
