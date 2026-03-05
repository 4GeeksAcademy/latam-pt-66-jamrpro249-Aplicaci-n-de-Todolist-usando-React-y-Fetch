import "../../styles/contenido.css";
import { useState, useEffect } from "react";
const Contenido = () => {
    const [textoInput, settextoInput] = useState("");
    const [listatextoInputs, setlistatextoInputs] = useState([]);
    const USUARIO = "jamrpro249";
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: "", message: "", variant: "primary" });
    const API_USER = "https://playground.4geeks.com/todo/users/";
    const API_TODO = "https://playground.4geeks.com/todo/todos/";
    const handleClose = () => setShowModal(false);

    useEffect(() => {
        tarea();
    }, []);

    const changeTxt = (e) => settextoInput(e.target.value);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            agregartextoInput();
        }
    };

    function tarea() {
        fetch(`${API_USER}${USUARIO}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                if (resp.status === 404) return crearUsuario();
                return resp.json();
            })
            .then((result) => {
                if (result && Array.isArray(result.todos)) {
                    setlistatextoInputs(result.todos);
                }
            })
            .catch(err => console.error("Error al obtener:", err));
    }

    function agregartextoInput() {
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

    function eliminartextoInput(id, index) {
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

    function eliminarUsuario() {
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

    function crearUsuario() {
        fetch(`${API_USER}${USUARIO}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }).then((resp) => {
            if (resp.ok) tarea();
        });
    }

    function crearUsuarioManual() {
        if (!nombreUsuario.trim()) return;

        const createUser = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: nombreUsuario }),
        };

        fetch(`${API_USER}${nombreUsuario}`, createUser)
            .then((resp) => {
                if (resp.ok) {
                    setModalConfig({
                        title: "¡Éxito!",
                        message: "Usuario creado exitosamente",
                        variant: "success"
                    });
                    setNombreUsuario("");
                } else {
                    setModalConfig({
                        title: "Error",
                        message: "No se pudo crear el usuario",
                        variant: "danger"
                    });
                }
                setShowModal(true);
            })
            .catch(err => {
                setModalConfig({ title: "Error crítico", message: "Fallo en la conexión", variant: "danger" });
                setShowModal(true);
            });
    }

    return (
        <div className="PrincipalContenedor-General">
            <div className="btns-container d-flex justify-content-end align-content-center" >

                <div className={`modal fade ${showModal ? 'show d-block' : 'd-none'}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className={`modal-header bg-${modalConfig.variant} text-white`}>
                                <h5 className="modal-title">{modalConfig.title}</h5>
                                <button type="button" className="btn-close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body">
                                <p>{modalConfig.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="btns-container d-flex justify-content-between align-content-center">
                    <div className="usuario-Manual">
                        <input
                            type="text"
                            className="form-control"
                            value={nombreUsuario}
                            placeholder="Crear nuevo usuario"
                            onChange={(e) => setNombreUsuario(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-sm btn-primary btnUser" onClick={crearUsuarioManual}>Aceptar</button>
                </div>

            </div>
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
                    <button className="btn btn-sm btn-success me-2" onClick={tarea}>Cargar Tareas</button>
                    <button className="btn btn-sm btn-danger" onClick={eliminarUsuario}>Borrar Todo</button>
                </div>
            </div>
        </div>
    );
};
export default Contenido;