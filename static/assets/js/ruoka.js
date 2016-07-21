var RuokaApp = React.createClass({
	getInitialState: function() {
		return {
			restaurants: [
				{type: 'amica', name: 'centralstation', displayName: 'Central Station'},
				{type: 'amica', name: 'stories', displayName: 'Stories'},
				{type: 'amica', name: 'datagarage', displayName: 'Datagarage'},
				{type: 'amica', name: 'aava', displayName: 'Aava'},
				{type: 'amica', name: 'balance', displayName: 'Balance'}
			]
		}
	},
	render: function() {
		return (
			<div className="mdl-grid">
				{this.state.restaurants.map(function(restaurant) {
					return <Restaurant type={restaurant.type} name={restaurant.name} displayName={restaurant.displayName} />
				}.bind(this))}
			</div>
		)
	}
});

var Restaurant = React.createClass({
	getInitialState: function() {
		return {
			type: null,
			name: null,
			displayName: null,
			url: null,
			lunchTime: '10.00 - 14.30',
			firstDayOfWeek: null,
			menuSets: [
				{
					type: 'lunch',
					name: 'Lounas I',
					price: '2,60 €/ 5,80 €/ 7,60 €',
					components: [
						{name: 'Broileri-kasviskiusausta (* ,A ,G ,L)'}
					]
				},
				{
					type: 'lunch',
					name: 'Lounas II',
					price: '2,60 €/ 5,80 €/ 7,60 €',
					components: [
						{name: 'Jauhelihamureketta (A ,L ,M)'},
						{name: 'Ruskeaa kastiketta (* ,A ,L ,M)'},
						{name: 'Keitettyjä perunoita (* ,G ,L ,M)'},
					]
				},
				{
					type: 'vegetarianLunch',
					name: 'Kasvislounas',
					price: '2,60 €/ 5,80 €/ 7,60 €',
					components: [
						{name: 'Sieni-paprikapaellaa (* ,A ,G ,VL)'}
					]
				},
				{
					type: 'lightLunch',
					name: 'Kevytlounas',
					price: '2,25 €/ 4,50 €/ 6,30 €',
					components: [
						{name: 'Palsternakkasosekeittoa (* ,A ,G ,L)'}
					]
				},
				{
					type: 'specialLunch',
					name: 'Herkuttelijan lounas',
					price: '4,85 €/ 7,40 €/ 9,60 €',
					components: [
						{name: 'Porsaan kassleria vihreässä currykastikkeessa (G ,L ,M ,VS)'},
						{name: 'Paahdettua perunaa (* ,G ,L ,M ,Veg)'}
					]
				},
			]
		}
	},
	componentDidMount: function() {
		var state = this.getInitialState();

		state.type = this.props.type;
		state.name = this.props.name;
		state.displayName = this.props.displayName;
		
		this.setState(state);
	},
	render: function() {
		return (
			<div className="mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--12-col-phone">
				<div className="mdl-card mdl-shadow--2dp restaurant-info">
					<div className="mdl-card__title mdl-card--expand">
						<h3 className="mdl-card__title-text"><a href={this.state.url}>{this.state.displayName}</a></h3>
					</div>
					<div className="mdl-card__title restaurant-open">
						<i className="material-icons restaurant-open-icon">access_time</i>
						<small className="restaurant-open-time">{this.state.lunchTime}</small>
					</div>
				</div>
				{this.state.menuSets.map(function(menuSet) {
					return <MenuSet type={menuSet.type} name={menuSet.name} price={menuSet.price} components={menuSet.components} />
				}.bind(this))}
			</div>
		);
	}
});

var MenuSet = React.createClass({
	getInitialState: function() {
		return {
			type: null,
			name: null,
			price: null,
			components: [],
			cssClasses: 'mdl-card mdl-shadow--2dp menu-set'
		}
	},
	componentDidMount: function() {
		var state = this.getInitialState();

		state.type = this.props.type;
		state.name = this.props.name;
		state.price = this.props.price;
		state.components = this.props.components;

		switch (state.type) {
			case 'vegetarianLunch':
				state.cssClasses += ' menu-set--vegetable';
				break;
			case 'lightLunch':
				state.cssClasses += ' menu-set--light';
				break;
			case 'specialLunch':
				state.cssClasses += ' menu-set--special';
				break;
			case ' grillLunch':
				state.cssClasses += ' menu-set--grill';
				break;
		}

		this.setState(state);
	},
	render: function() {
		return (
			<div className={this.state.cssClasses}>
				<div className="mdl-card__title menu-title">
					<h5 className="mdl-card__title-text">{this.state.name}</h5>
				</div>
				<div className="mdl-card__title menu-price">
					<h6 className="mdl-card__title-text">{this.state.price}</h6>
				</div>
				<div className="mdl-card__supporting-text menu-components">
					<ul className="mdl-list">
						{this.state.components.map(function(component) {
							return <li className="mdl-list__item">{component.name}</li>
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
