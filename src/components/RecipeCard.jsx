export default function RecipeCard(props) {
    return (
        <div>
            <h3>{props.title}</h3>
            <h3>{props.servings}</h3>
        </div>
    );
}