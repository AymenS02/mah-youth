import { useState, forwardRef, useImperativeHandle } from "react";

const RegistrationQuestions = forwardRef((props, ref) => {
  const [questions, setQuestions] = useState([]);

  // Expose questions to parent component via ref
  useImperativeHandle(ref, () => ({
    getQuestions: () => questions,
    setQuestions: (newQuestions) => setQuestions(newQuestions)
  }));

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID ? crypto.randomUUID().split('-')[0] : Date.now(),
        text: "",
        type: "text",
        required: false,
        options: [], // For multiple choice/dropdown
      },
    ]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, { id: crypto.randomUUID ? crypto.randomUUID().split('-')[0] : Date.now(), text: "" }] }
          : q
      )
    );
  };

  const updateOption = (questionId, optionId, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text: value } : opt
              ),
            }
          : q
      )
    );
  };

  const removeOption = (questionId, optionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((opt) => opt.id !== optionId) }
          : q
      )
    );
  };

  const duplicateQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: crypto.randomUUID ? crypto.randomUUID().split('-')[0] : Date.now(),
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div className="border-t border-gray-700 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Registration Questions
        </h2>
        {questions.length > 0 && (
          <span className="text-sm text-gray-400">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700">
          <p className="text-gray-400 mb-4 px-4">
            No questions added yet. Start building your registration form!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-gray-800/50 rounded-xl p-4 md:p-5 border border-gray-700 hover:border-gray-600 transition"
            >
              {/* Question Header - Mobile Optimized */}
              <div className="flex items-start gap-3 mb-4">
                {/* Question Number */}
                <div className="flex items-center justify-center min-w-[32px] h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm flex-shrink-0 mt-1">
                  {index + 1}
                </div>

                {/* Question Input */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Enter your question"
                    value={q.text}
                    onChange={(e) =>
                      updateQuestion(q.id, "text", e.target.value)
                    }
                    className="w-full rounded-lg bg-gray-900 text-white px-4 py-3 md:py-2.5 outline-none focus:ring-2 focus:ring-accent placeholder:text-gray-500 text-base"
                  />
                </div>
              </div>

              {/* Question Options - Stacked on Mobile */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 mb-4 ml-0 md:ml-11">
                {/* Question Type */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm text-gray-400 font-medium">Type:</label>
                  <select
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(q.id, "type", e.target.value)
                    }
                    className="w-full sm:w-auto rounded-lg bg-gray-900 text-white px-4 py-3 md:py-1.5 text-base md:text-sm outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Dropdown</option>
                    <option value="radio">Multiple Choice</option>
                    <option value="checkbox">Checkboxes</option>
                  </select>
                </div>

                {/* Required Toggle - Larger Touch Target */}
                <label className="flex items-center gap-3 cursor-pointer group py-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) =>
                        updateQuestion(q.id, "required", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 md:w-11 md:h-6 bg-gray-700 rounded-full peer peer-checked:bg-accent transition peer-focus:ring-2 peer-focus:ring-accent/50"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 md:w-4 md:h-4 bg-white rounded-full transition peer-checked:translate-x-7 md:peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-base md:text-sm text-gray-400 group-hover:text-white transition">
                    Required {q.required && <span className="text-red-400">*</span>}
                  </span>
                </label>
              </div>

              {/* Options for Multiple Choice/Dropdown */}
              {(q.type === "select" ||
                q.type === "radio" ||
                q.type === "checkbox") && (
                <div className="mt-4 mb-4 ml-0 md:ml-11 space-y-3">
                  <label className="text-sm text-gray-400 font-medium">Options:</label>
                  {q.options.map((option, optIndex) => (
                    <div key={option.id} className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm min-w-[24px]">
                        {optIndex + 1}.
                      </span>
                      <input
                        type="text"
                        placeholder={`Option ${optIndex + 1}`}
                        value={option.text}
                        onChange={(e) =>
                          updateOption(q.id, option.id, e.target.value)
                        }
                        className="flex-1 rounded-lg bg-gray-900 text-white px-4 py-3 md:py-1.5 text-base md:text-sm outline-none focus:ring-2 focus:ring-accent"
                      />
                      <button
                        onClick={() => removeOption(q.id, option.id)}
                        className="text-gray-500 hover:text-red-400 transition min-w-[40px] h-[40px] md:min-w-[32px] md:h-[32px] flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(q.id)}
                    className="text-base md:text-sm text-accent hover:text-accent/80 transition py-2"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {/* Action Buttons - Simplified without Up/Down */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => duplicateQuestion(q)}
                  className="flex items-center justify-center gap-2 px-4 py-3 md:py-2 rounded-lg bg-gray-700 hover:bg-blue-600 transition text-white text-sm font-medium"
                  title="Duplicate question"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => removeQuestion(q.id)}
                  className="flex items-center justify-center gap-2 px-4 py-3 md:py-2 rounded-lg bg-red-600/20 hover:bg-red-600 transition text-red-400 hover:text-white text-sm font-medium"
                  title="Delete question"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Question Button - Fixed scroll issue */}
      <button
        type="button"
        onClick={addQuestion}
        className="mt-6 w-full sm:w-auto px-6 py-4 md:py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 active:bg-accent/80 transition-colors flex items-center justify-center gap-2 text-base"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Question
      </button>
    </div>
  );
});

RegistrationQuestions.displayName = 'RegistrationQuestions';

export default RegistrationQuestions;