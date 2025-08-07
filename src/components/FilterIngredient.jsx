import "./FilterIngredient.css"

export default function FilterIngredient(props) {
    return (
        <div className="ingred" onClick={(event)=>{
                event.preventDefault();
                props.func(props.name)
            }}>
            <p>{props.name}</p>
            <p>⨯</p>
        </div>
    );
}