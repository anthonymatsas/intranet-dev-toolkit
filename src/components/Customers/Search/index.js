import React, { Component } from 'react';

import './style.css';

import Button from '../../Button';
import Autocomplete from '../../Autocomplete';

class Search extends Component {
	render() {
		const {
			searchTerm,
			suggestions,
			onClick,
			onChange
		} = this.props;

		return (
			<div>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						onClick(event)
				}}>
					<Autocomplete
						suggestions={ suggestions }
						onChange={ onChange }
						userInput={ searchTerm }
					/>
					<Button className='search-button' text='Search' onClick={ onClick }/>
				</form>
			</div>
		);
	}
}

export default Search;
