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

function Home() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("Todos")) || [];
    setTodos(savedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem("Todos", JSON.stringify(todos));
  }, [todos]);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        { id: Date.now(), text: transcript || inputValue, completed: false },
      ]);
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: inputValue } : todo
        )
      );
      setEditingId(null);
    }
    setInputValue("");
    resetTranscript();
    inputRef.current?.focus();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        {/* <div className="keyboard-hints">
          <span>
            Press <kbd>Enter</kbd> to add | <kbd>/</kbd> to focus input |{" "}
            <kbd>Ctrl+Space</kbd> for voice
          </span>
        </div> */}

        <button className="logout-btn">
          <NavLink to={"/"} className="logout-link">
            Logout
            <CgLogOut className="logout-icon" />
          </NavLink>
        </button>
      </header>

      <main className="todo-app animate__animated animate__fadeIn">
        <h1 className="app-title">Voice Todo App 🎙️</h1>

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
          {todos.map((todo) => (
            <div
              className={`todo-item ${todo.completed ? "completed" : ""}`}
              key={todo.id}
            >
              <li className="todo-text">{todo.text}</li>

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
