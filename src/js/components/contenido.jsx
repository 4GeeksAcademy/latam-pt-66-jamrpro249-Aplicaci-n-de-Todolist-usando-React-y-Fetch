import '../../styles/contenido.css';
import { useState } from 'react';

const Contenido = () => {
    const [textoInput, setTextoInput] = useState('');
    const [listaTareas, setListaTareas] = useState([]); 

    const changeTxt = (e) => {
        setTextoInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && textoInput.trim() !== "") {
            setListaTareas([...listaTareas, textoInput]);
            setTextoInput('');
        }
    };

    const eliminarTarea = (indice) => {
        const nuevaLista = listaTareas.filter((_, i) => i !== indice);
        setListaTareas(nuevaLista);
    };

    return (
        <div className='PrincipalContenedor-General'>
            <div className='contSecundario'>
                <div className="input-group contenedorInput">
                    <input 
                        type="text"
                        className="form-control"
                        placeholder="What needs to be done?"
                        value={textoInput}
                        onChange={changeTxt}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div id='contItems' className="retornoInput">
                    {listaTareas.length === 0 ? (
                        <div className="no-tasks">No hay tareas, añadir tareas</div>
                    ) : (
                        listaTareas.map((tarea, index) => (
                            <div key={index} className="tarea-item d-flex justify-content-between">
                                {tarea}
                                <span 
                                    className="icono-eliminar" 
                                    onClick={() => eliminarTarea(index)}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className='ContainerItems'>
                {listaTareas.length} {listaTareas.length === 1 ? 'item' : 'items'}
            </div>
            
        </div>
        
    );
}

export default Contenido;
