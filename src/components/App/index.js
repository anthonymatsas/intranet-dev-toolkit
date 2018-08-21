import React, { Component } from 'react';
import NavBar from '../NavBar';
import SideNav from '../SideNav';
import Main from '../Main';

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<SideNav />
				<Main />
			</div>
		);
	}
}

export default App;
