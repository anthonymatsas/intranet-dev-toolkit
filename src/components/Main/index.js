import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Customers from '../Customers';
import Time from '../Time';
import Snippets from '../Snippets';

import getSetting from '../NavBar/Settings/Entry/helper.js';
import { MODULES } from '../NavBar/Settings/Entry/constants.js';

import { routes } from '../../constants/routes';

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modules: {}
		};

		this.onKeyDown = this.onKeyDown.bind(this);
		this.fetchActiveModules = this.fetchActiveModules.bind(this);
	}

	componentDidMount() {
		document.addEventListener("keydown", this.onKeyDown, false);

		this.fetchActiveModules();
	}

	fetchActiveModules() {
		getSetting(MODULES).then((setting) => {
			this.setState({
				modules: setting
			});
		});
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyDown, false);
	}

	onKeyDown(event) {
		const { modules } = this.state;
		const currentRoute = this.props.location.pathname;
		const currentIndex = routes.indexOf(currentRoute);
		const totalRoutes = routes.length;

		for (var i = 0; i < totalRoutes; i++) {
			if (routes[i]) {
				var menu = routes[i].slice(1);
				if (menu in modules && !modules[menu]) {
					routes.splice(i, 1);
				}
			}
		}

		if (event.ctrlKey && event.shiftKey && event.keyCode === 9) {
			var previousRoute = currentIndex - 1;

			if (previousRoute < 0) {
				this.props.history.push({ pathname: routes[0] });
			} else {
				this.props.history.push({ pathname: routes[previousRoute] });
			}
		} else if (event.ctrlKey && event.keyCode === 9) {
			var nextRoute = currentIndex + 1;

			if (nextRoute < totalRoutes) {
				this.props.history.push({ pathname: routes[nextRoute] });
			} else {
				this.props.history.push({ pathname: routes[0] });
			}
		}
	}

	generateRoutes = () => {
		const { modules } = this.state;
		const routes = [];

		if (modules.customers) {
			routes.push(<Route key={2} path='/customers' component={Customers} />);
		}

		routes.push(<Route key={4} path='/email' component={(event) => {
			window.open('https://gmail.com/', '_blank');
			return null;
		}} />);

		if (modules.time) {
			routes.push(<Route key={5} path='/time' component={Time} />);
		}

		if (modules.snippets) {
			routes.push(<Route key={8} path='/snippets' component={Snippets} />);
		}

		return routes;
	}

	render() {
		return (
			<div className="main">
				<Switch>
					{ this.generateRoutes() }
				</Switch>
			</div>
		);
	}
}

export default withRouter(Main);
