import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

import { auth, db } from './firebaseConfig'
import Loading from './components/Loading';
import Header from './components/Header';


function App() {
  
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false)

  const [todoText, setTodoText] = useState('')
  const [todoCompleted, setTodoCompleted] = useState(false)
  const [updateTodo, setUpdateTodo] = useState({})

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  
  const fetchTodos = async () => {

    const q = query(collection(db, "todos"), where("userId", "==", currentUser.uid));

    const querySnapshot = await getDocs(q);
    setTodos(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));

  }

  const reset = () => {

    setTodoText('')
    setUpdateTodo({});
    setTodoText('');
    setTodoCompleted(false);
    setShowModal(false)

  }
  
  

  useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if(user) {
        setCurrentUser(user);

        const q = query(collection(db, "todos"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setTodos(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
        setLoading(false);

      } else {
        setCurrentUser(null);
        setLoading(false);
        navigate('/login');
      }
    })
    return () => {
      unsubscribe();
      setLoading(false);
    }


  }, [navigate])

  const createTodo = async () =>{
    setLoading(true);
    if(todoText === ''){
      return alert('Please enter a todo')
    }
    setShowModal(false);

    


    try {
      if(updateTodo.id){
       
        const todoRef = doc(db, "todos", updateTodo.id);
        await updateDoc(todoRef, {
          title: todoText,
          complete: todoCompleted
        })
        
        await fetchTodos();
        
        reset();
        return setLoading(false);

      }

      await addDoc(collection(db, "todos"), {
        title: todoText,
        complete: todoCompleted,
        userId: currentUser.uid,
      });
      // Get updated todos from firebase
      reset();
      await fetchTodos();
      return setLoading(false);

    } catch (error) {
      console.log(error)
    }

  }

  const markComplete = async (id) =>{
    setLoading(true);
    const todo = todos.find(todo => todo.id === id)
    
    if(todo){

      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, {
        complete: !todo.complete
      });
      await fetchTodos()
    }

    return setLoading(false);
  }

  const editTodo = (id) =>{

    const todo = todos.find(todo => todo.id === id)
    if(todo){
      setUpdateTodo(todo)
      setTodoText(todo.title);
      setTodoCompleted(todo.complete);
    }
    setShowModal(true)

  }
  const deleteTodo = async (id) =>{
    setLoading(true);
    const todoDoc = doc(db, "todos", id);
    await deleteDoc(todoDoc);
    await fetchTodos();

    return setLoading(false);
  }

  return (
    
    <div className="container">
      {loading && 
        <Loading />
      }
      {/* Header section */}
      <Header/>
      
      { showModal &&

        <div className="overlay">
          <div className="todo--form-card">
            <ion-icon onClick={() => setShowModal(false)} class="todo--close-icon" name="close-circle-outline"></ion-icon>
            <div className="todo--col">
              <input placeholder="Todo title" autoFocus={true} className="todo--text-input" type="text" value={todoText} onChange={(e) => setTodoText(e.target.value)} />
              <div>
                <input id="todo-checkbox" className="todo--checkbox" type="checkbox" defaultChecked={todoCompleted} onChange={(e) => setTodoCompleted(!todoCompleted)} />
                {todoCompleted ?<span>Mark as incomplete</span> : <span>Mark as complete</span>}
              </div>
            </div>
            <button onClick={() => createTodo()} className="todo--button">Save</button>
          </div>
        </div>
      }
      { todos.length > 0 ?
        todos.map((todo) => (

          <div className="todo--card" key={todo.id}>
            <div className="todo--wrapper">
              <p className={`todo--text ${todo.complete && 'done'}`}>{todo.title}</p>
              <div className="todo--actions">
                <ion-icon class="todo--icon" name="create-outline" onClick={() => editTodo(todo.id)}></ion-icon>
                { todo.complete ? <ion-icon class="todo--icon" name="checkbox" onClick={()=> markComplete(todo.id)}></ion-icon> : <ion-icon class="todo--icon" name="square-outline" onClick={()=> markComplete(todo.id)}></ion-icon>}
                <ion-icon class="todo--icon" name="trash-outline" onClick={() => deleteTodo(todo.id)}></ion-icon>
              </div>
            </div>
          </div>
        ))
      :
        <div className='todo--empty'>Sorry, there a no todos</div>
      }
      

      <div className="todo--add-new">
      <ion-icon onClick={() => setShowModal(true)} class="todo--add-icon" name="add-outline"></ion-icon>
      </div>
    </div>
  );
}

export default App;
