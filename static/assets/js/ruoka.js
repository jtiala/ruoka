var RuokaApp = React.createClass({
	getDefaultProps: function() {
		return {
			appName: config.appName,
			appUrl: config.appUrl,
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
						{type: 'amica', name: 'balance', fi: {type: 'Amica', name: 'Balance'}, en: {type: 'Amica', name: 'Balance'}},
						{type: 'uniresta', name: 'kastari', fi: {type: 'Uniresta', name: 'Kastari'}, en: {type: 'Uniresta', name: 'Kastari'}}
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
						{type: 'amica', name: 'odl-kantakortteli', fi: {type: 'Amica', name: 'ODL Kantakortteli'}, en: {type: 'Amica', name: 'ODL Kantakortteli'}},
						{type: 'uniresta', name: 'vanilla', fi: {type: 'Uniresta', name: 'Vanilla'}, en: {type: 'Uniresta', name: 'Vanilla'}},
						{type: 'uniresta', name: 'preludi', fi: {type: 'Uniresta', name: 'Preludi'}, en: {type: 'Uniresta', name: 'Preludi'}}
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
						{type: 'uniresta', name: 'medisiina', fi: {type: 'Uniresta', name: 'Medisiina'}, en: {type: 'Uniresta', name: 'Medisiina'}},
						{type: 'uniresta', name: 'castanea', fi: {type: 'Uniresta', name: 'Castanea'}, en: {type: 'Uniresta', name: 'Castanea'}}
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
						{type: 'amica', name: 'smarthouse', fi: {type: 'Amica', name: 'Smarthouse'}, en: {type: 'Amica', name: 'Smarthouse'}},
						{type: 'amica', name: 'garden', fi: {type: 'Amica', name: 'Garden'}, en: {type: 'Amica', name: 'Garden'}}
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
		var title = this.state.listings[this.state.currentListing][this.state.language].title + ', ' + this.state.date.locale(this.state.language).format('dd D.M.') + ' - ' + this.props.appName;
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
						<Ad />
					</div>
					<Footer language={this.state.language} languages={this.props.languages} appUrl={this.props.appUrl} />
				</main>
			</div>
		)
	}
});

