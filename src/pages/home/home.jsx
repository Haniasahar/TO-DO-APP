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
  const [imp, setImp] = useState(false);

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
      completed: false,
      category: "Work",
    }));
    setTodos(restoredTodos);

    localStorage.setItem("abc", JSON.stringify(restoredTodos));

    const a = JSON.parse(localStorage.getItem("abc"));
    console.log("savedTodo: " + savedTodoTexts + " this is a " + a);
  }, []);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  //search todos
  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputValue, transcript, editingId, todos]);

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
        },
      ]);
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId
            ? { ...todo, text: inputValue, category: selectedCategory }
            : todo
        )
      );
      setEditingId(null);
    }
    setInputValue("");
    resetTranscript();
    inputRef.current?.focus();
  };

  //select category
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleimp = () => {
    setImp(true);
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

          <div className="checkbox">
            <input
              type="checkbox"
              // checked={todo.imp}
              className="complete-checkbox"
              onChange={handleimp}
            />
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
                setImp ? "red" : ""
              }`}
              key={todo.id}
            >
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
