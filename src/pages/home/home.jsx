import { useEffect, useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CgLogOut } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import "animate.css";
import "./home.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useTheme } from "../../Theme/ThemeContext";
import { MdWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

import { format } from 'date-fns';

function Home() {
  const { theme, toggleTheme } = useTheme();
  const styles = {
    light: { background: "#fff", color: "#333" },
    dark: { background: "#121212", color: "#fff" },
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const todoTexts = todos.map((todo) => todo.text);
    localStorage.setItem("Todos", JSON.stringify(todoTexts));
    console.log("todotexts:" + todoTexts);
  }, [todos]);

  useEffect(() => {
    const savedTodoTexts = JSON.parse(localStorage.getItem("Todos"));
    const restoredTodos = savedTodoTexts.map((text, index) => ({
      id: Date.now() + index,
      text,
      completed: true,
      category: "Personal",
    }));
    setTodos(restoredTodos);

    localStorage.setItem("abc", JSON.stringify(restoredTodos));

    const a = JSON.parse(localStorage.getItem("abc"));
    console.log("savedTodo: " + savedTodoTexts + " this is a:" + a);
  }, []);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  //search todos
  const filteredTodos = todos.filter(
    (todo) => todo.text.toLowerCase().includes(searchTerm.toLowerCase()),
    (todo) => todo.category.includes(searchCategory)
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Add/Update todo on Enter key
      if (e.key === "Enter" && (inputValue || transcript)) {
        handleAddUpdateTodo();
      }

      // Focus input on '/' key
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Start listening on Ctrl+Space
      if (e.ctrlKey && e.key === " ") {
        e.preventDefault();
        startListening();
      }

      // Mark imp on Shift
      if (e.key === "*") {
        setIsChecked(!isChecked);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputValue, transcript, editingId, todos, isChecked]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <span className="browser-warning">
        Your browser doesn't support speech recognition.
      </span>
    );
  }

  const startListening = () => {
    SpeechRecognition.startListening();
  };

  const handleEdit = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setInputValue(todoToEdit.text);
    setSelectedCategory(todoToEdit.category);
    setIsChecked(todoToEdit.imp);
    setEditingId(id);
    inputRef.current?.focus();
  };

  const handleAddUpdateTodo = () => {
    if (editingId === null) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: transcript || inputValue,
          completed: false,
          category: selectedCategory,
          imp: isChecked,
        },
      ]);
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId
            ? {
                ...todo,
                text: inputValue,
                category: selectedCategory,
                imp: isChecked,
              }
            : todo
        )
      );
      setEditingId(null);
    }
    setInputValue("");
    setIsChecked(false);
    setSelectedCategory("Personal");
    resetTranscript();
    inputRef.current?.focus();
  };

  //select category
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="app-container" data-theme={theme}>
      <header className="app-header">
        <button onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <MdWbSunny />}
        </button>

        <button className="logout-btn">
          <NavLink to={"/"} className="logout-link">
            Logout
            <CgLogOut className="logout-icon" />
          </NavLink>
        </button>
      </header>

      <main
        className="todo-app animate__animated animate__fadeIn"
        style={styles[theme]}
      >
        <h1 className="app-title">Voice Todo App 🎙️</h1>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="search-category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="Search">Search</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Home">Home</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        <div className="voice-controls">
          <button
            className={`voice-btn ${listening ? "listening" : ""}`}
            onClick={startListening}
            disabled={listening}
          >
            {listening ? "Listening..." : "🎤 Speak Todo"}
          </button>
          <button
            className="voice-btn stop-btn"
            onClick={SpeechRecognition.stopListening}
          >
            Stop
          </button>
        </div>

        <div className="input-container">
          <input
            ref={inputRef}
            className="todo-input"
            type="text"
            value={transcript || inputValue}
            placeholder="Add a todo... (Press Enter to submit)"
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="delayed-hover">
            <div
              onClick={() => setIsChecked(!isChecked)}
              value={isChecked}
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #4A90E2",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: isChecked ? "#4A90E2" : "transparent",
                color: isChecked ? "white" : "transparent",
              }}
            >
              {isChecked && "✓"}
            </div>

            <p class="delayed-text">Important!</p>
          </div>

          <div className="category">
            <select
              className="category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Home">Home</option>
              <option value="Shopping">Shopping</option>
            </select>
            {/* {selectedGender && <p>Selected Gender: {selectedGender}</p>} */}
          </div>

          <button
            className="add-btn"
            onClick={() => {
              if (transcript || inputValue) {
                handleAddUpdateTodo();
              }
            }}
          >
            {editingId === null ? "Add Todo" : "Update Todo"}
          </button>
        </div>

        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <div
              className={`todo-item ${todo.completed ? "completed" : ""} ${
                todo.imp ? "red" : ""
              }`}
              key={todo.id}
            >
           <p> { format(new Date(), 'MMMM do yyyy, h:mm:ss a')}</p> 
              <li className="todo-text">{todo.text}</li>

              <p className="todo-category">{todo.category}</p>

              <div className="todo-actions">
                <input
                  type="checkbox"
                  className="complete-checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    setTodos(
                      todos.map((t) =>
                        t.id === todo.id ? { ...t, completed: !t.completed } : t
                      )
                    );
                  }}
                />

                <button
                  className="action-btn delete-btn"
                  onClick={() => {
                    setTodos(todos.filter((t) => t.id !== todo.id));
                  }}
                >
                  <MdDelete />
                </button>

                <button
                  className="action-btn edit-btn"
                  onClick={() => {
                    handleEdit(todo.id);
                  }}
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          ))}
        </ul>

        {todos.length > 0 && (
          <button
            className="clear-all-btn"
            onClick={() => {
              setTodos([]);
            }}
          >
            Clear All
          </button>
        )}
      </main>
    </div>
  );
}

export default Home;
