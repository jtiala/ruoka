var RuokaApp = React.createClass({
	getDefaultProps: function() {
		return {
			appUrl: 'http://dev.ruoka.kitchen'
		}
	},
	getInitialState: function() {
		return {
			language: 'fi',
			date: moment(),
			firstDayOfWeek: moment().startOf('isoweek'),
			currentListing: 'linnanmaa',
			listings: {
				linnanmaa: {
					listingTitle: 'Linnanmaan lounaslistat',
					restaurants: [
						{type: 'amica', name: 'centralstation', displayType: 'Amica', displayName: 'Central Station'},
						{type: 'amica', name: 'stories', displayType: 'Amica', displayName: 'Stories'},
						{type: 'amica', name: 'datagarage', displayType: 'Amica', displayName: 'Datagarage'},
						{type: 'amica', name: 'aava', displayType: 'Amica', displayName: 'Aava'},
						{type: 'amica', name: 'balance', displayType: 'Amica', displayName: 'Balance'}
					]
				},
				keskusta: {
					listingTitle: 'Keskustan lounaslistat',
					restaurants: [
						{type: 'amica', name: 'odl-kantakortteli', displayType: 'Amica', displayName: 'ODL Kantakortteli'},
					]
				},
				kontinkangasKaukovainio: {
					listingTitle: 'Kontinkankaan ja Kaukovainion lounaslistat',
					restaurants: [
						{type: 'amica', name: 'alwari', displayType: 'Amica', displayName: 'Alwari'},
						{type: 'amica', name: 'kotkanpoika-kultturelli', displayType: 'Amica', displayName: 'Kotkanpoika & Kultturelli'},
					]
				}
			}
		}
	},
	handleChangeDate: function(date) {
		var state = this.state;
		state.date = date;
		this.setState(state);
	},
	handleChangeListing: function(listing) {
		var state = this.state;
		state.currentListing = listing;
		this.setState(state);
	},
	render: function() {
		return (
			<div className="mdl-layout mdl-js-layout mdl-layout--fixed-header"> 
				<Header appUrl={this.props.appUrl} date={this.state.date} language={this.state.language} listings={this.state.listings} currentListing={this.state.currentListing} onChangeDate={this.handleChangeDate} onChangeListing={this.handleChangeListing} />
				<main className="mdl-layout__content">
					<div className="page-content">
						<div className="mdl-grid">
							{this.state.listings[this.state.currentListing].restaurants.map(function(restaurant) {
								return <Restaurant key={restaurant.name} language={this.state.language} date={this.state.date} firstDayOfWeek={this.state.firstDayOfWeek} type={restaurant.type} name={restaurant.name} displayType={restaurant.displayType} displayName={restaurant.displayName} />
							}.bind(this))}
						</div>
					</div>
					<Footer appUrl={this.props.appUrl} />
				</main>
			</div>
		)
	}
});

var Header = React.createClass({
	componentDidMount: function() {
		componentHandler.upgradeDom();
	},
	componentDidUpdate: function() {
		componentHandler.upgradeDom();
	},
	prevDate: function() {
		this.props.onChangeDate(this.props.date.add(-1, 'days'));
	},
	nextDate: function() {
		this.props.onChangeDate(this.props.date.add(1, 'days'));
	},
	changeListing: function(listing) {
		this.props.onChangeListing(listing);
	},
	render: function() {
		return (
			<header className="mdl-layout__header">
				<div className="mdl-layout__header-row">
					<span className="mdl-layout-title">
						<span className="logotype"><a href={this.props.appUrl}><strong>Ruoka</strong>.kitchen</a></span>
						<span className="navigation">
							<span className="navigation-dash">&#8212;</span>
							<span className="navigation-listing">
								<button id="navigation-listing-button" className="mdl-button mdl-js-button">
									<i className="material-icons">keyboard_arrow_down</i>
									<span className="navigation-listing-name">{this.props.listings[this.props.currentListing].listingTitle}</span>
								</button>
								<ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" htmlFor="navigation-listing-button">
								{Object.keys(this.props.listings).map(function(listing) {
									return (
										<li className="mdl-menu__item" key={listing} onClick={this.changeListing.bind(this, listing)}>{this.props.listings[listing].listingTitle}</li>
									)
								}.bind(this))}
								</ul>
							</span>
							<span className="navigation-date">
								<button onClick={this.prevDate} className="mdl-button mdl-js-button mdl-button--icon"><i className="material-icons">keyboard_arrow_left</i></button>
								<button id="navigation-listing-button" className="mdl-button mdl-js-button">
									<span className="navigation-date-date">{this.props.date.locale(this.props.language).format('dd D.M.')}</span>
								</button>
								<button onClick={this.nextDate} className="mdl-button mdl-js-button mdl-button--icon"><i className="material-icons">keyboard_arrow_right</i></button>
							</span>
						</span>
					</span>
				</div>
			</header>
		);
	}
});

