function handleSelectedTags(setSelectedTags) {
	return (selectedTags, tagSelected) => {
		const selected = selectedTags && (!selectedTags.includes(tagSelected.key) || selectedTags.length === 0);
		if (selected) {
			setSelectedTags([...selectedTags, tagSelected.key]);
		} else {
			const tags = selectedTags ? [...selectedTags] : [];
			const index = tags.indexOf(tagSelected.key);
			tags.splice(index, 1);
			setSelectedTags([...tags]);
		}
	};
}

const cleanTags = tags => {
	const cleanedTags = tags.map(tag => {
		return tag.key;
	});
	return cleanedTags;
};

export { handleSelectedTags, cleanTags };
