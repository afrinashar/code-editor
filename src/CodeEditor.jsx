import React, { useRef, useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { FaPlay } from 'react-icons/fa';
import './CodeEditor.css';

const CodeEditor = ({ codings }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(codings);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [editorOptions, setEditorOptions] = useState({
    fontSize: 16,
    minimap: { enabled: true },
    automaticLayout: true,
    lineNumbers: "on",
    wordWrap: "on",
  });
  const [output, setOutput] = useState(""); // Output of the code execution
  const [outputVisible, setOutputVisible] = useState(true); // Toggle output visibility
  const monaco = useMonaco();

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const changeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const changeTheme = (e) => {
    setTheme(e.target.value);
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const updateEditorOption = (option, value) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value,
    }));
  };

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      monaco.editor.defineTheme("myCustomTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [{ background: "1E1E1E" }],
        colors: {
          "editor.background": "#1E1E1E",
          "editorCursor.foreground": "#F8C51C",
        },
      });
    }
  }, [monaco]);

  // Function to execute the code
  const runCode = () => {
    try {
      if (language === "javascript") {
        const result = eval(code); // Evaluates JavaScript code
        setOutput(result !== undefined ? result.toString() : "No output");
      } else {
        setOutput("Execution for this language is not supported.");
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  return (
    <div className="code-editor-container">
      {/* Flexbox layout */}
      <div className="editor-output-container">
        {/* Code Editor on the Left */}
        <div className="editor-section">
          {/* Toolbar */}
          <div className="editor-toolbar">
            <div className="editor-control">
              <label className="control-label">Language:</label>
              <select className="control-select" value={language} onChange={changeLanguage}>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                {/* <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="python">Python</option> */}
              </select>
            </div>

            {/* <div className="editor-control">
              <label className="control-label">Theme:</label>
              <select className="control-select" value={theme} onChange={changeTheme}>
                <option value="vs-dark">Dark Theme</option>
                <option value="vs-light">Light Theme</option>
                <option value="myCustomTheme">Custom Theme</option>
              </select>
            </div> */}

            <div className="editor-control">
              <label className="control-label">Font Size:</label>
              <input
                type="range"
                className="font-slider"
                value={editorOptions.fontSize}
                onChange={(e) => updateEditorOption("fontSize", parseInt(e.target.value))}
                min="12"
                max="24"
              />
              <span>{editorOptions.fontSize}px</span>
            </div>

            <button className="run-button" onClick={runCode}>
              <FaPlay /> Run Code
            </button>
          </div>

          {/* Code Editor */}
          <Editor
            height="70vh"
            language={language}
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={editorOptions}
            theme={theme}
            className="editor"
          />
        </div>

        {/* Output Section on the Right */}
        <div className="output-section">
          <button
            className="toggle-output-button"
            onClick={() => setOutputVisible(!outputVisible)}
          >
            {outputVisible ? "Hide Output" : "Show Output"}
          </button>
          {outputVisible && (
            <div className="output-box">
              <h3>Output:</h3>
              <pre>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
