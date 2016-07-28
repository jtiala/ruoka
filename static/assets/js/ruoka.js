var translations = {
	fi: {
		closed: 'Suljettu'
	},
	en: {
		closed: 'Closed'
	}
}

var translate = function(name, language) {
	return translations[language][name];
};

var RuokaApp = React.createClass({
	getDefaultProps: function() {
		return {
			appUrl: 'http://dev.ruoka.kitchen',
			languages: {
				fi: {
					name: 'Suomi',
					inLanguage: 'Suomeksi',
					link: '/'
				},
				en: {
					name: 'English',
					inLanguage: 'In English',
					link: '/en'
				}
			}
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
					fi: {
						title: 'Linnanmaan lounaslistat'
					},
					en: {
						title: 'Lunch menus at Linnanmaa'
					},
					restaurants: [
						{type: 'amica', name: 'centralstation', fi: {type: 'Amica', name: 'Central Station'}, en: {type: 'Amica', name: 'Central Station'}},
						{type: 'amica', name: 'stories', fi: {type: 'Amica', name: 'Stories'}, en: {type: 'Amica', name: 'Stories'}},
						{type: 'amica', name: 'datagarage', fi: {type: 'Amica', name: 'Datagarage'}, en: {type: 'Amica', name: 'Datagarage'}},
						{type: 'amica', name: 'aava', fi: {type: 'Amica', name: 'Aava'}, en: {type: 'Amica', name: 'Aava'}},
						{type: 'amica', name: 'balance', fi: {type: 'Amica', name: 'Balance'}, en: {type: 'Amica', name: 'Balance'}}
					]
				},
				keskusta: {
					fi: {
						title: 'Keskustan lounaslistat'
					},
					en: {
						title: 'Lunch menus at Downtown'
					},
					restaurants: [
						{type: 'amica', name: 'odl-kantakortteli', fi: {type: 'Amica', name: 'ODL Kantakortteli'}, en: {type: 'Amica', name: 'ODL Kantakortteli'}}
					]
				},
				kontinkangasKaukovainio: {
					fi: {
						title: 'Kontinkankaan & Kaukovainion lounaslistat'
					},
					en: {
						title: 'Lunch menus at Kontinkangas & Kaukovainio'
					},
					restaurants: [
						{type: 'amica', name: 'alwari', fi: {type: 'Amica', name: 'Alwari'}, en: {type: 'Amica', name: 'Alwari'}},
						{type: 'amica', name: 'kotkanpoika-kultturelli', fi: {type: 'Amica', name: 'Kotkanpoika & Kultturelli'}, en: {type: 'Amica', name: 'Kotkanpoika & Kultturelli'}},
					]
				},
				teknologiakyla: {
					fi: {
						title: 'Teknologiakylän lounaslistat'
					},
					en: {
						title: 'Lunch menus at Tecnology Village'
					},
					restaurants: [
						{type: 'amica', name: 'smarthouse', fi: {type: 'Amica', name: 'Smarthouse'}, en: {type: 'Amica', name: 'Smarthouse'}}
					]
				}
			}
		}
	},
	componentWillMount: function() {
		this.updateStateFromHash();
		this.updateBrowserTitle();
	},
	componentDidUpdate: function() {
		this.updateBrowserTitle();
		this.updateBrowserHash();
	},
	handleChangeDate: function(date) {
		var state = this.state;
		state.date = moment(date);
		state.firstDayOfWeek = moment(date).startOf('isoweek');
		this.setState(state);
	},
	handleChangeListing: function(listing) {
		var state = this.state;
		state.currentListing = listing;
		this.setState(state);
	},
	handleChangeLanguage: function(language) {
		var state = this.state;
		state.language = language;
		this.setState(state);
	},
	updateBrowserTitle: function() {
		var title = this.state.listings[this.state.currentListing].listingTitle + ', ' + this.state.date.format('dd D.M.') + ' - Ruoka.kitchen';
		document.title = title;
	},
	updateBrowserHash: function() {
		var hash = '#' + this.state.language + '/' + this.state.currentListing + '/' + this.state.date.format('YYYY-MM-DD');
		location.hash = hash;
	},
	updateStateFromHash: function() {
		var hash = location.hash.replace('#', '');
		var state = this.state;

		if (hash.length) {
			var parts = hash.split('/');
			
			switch (parts.length) {
				case 3:
					if (parts[2].length == 10) {
						state.date = moment(parts[2], 'YYYY-MM-DD');
					}
				case 2:
					if (Object.keys(this.state.listings).indexOf(parts[1]) > -1) {
						state.currentListing = parts[1];
					}
				case 1:
					if (Object.keys(this.props.languages).indexOf(parts[0]) > -1) {
						state.language = parts[0];
					}
			}
		}

		this.setState(state);
	},
	render: function() {
		return (
			<div className="mdl-layout mdl-js-layout mdl-layout--fixed-header"> 
				<Header appUrl={this.props.appUrl} date={this.state.date} firstDayOfWeek={this.state.firstDayOfWeek} language={this.state.language} listings={this.state.listings} currentListing={this.state.currentListing} onChangeDate={this.handleChangeDate} onChangeListing={this.handleChangeListing} />
				<main className="mdl-layout__content">
					<div className="page-content">
						<div className="mdl-grid">
							{this.state.listings[this.state.currentListing].restaurants.map(function(restaurant) {
								return <Restaurant key={restaurant.name} language={this.state.language} date={this.state.date} firstDayOfWeek={this.state.firstDayOfWeek} details={restaurant} />
							}.bind(this))}
						</div>
					</div>
					<Footer language={this.state.language} languages={this.props.languages} appUrl={this.props.appUrl} />
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
	changeDate: function(date) {
		this.props.onChangeDate(date);
	},
	changeListing: function(listing) {
		this.props.onChangeListing(listing);
	},
	render: function() {
		var frontPageLink = this.props.appUrl + '/' + this.props.language;
		var dates = [];

		for (var i = 0; i < 7; i++) {
			var date = moment(this.props.firstDayOfWeek).add(i, 'days');
			dates.push(date);
		}
		
		return (
			<header className="mdl-layout__header">
				<div className="mdl-layout__header-row">
					<span className="mdl-layout-title">
						<span className="logotype"><a href={frontPageLink}><strong>Ruoka</strong>.kitchen</a></span>
						<span className="navigation">
							<span className="navigation-dash">&#8212;</span>
							<span className="navigation-listing">
								<button id="navigation-listing-button" className="mdl-button mdl-js-button">
									<i className="material-icons">keyboard_arrow_down</i>
									<span className="navigation-listing-name">{this.props.listings[this.props.currentListing][this.props.language].title}</span>
								</button>
								<ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" htmlFor="navigation-listing-button">
								{Object.keys(this.props.listings).map(function(listing) {
									var text = this.props.listings[listing][this.props.language].title;
									
									if (this.props.currentListing == listing) {
										text = <strong>{text}</strong>;
									}
									
									return (
										<li className="mdl-menu__item" key={'listing-' + listing} onClick={this.changeListing.bind(this, listing)}>{text}</li>
									)
								}.bind(this))}
								</ul>
							</span>
							<span className="navigation-date">
								<button onClick={this.changeDate.bind(this, moment(this.props.date).add(-1, 'days'))} className="mdl-button mdl-js-button mdl-button--icon"><i className="material-icons">keyboard_arrow_left</i></button>
								<button id="navigation-date-button" className="mdl-button mdl-js-button">
									<span className="navigation-date-date">{this.props.date.locale(this.props.language).format('dd D.M.')}</span>
								</button>
								<ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" htmlFor="navigation-date-button">
								{dates.map(function(date) {
									return (
										<li className="mdl-menu__item" key={'date-' + date.format('YYYY-MM-DD')} onClick={this.changeDate.bind(this, date.format('YYYY-MM-DD'))}>{date.locale(this.props.language).format('dd D.M.')}</li>
									)
								}.bind(this))}
								</ul>
								<button onClick={this.changeDate.bind(this, moment(this.props.date).add(1, 'days'))} className="mdl-button mdl-js-button mdl-button--icon"><i className="material-icons">keyboard_arrow_right</i></button>
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
		if (this.props.language == 'en') {
			var changeLanguageLink = <a href={this.props.appUrl + this.props.languages['fi'].link}>{this.props.languages['fi'].inLanguage}</a>;
		} else {
			var changeLanguageLink = <a href={this.props.appUrl + this.props.languages['en'].link}>{this.props.languages['en'].inLanguage}</a>;
		}

		return (
			<footer className="mdl-mini-footer">
				<div className="mdl-mini-footer__left-section">
					<div className="mdl-logo">
						<span className="logotype"><a href={this.props.appUrl}><strong>Ruoka</strong>.kitchen</a></span>
					</div>
					<ul className="mdl-mini-footer__link-list">
						<li>{changeLanguageLink}</li>
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
			details: null
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

		switch (this.props.details.type) {
			case 'amica':
				state.dataType = 'json';
				state.dataDir = 'data/amica/';
				state.dataFile = state.dataDir + this.props.firstDayOfWeek.format('YYYY-MM-DD') + '_' + this.props.language + '_' + this.props.details.name + '.json';
				break;
			case 'uniresta':
				state.dataType = 'xml';
				state.dataDir = 'data/uniresta/';
				state.dataFile = state.dataDir + this.props.firstDayOfWeek.format('YYYY-MM-DD') + '_' + this.props.language + '_' + this.props.details.name + '.xml';
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
											setMenu.Name.toLowerCase().indexOf('vegetable') > -1 ||
											setMenu.Name.toLowerCase().indexOf('salaatti') > -1 ||
											setMenu.Name.toLowerCase().indexOf('salad') > -1
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
											setMenu.Name.toLowerCase().indexOf('portion') > -1 ||
											setMenu.Name.toLowerCase().indexOf('pitsa') > -1 ||
											setMenu.Name.toLowerCase().indexOf('pizza') > -1 ||
											setMenu.Name.toLowerCase().indexOf('bizza') > -1
										) {
											var type = 'grillLunch';
										} else if (
											setMenu.Name.toLowerCase().indexOf('herkuttelijan') > -1 ||
											setMenu.Name.toLowerCase().indexOf('special') > -1
										) {
											var type = 'specialLunch';
										} else if (
											setMenu.Name.toLowerCase().indexOf('jälki') > -1 ||
											setMenu.Name.toLowerCase().indexOf('dessert') > -1
										) {
											var type = 'dessert';
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

										if (setMenu.Price) {
											var price = setMenu.Price.replace(/€\/ /g, '€ / ').replace(/ €/g, '€');
										} else {
											var price = null;
										}
										
										var set = {
											type: type,
											name: setMenu.Name,
											price: price,
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
			var lunchTime = translate('closed', this.props.language);
			var lunchTimeCardClass = 'mdl-card mdl-shadow--2dp restaurant-additional-info mdl-card--red';
		} else {
			var lunchTime = this.state.lunchTime;
			var lunchTimeCardClass = 'mdl-card mdl-shadow--2dp restaurant-additional-info mdl-card--green';
		}

		return (
			<div className="mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--12-col-phone">
				<div className="mdl-card mdl-shadow--2dp restaurant-info">
					<div className="mdl-card__title mdl-card--expand">
						<h3 className="mdl-card__title-text"><a href={this.state.url}><small>{this.props.details[this.props.language].type}</small><br />{this.props.details[this.props.language].name}</a></h3>
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
			case 'dessert':
				state.cssClasses += ' menu-set--dessert';
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
