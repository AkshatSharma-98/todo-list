import { useState, useEffect } from 'react'

const API_BASE = process.env.PORT ? `http://localhost:${process.env.PORT}` : "http://localhost:3001"

function App() {

  const [todos, setTodos] = useState([])
  const [popupActive, setPopupActive] = useState(false)
  const [newTodo, setNewTodo] = useState("")
  const [editPopupID, setEditPopupID] = useState(-1)
  const [updatedTodo, setUpdatedTodo] = useState("")

  useEffect(() => {
    GetTodos()
  }, [])

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("ERROR: ", err))
  }

  const completeTodo = async id => {
    const data = await fetch(API_BASE + "/todo/complete/" + id)
      .then(res => res.json())

    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete
      }
      return todo
    }))
  }

  const deleteTodo = async id => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, { method: "DELETE" })
      .then(res => res.json())

    setTodos(todos => todos.filter(todo => todo._id !== data._id))
  }

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: newTodo
        })
      })
      .then(res => res.json())

    setTodos([...todos, data])
    setPopupActive(false)
    setNewTodo("")
  }

  const updateTodo = async id => {
    const data = await fetch(API_BASE + '/todo/update/' + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: updatedTodo
      })
    })
      .then(res => res.json())

    setTodos(todos.map(todo => {
      if (todo._id === data._id) {
        todo.text = updatedTodo
      }
      return todo
    }))
    setEditPopupID(-1)
    setUpdatedTodo("")
  }

  return (
    <div className="App">
      <h1>Welcome Akshat!</h1>
      <h4>Your Tasks!</h4>

      <div className="todos">
        {
          todos.map(todo => (
            <>
              {editPopupID !== todo._id ? (
                <div
                  className={"todo " + (todo.complete ? " is-complete" : "")}
                  key={todo._id}>
                  <div className="checkbox" onClick={() => completeTodo(todo._id)}></div>
                  <div className="text">{todo.text}</div>
                  <div className="delete-todo"
                    onClick={() => deleteTodo(todo._id)}>X</div>
                  <div className='edit' onClick={() => setEditPopupID(todo._id)}>✎</div>
                </div>
              ) : (
                <div className='edit-nav'>
                  <div className='delete-todo' onClick={() => setEditPopupID(-1)}>X</div>
                  <input type="text" onChange={e => setUpdatedTodo(e.target.value)} />
                  <button onClick={() => updateTodo(todo._id)}>DONE!</button>
                </div>
              )
              }
            </>
          ))
        }
      </div>
      <div className='addPopup' onClick={() => setPopupActive(true)}><h1>+</h1></div>

      {popupActive ? (
        <div className='popup'>
          <div className='closePopup' onClick={() => setPopupActive(false)}>X</div>
          <h3>Add Task</h3>
          <div className='content'>
            <input type="text"
              className='add-todo-input'
              onChange={e => setNewTodo(e.target.value)}
              value={newTodo}
            />
          </div>
          <div className='button' onClick={addTodo}>Create Task</div>
        </div>
      ) : ''}

    </div>
  );
}

export default App;