var Ad = React.createClass({
	hasAds: function() {
		if (config.ads[0] instanceof Object) {
			return true;
		}
		
		return false;
	},
	componentDidMount: function() {
		if (this.hasAds()) {
			(adsbygoogle = window.adsbygoogle || []).push({});
		}
	},
	render: function() {
		if (this.hasAds()) {
			return (
				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--12-col" style={{height: '100px'}}>
						<ins className="adsbygoogle" style={{display: 'block', textAlign: 'center'}} data-ad-client={config.ads[0].adClient} data-ad-slot={config.ads[0].adSlot} data-ad-format="auto"></ins>
					</div>
				</div>
			);
		} else {
			return (<div></div>);
		}
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
		var dates = [];

		for (var i = 0; i < 7; i++) {
			var date = moment(this.props.firstDayOfWeek).add(i, 'days');
			dates.push(date);
		}
		
		return (
			<header className="mdl-layout__header">
				<div className="mdl-layout__header-row">
					<span className="mdl-layout-title">
						<span className="navigation">
							<span className="navigation-logo logotype" onClick={this.changeDate}><strong>Ruoka</strong>.kitchen</span>
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
									var text = date.locale(this.props.language).format('dd D.M.');
									
									if (date.isSame(this.props.date, 'day')) {
										text = <strong>{text}</strong>;
									}
									
									return (
										<li className="mdl-menu__item" key={'date-' + date.format('YYYY-MM-DD')} onClick={this.changeDate.bind(this, date.format('YYYY-MM-DD'))}>{text}</li>
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
			dataType: null,
			dataDir: null,
			dataFile: null,
			info: [],
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
				state.dataType = 'json';
				state.dataDir = 'data/uniresta/';
				state.dataFile = state.dataDir + this.props.firstDayOfWeek.format('YYYY-MM-DD') + '_' + this.props.details.name + '.json';
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
				switch (this.props.details.type) {
					case 'amica':
						this.parseAmicaMenu(data);
						break;
					case 'uniresta':
						this.parseUnirestaMenu(data);
						break;
				}
			}.bind(this),
			error: function(xhr, status, err) {
				this.addErrorCard(null, 'menuDownloadError');
			}.bind(this)
		});
	},
	parseAmicaMenu: function(data) {
		var state = this.state;
		var stateNeedsUpdate = false;
		var info = [];
		var menuSets = [];
		
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
						if (menus.LunchTime) {
							info.push({type: 'lunchTime', content: menus.LunchTime});
						}

						if (menus.SetMenus instanceof Array) {
							menus.SetMenus.forEach(function(setMenu) {
								var type = this.getSetTypeFromName(setMenu.Name);
								var components = [];

								if (setMenu.Components instanceof Array) {
									setMenu.Components.forEach(function(component) {
										components.push({
											name: component.replace(/ *\([^)]*\) */g, ""),
											diets: component.match(/ *\([^)]*\) */g).shift().replace(/ ,/g, ', ').replace(/\*, /g, '')
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
						}
					}
				}.bind(this));
			}
		}
	
		if (menuSets.length == 0 && info.length == 0) {
			info.push({type: 'menuUnavailable'});
		}

		if (JSON.stringify(info) !== JSON.stringify(state.info)) {
			state.info = info;
			stateNeedsUpdate = true;
		}

		if (JSON.stringify(menuSets) !== JSON.stringify(state.menuSets)) {
			state.menuSets = menuSets;
			stateNeedsUpdate = true;
		}

		if (stateNeedsUpdate) {
			this.setState(state);
		}
	},
	parseUnirestaMenu: function(data) {
		var state = this.state;
		var stateNeedsUpdate = false;
		var info = [];
		var menuSets = [];
		var normalSets = [];
		var specialSets = [];

		if (data.page instanceof Object) {
			if (data.page.link && data.page.link !== state.url) {
				state.url = data.page.link;
				stateNeedsUpdate = true;
			}
		}

		if (data.sections instanceof Object) {
			for (var key in data.sections) {
				if (! data.sections.hasOwnProperty(key)) {
					continue;
				}

				var obj = data.sections[key];

				if (obj instanceof Array) {
					var day = moment(this.props.date).locale('fi').format('dd');
					
					obj.forEach(function(menus) {
						for (var menuKey in menus) {
							if (! menus.hasOwnProperty(menuKey)) {
								continue;
							}

							if (menuKey.indexOf(day + '-') == 0) {
								if (menuKey.indexOf('ruokalaji') == 3 && menuKey.indexOf('-kalorit') == -1) {
									var name = menuKey.slice(3).replace(/-/g, ' ');
									var components = [];
									var type = this.getSetTypeFromName(name);
									
									components.push({name: menus[menuKey].replace(/\(\[S\]\)/g, '').replace(/\[S\]/g, '').replace(/\s\.\s/g,'')});
									
									var set = {
										type: type,
										name: name.charAt(0).toUpperCase() + name.slice(1),
										components: components
									};

									normalSets.push(set);
								} else if (menuKey.indexOf('erikoisuudet') == 3 && menuKey.indexOf('-otsikot') == -1) {
									if (menus[menuKey] instanceof Array) {
										menus[menuKey].forEach(function(menu, menuNro) {
											var titleKey = menuKey + '-otsikot';
											
											if (titleKey in menus && menuNro in menus[titleKey] && menus[titleKey][menuNro].length > 0) {
												var name = menus[titleKey][menuNro].trim();
											} else {
												var name = null;
											}
										
											var componentName = menu.replace(/\(\[S\]\)/g, '').replace(/\[S\]/g, '').replace(/\s\.\s/g,'').trim();
											var openingWords = ['aukiolo', 'avoinna', 'loma'];

											if (typeof name == 'string' && stringContains(name, openingWords)) {
												info.push({type: 'openingHours', title: name, content: componentName});
											} else if (stringContains(componentName, openingWords)) {
												info.push({type: 'openingHours', content: componentName});
											} else {
												var type = this.getSetTypeFromName(name);
												var components = [{name: componentName}];
												
												var set = {
													type: type,
													name: name,
													components: components
												};

												specialSets.push(set);
											}
										}.bind(this));
									}
								}
							}
						}
					}.bind(this));
				}
			}
		}
					
		menuSets = normalSets.concat(specialSets);

		if (menuSets.length == 0 && info.length == 0) {
			info.push({type: 'menuUnavailable'});
		}

		if (JSON.stringify(info) !== JSON.stringify(state.info)) {
			state.info = info;
			stateNeedsUpdate = true;
		}

		if (JSON.stringify(menuSets) !== JSON.stringify(state.menuSets)) {
			state.menuSets = menuSets;
			stateNeedsUpdate = true;
		}

		if (stateNeedsUpdate) {
			this.setState(state);
		}
	},
	addErrorCard: function(title, content) {
		var origInfo = this.state.info;
		var newInfo = [{type: 'error', title: title, content: content}];

		if (JSON.stringify(origInfo) !== JSON.stringify(newInfo)) {
			var state = this.state;
			state.info = newInfo;
			this.setState(state);
		}
	},
	getSetTypeFromName: function(name) {
		var type = 'lunch'
	
		if (typeof name == 'string' && name.length > 0) {
			if (stringContains(name, ['kasvis', 'vegetable', 'salaatti', 'salad'])) {
				type = 'vegetarianLunch';
			} else if (stringContains(name, ['kevyt', 'soup'])) {
				type = 'lightLunch';
			} else if (stringContains(name, ['grill', 'erikois', 'portion', 'pitsa', 'pizza', 'bizza'])) {
				type = 'grillLunch';
			} else if (stringContains(name, ['herkuttelijan', 'herkku', 'special'])) {
				type = 'specialLunch';
			} else if (stringContains(name, ['jälki', 'dessert'])) {
				type = 'dessert';
			} else if (stringContains(name, ['aamu', 'breakfast'])) {
				type = 'breakfast';
			}
		}

		return type;
	},
	render: function() {
		var i = 0;
		var j = 0;
		var infoCards = [];

		this.state.info.map(function(card) {
			if (card.type == 'lunchTime' && typeof card.content == 'string' && card.content.length > 0) {
				infoCards.push(<div key={this.props.name + '-card-' + j++} className='mdl-card mdl-shadow--2dp restaurant-additional-info mdl-card--slateblue'><div className="mdl-card__title restaurant-open"><i className="material-icons restaurant-open-icon">access_time</i><small className="restaurant-open-time">{card.content}</small></div></div>);
			} else if (card.type == 'menuUnavailable') {
				infoCards.push(<div key={this.props.name + '-card-' + j++} className='mdl-card mdl-shadow--2dp restaurant-additional-info mdl-card--grey'><div className="mdl-card__title"><small>{translate('menuUnavailable', this.props.language)}</small></div></div>);
			} else if (card.type == 'openingHours') {
				var cardTitle = null;
				
				if (typeof card.title == 'string' && card.title.length > 0) {
					cardTitle = <strong>{card.title}<br /></strong>;
				}
				
				infoCards.push(<div key={this.props.name + '-card-' + j++} className='mdl-card mdl-shadow--2dp restaurant-additional-info mdl-card--slateblue'><div className="mdl-card__title restaurant-open"><i className="material-icons restaurant-open-icon">access_time</i><small className="restaurant-open-time">{cardTitle}{card.content}</small></div></div>);
			} else if (card.type == 'error') {
				infoCards.push(<div key={this.props.name + '-card-' + j++} className='mdl-card mdl-shadow--2dp restaurant-additional-info mdl-card--red'><div className="mdl-card__title"><small>{translate('menuDownloadError', this.props.language)}</small></div></div>);
			}
		}.bind(this));

		return (
			<div className="mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--12-col-phone">
				<div className="mdl-card mdl-shadow--2dp restaurant-info">
					<div className="mdl-card__title mdl-card--expand">
						<h3 className="mdl-card__title-text"><a target="_blank" href={this.state.url}><small>{this.props.details[this.props.language].type}</small><br />{this.props.details[this.props.language].name}</a></h3>
					</div>
				</div>
				{infoCards.map(function(card) {
					return card;
				}.bind(this))}
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
			case 'breakfast':
				state.cssClasses += ' menu-set--breakfast';
				break;
		}

		this.setState(state);
	},
	render: function() {
		var i = 0;
		var components = [];
		var title = null;
		var price = null;

		if (this.props.components instanceof Array) {
			components = this.props.components;
		}

		if (typeof this.props.name == 'string' && this.props.name.length > 0) {
			title = <div className="mdl-card__title menu-title"><h5 className="mdl-card__title-text">{this.props.name}</h5></div>;
		}

		if (typeof this.props.price == 'string' && this.props.price.length > 0) {
			price = <div className="mdl-card__title menu-price"><h6 className="mdl-card__title-text">{this.props.price}</h6></div>;
		}

		return (
			<div className={this.state.cssClasses}>
				{title}
				{price}
				<div className="mdl-card__supporting-text menu-components">
					<ul className="mdl-list">
						{components.map(function(component) {
							return <li key={this.key + '-component-' + i++} className="mdl-list__item" title={component.diets}>{component.name}</li>
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