var Footer = React.createClass({
	render: function() {
		return (
			<footer className="mdl-mini-footer">
				<div className="mdl-mini-footer__left-section">
					<div className="mdl-logo">
						<span className="logotype"><a href={this.props.appUrl}><strong>Ruoka</strong>.kitchen</a></span>
					</div>
					<ul className="mdl-mini-footer__link-list">
						<li><a href="/en">In English</a></li>
						<li><a href="http://github.com/jtiala/ruoka">GitHub</a></li>
					</ul>
				</div>
			</footer>
		);
	}
});

var Restaurant = React.createClass({
	getDefaultProps: function() {
		return {
			language: null,
			date: null,
			firstDayOfWeek: null,
			type: null,
			name: null,
			displayName: null
		};
	},
	getInitialState: function() {
		return {
			url: null,
			lunchTime: null,
			dataType: null,
			dataDir: null,
			dataFile: null,
			menuSets: []
		}
	},
	componentDidMount: function() {
		var state = this.getInitialState();

		switch (this.props.type) {
			case 'amica':
				state.dataType = 'json';
				state.dataDir = 'data/amica/';
				state.dataFile = state.dataDir + this.props.firstDayOfWeek.format('YYYY-MM-DD') + '_' + this.props.language + '_' + this.props.name + '.json';
				break;
			case 'uniresta':
				state.dataType = 'xml';
				state.dataDir = 'data/uniresta/';
				state.dataFile = state.dataDir + this.props.firstDayOfWeek.format('YYYY-MM-DD') + '_' + this.props.language + '_' + this.props.name + '.xml';
				break;
		}

		this.setState(state);
	},
	componentDidUpdate: function() {
		this.getMenuSets();
	},
	getMenuSets: function() {
		$.ajax({
			url: this.state.dataFile,
			dataType: this.state.dataType,
			cache: false,
			success: function(data) {
				var state = this.state;
				var stateNeedsUpdate = false;

				if (data.MenusForDays instanceof Array) {
					if (data.RestaurantUrl && data.RestaurantUrl !== state.url) {
						state.url = data.RestaurantUrl;
						stateNeedsUpdate = true;
					}
				
					if (data.MenusForDays instanceof Array) {
						data.MenusForDays.forEach(function(menus) {
							var menuDate = moment(menus.Date);
							var currentDate = this.props.date;
	
							if (menuDate.isSame(currentDate, 'day')) {
								if (menus.LunchTime && menus.LunchTime !== state.lunchTime) {
									state.lunchTime = menus.LunchTime;
									stateNeedsUpdate = true;
								}
	
								if (menus.SetMenus instanceof Array) {
									var menuSets = [];
									
									menus.SetMenus.forEach(function(setMenu) {
										if (
											setMenu.Name.toLowerCase().indexOf('kasvis') > -1 ||
											setMenu.Name.toLowerCase().indexOf('vegetable') > -1
										) {
											var type = 'vegetarianLunch';
										} else if (
											setMenu.Name.toLowerCase().indexOf('kevyt') > -1 ||
											setMenu.Name.toLowerCase().indexOf('soup') > -1
										) {
											var type = 'lightLunch';
										} else if (
											setMenu.Name.toLowerCase().indexOf('grill') > -1 ||
											setMenu.Name.toLowerCase().indexOf('erikois') > -1 ||
											setMenu.Name.toLowerCase().indexOf('portion') > -1
										) {
											var type = 'grillLunch';
										} else if (
											setMenu.Name.toLowerCase().indexOf('herkuttelijan') > -1 ||
											setMenu.Name.toLowerCase().indexOf('special') > -1
										) {
											var type = 'specialLunch';
										} else {
											var type = 'lunch'
										}

										var components = [];

										if (setMenu.Components instanceof Array) {
											setMenu.Components.forEach(function(component) {
												components.push({
													name: component.replace(/ *\([^)]*\) */g, ""),
													diets: component.match(/ *\([^)]*\) */g)
												});
											});
										}

										var set = {
											type: type,
											name: setMenu.Name,
											price: setMenu.Price,
											components: components
										};

										menuSets.push(set);
									}.bind(this));
							
									if (JSON.stringify(menuSets) !== JSON.stringify(state.menuSets)) {
										state.menuSets = menuSets;
										stateNeedsUpdate = true;
									}
								}
							}
						}.bind(this));
					}
				}
				
				if (stateNeedsUpdate) {
					this.setState(state);
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.state.dataFile, status, err.toString());
			}.bind(this)
		});
	},
	render: function() {
		var i = 0;

		if (! this.state.lunchTime || typeof this.state.lunchTime == 'undefined' || this.state.lunchTime.length < 1) {
			var lunchTime = 'Suljettu';
			var lunchTimeCardClass = 'mdl-card mdl-shadow--2dp restaurant-additional-info mdl-card--red';
		} else {
			var lunchTime = this.state.lunchTime;
			var lunchTimeCardClass = 'mdl-card mdl-shadow--2dp restaurant-additional-info mdl-card--green';
		}

		return (
			<div className="mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--12-col-phone">
				<div className="mdl-card mdl-shadow--2dp restaurant-info">
					<div className="mdl-card__title mdl-card--expand">
						<h3 className="mdl-card__title-text"><a href={this.state.url}><small>{this.props.displayType}</small><br />{this.props.displayName}</a></h3>
					</div>
				</div>
				<div className={lunchTimeCardClass}>
					<div className="mdl-card__title restaurant-open">
						<i className="material-icons restaurant-open-icon">access_time</i>
						<small className="restaurant-open-time">{lunchTime}</small>
					</div>
				</div>
				{this.state.menuSets.map(function(menuSet) {
					return <MenuSet key={this.props.name + '-menu-' + i++} type={menuSet.type} name={menuSet.name} price={menuSet.price} components={menuSet.components} />
				}.bind(this))}
			</div>
		);
	}
});

