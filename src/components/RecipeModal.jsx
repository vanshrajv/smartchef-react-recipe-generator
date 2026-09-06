function RecipeModal({ recipe, favorite, toggleFavorite, addGroceries, close, flash }) {
	return (
		<div className="modal-backdrop" onClick={close}>
			<section className="recipe-modal" onClick={(event) => event.stopPropagation()}>
				<button className="modal-close" onClick={close} aria-label="Close recipe">×</button>
				<div className={`modal-art ${recipe.accent}`}>
					<span>{recipe.emoji}</span>
					<small>{recipe.category}</small>
				</div>
				<div className="modal-body">
					<div className="recipe-meta">
						<span>★ {recipe.rating} / 5.0</span>
						<b>{recipe.time} MINUTES</b>
					</div>
					<h2>{recipe.name}</h2>
					<p>A bright, satisfying plate made for the way you actually cook: simple ingredients, big flavour, and very little fuss.</p>
					<h4>WHAT YOU'LL NEED</h4>
					<div className="ingredient-pills">
						{recipe.ingredients.map((item) => <span key={item}>+ {item}</span>)}
					</div>
					<div className="modal-actions">
						<button className="primary-button" onClick={() => { addGroceries(recipe.ingredients); flash("Ingredients added to groceries"); }}>Add to groceries</button>
						<button className={favorite ? "secondary-button saved-action" : "secondary-button"} onClick={() => toggleFavorite(recipe.id)}>
							{favorite ? "♥ Saved" : "♡ Save recipe"}
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}

export default RecipeModal;
