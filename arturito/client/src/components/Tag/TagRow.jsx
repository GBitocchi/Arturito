import React, { Component } from 'react';
import { withStyles, Chip } from '@material-ui/core';

const style = theme => ({
	row: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexWrap: 'wrap',
	},
	background: {
		backgroundColor: '#efefef',
		padding: 10,
	},
	chip: {
		color: 'white',
		margin: '10px 5px',
	},
});

class TagRow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tagsClicked: [],
			background: false,
		};
	}

	componentDidMount() {
		const { selectedTags } = this.props;
		const fileTags = selectedTags ? selectedTags : [];
		const background = selectedTags && true;
		this.setState({ tagsClicked: fileTags, background: background });
	}

	onClick = tag => {
		const newTagArray = [...this.state.tagsClicked];
		if (this.state.tagsClicked.includes(tag.key)) {
			const index = newTagArray.indexOf(tag.key);
			newTagArray.splice(index, 1);
		} else {
			newTagArray.push(tag.key);
		}
		const { handleClick } = this.props;
		this.setState({
			tagsClicked: newTagArray,
		});
		handleClick(this, tag);
	};

	render() {
		const { classes, tags, addChip } = this.props;
		const { tagsClicked, background } = this.state;
		const renderedTags = tags.map((tag, index) => {
			return (
				<Chip
					className={classes.chip}
					key={index}
					label={tag.key}
					onClick={this.onClick.bind(this, tag)}
					clickable
					color={
						tagsClicked.includes(tag.key) ? 'secondary' : 'primary'
					}
				/>
			);
		});
		return (
			<div
				className={`${classes.row} ${!background &&
					classes.background}`}
			>
				{renderedTags}
				{addChip && addChip}
			</div>
		);
	}
}

export default withStyles(style)(TagRow);