var MenuSet = React.createClass({
	getInitialState: function() {
		return {
			cssClasses: 'mdl-card mdl-shadow--2dp menu-set'
		}
	},
	componentDidMount: function() {
		var state = this.getInitialState();

		switch (this.props.type) {
			case 'vegetarianLunch':
				state.cssClasses += ' menu-set--vegetable';
				break;
			case 'lightLunch':
				state.cssClasses += ' menu-set--light';
				break;
			case 'specialLunch':
				state.cssClasses += ' menu-set--special';
				break;
			case 'grillLunch':
				state.cssClasses += ' menu-set--grill';
				break;
		}

		this.setState(state);
	},
	render: function() {
		var i = 0;
		var components = [];
		
		if (this.props.components instanceof Array) {
			components = this.props.components;
		}

		return (
			<div className={this.state.cssClasses}>
				<div className="mdl-card__title menu-title">
					<h5 className="mdl-card__title-text">{this.props.name}</h5>
				</div>
				<div className="mdl-card__title menu-price">
					<h6 className="mdl-card__title-text">{this.props.price}</h6>
				</div>
				<div className="mdl-card__supporting-text menu-components">
					<ul className="mdl-list">
						{components.map(function(component) {
							return <li key={this.key + '-component-' + i++} className="mdl-list__item">{component.name}</li>
						}.bind(this))}
					</ul>
				</div>
			</div>
		);
	}
});

$(document).ready(function() {
	ReactDOM.render(<RuokaApp />, document.getElementById('ruoka-app'));
});
