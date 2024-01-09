import React from 'react';

const Search = ({
	searchProduct,
}: {
	searchProduct: (text: string) => void;
}) => {
	return (
		<input
			type="text"
			className="p-1 rounded-md text-black w-full"
			placeholder="Pesquisar"
			onChange={({ target }) => searchProduct(target.value)}
		/>
	);
};

export default React.memo(Search);
