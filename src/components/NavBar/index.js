import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Settings from './Settings';
import QuickConnect from './QuickConnect';
import Shortcut from './Shortcuts';

import { menus } from '../../constants/menus';
import { getSetting } from '../NavBar/Settings/Entry/helper.js';
import { MODULES } from '../NavBar/Settings/Entry/constants.js';

class NavBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modules: {}
		};

		this.fetchActiveModules = this.fetchActiveModules.bind(this);
	}

	componentDidMount() {
		this.fetchActiveModules();
	}

	fetchActiveModules() {
		getSetting(MODULES).then((setting) => {
			this.setState({
				modules: setting
			});
		});
	}

	createNavBarList = () => {
		const { modules } = this.state;
		const list = [];

		var childKey = 0;
		for (var key in menus) {
			var menu = menus[key];
			var title = key.charAt(0).toUpperCase() + key.slice(1);

			var classes = 'button bar-item',
				activeClass = 'active-menu';

			if (menu.link) {
				if (key in modules && !modules[key]) {
					continue;
				}

				list.push(<NavLink exact className={ classes } key={key + childKey} to={menu.link} activeClassName={activeClass}>{title}</NavLink>);
			} else {
				list.push(<div key={ childKey } className='bar-item logo'><b>{menu.content}</b></div>);
			}

			childKey++;
		}

		return list;
	}

	render() {
		return (
			<div className='nav bar'>
				{ this.createNavBarList() }
				<Settings />
				<Shortcut />
				<QuickConnect />
			</div>
		);
	}
}

export default NavBar;
