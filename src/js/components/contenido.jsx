import "../../styles/contenido.css";
import { useState, useEffect } from "react";

const Contenido = () => {
    const [textoInput, settextoInput] = useState("");
    const [listatextoInputs, setlistatextoInputs] = useState([]);
    const USUARIO = "jamrpro249";
    const API_USER = "https://playground.4geeks.com/todo/users/";
    const API_TODO = "https://playground.4geeks.com/todo/todos/";

    useEffect(() => {
        obtenertextoInput();
    }, []);

    const changeTxt = (e) => settextoInput(e.target.value);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            agregartextoInput();
        }
    };

    const obtenertextoInput = () => {
        fetch(`${API_USER}${USUARIO}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                if (resp.status === 422) return crearUsuario();
                return resp.json();
            })
            .then((result) => {
                if (result && Array.isArray(result.todos)) {
                    setlistatextoInputs(result.todos);
                }
            })
            .catch(err => console.error("Error al obtener:", err));
    }

    const agregartextoInput = () => {
        if (textoInput.trim() !== "") {
            const nueva = { label: textoInput, is_done: false };

            fetch(`${API_TODO}${USUARIO}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nueva),
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setlistatextoInputs([...listatextoInputs, data]);
                    settextoInput("");
                })
                .catch(err => console.error("Error al agregar:", err));
        }
    }

    const eliminartextoInput = (id, index) => {
        fetch(`${API_TODO}${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                if (resp.ok) {
                    const nuevaLista = listatextoInputs.filter((_, i) => i !== index);
                    setlistatextoInputs(nuevaLista);
                }
            })
            .catch(err => console.error("Error al eliminar:", err));
    }

    const eliminarUsuario = () => {
        fetch(`${API_USER}${USUARIO}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).then((resp) => {
            if (resp.ok) {
                setlistatextoInputs([]);
                crearUsuario();
            }
        });
    }

    const crearUsuario = () => {
        fetch(`${API_USER}${USUARIO}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }).then((resp) => {
            if (resp.ok) obtenertextoInput();
        });
    }
    return (
        <div className="PrincipalContenedor-General">
            <div className="contSecundario">
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
                <div id="contItems" className="retornoInput">
                    {listatextoInputs.length === 0 ? (
                        <div className="no-tasks p-3 text-center">No hay tareas, añadir tareas</div>
                    ) : (
                        listatextoInputs.map((item, index) => (
                            <div key={item.id || index} className="tarea-item d-flex justify-content-between align-items-center p-2 border-bottom">
                                {item.label}
                                <span
                                    className="icono-eliminar"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => eliminartextoInput(item.id, index)}
                                >
                                    <i className="bi bi-x-lg text-danger"></i>
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="ContainerItems d-flex justify-content-between align-items-center p-2">
                <span>{listatextoInputs.length} items left</span>
                <div className="btns-container">
                    <button className="btn btn-sm btn-success me-2" onClick={obtenertextoInput}>Cargar Tareas</button>
                    <button className="btn btn-sm btn-danger" onClick={eliminarUsuario}>Eliminar Todo</button>
                </div>
            </div>
        </div>
    );
};
export default Contenido;