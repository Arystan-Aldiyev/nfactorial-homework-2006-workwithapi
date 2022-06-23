import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { TodoistApi } from '@doist/todoist-api-typescript'

/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [doneItems, setDoneItems] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
  const [toggledActive, setToggledActive] = useState(true);
  const [searchValue, setSearchValue] = useState("");


  const api = new TodoistApi('c5eade728c554e5dc0e99318cfbcbef507e410c3')

  const loadTasks = () => {
    api.getTasks()
      .then((tasks) => setActiveItems(tasks))
      .catch((error) => console.log(error))

    axios.get('https://api.todoist.com/sync/v8/completed/get_all', {
      headers: {
        Authorization: 'Bearer c5eade728c554e5dc0e99318cfbcbef507e410c3'
      }
    }).then((response) => setDoneItems(response.data.items))
  }

  useEffect(() => {
    api.getTasks()
      .then((tasks) => setActiveItems(tasks))
      .catch((error) => console.log(error))

    axios.get('https://api.todoist.com/sync/v8/completed/get_all', {
      headers: {
        Authorization: 'Bearer c5eade728c554e5dc0e99318cfbcbef507e410c3'
      }
    }).then((response) => setDoneItems(response.data.items))

  }, []);

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleKeyPress = e => {
    if (e.keyCode === 13) {
      handleAddItem();
    }
  }

  const handleAddItem = () => {
    api.addTask({
      content: `${itemToAdd}`,
    })

      .then(() => loadTasks())
      .catch((error) => console.log(error))
    setItemToAdd("")

    // axios.post(`${BACKEND_URL}/todos`, {
    //   label: itemToAdd,
    //   done: false
    // }).then((response) => {
    //   setItems([...items, response.data])
    // })
    // setItemToAdd("");
  };


  const toggleItemDone = ({ id }) => {
    api.closeTask(id)
      .then(() => loadTasks())
      .catch((error) => console.log(error))
  };

  const toggleItemNotDone = ({ id }) => {
  };

  // N => map => N
  // N => filter => 0...N
  const handleItemDelete = (id) => {
    // axios.delete('https://api.todoist.com/sync/v8/completed/get_all', {
    //   headers: {
    //     Authorization: 'Bearer c5eade728c554e5dc0e99318cfbcbef507e410c3'
    //   },
    //   data: {
    //     id: { id }
    //   }
    // }).then(() => console.log("yeah boy"))
  };

  // useEffect(() => {
  //   console.log(searchValue)
  //   axios.get(`${BACKEND_URL}/todos/?filter=${searchValue}`).then((response) => {
  //     setItems(response.data);
  //   })
  // }, [searchValue])


  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={() => setToggledActive(!toggledActive)}>
          {toggledActive ? "Completed" : "Active"}
        </button>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {toggledActive ? (
          activeItems.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          doneItems.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemNotDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        )
        }

        {/* {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )} */}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
          onKeyUp={handleKeyPress}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div >
  );
}

export default App;