import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, AlertCircle } from 'lucide-react';

// Mock test data
const mockTest = {
  id: '1',
  title: 'Physics Chapter 1-3 Test',
  timeLimit: 45, // minutes
  questions: [
    {
      id: 'q1',
      text: 'What is the SI unit of force?',
      options: [
        { id: 'a', text: 'Newton' },
        { id: 'b', text: 'Joule' },
        { id: 'c', text: 'Watt' },
        { id: 'd', text: 'Pascal' },
      ],
      correctAnswer: 'a',
    },
    {
      id: 'q2',
      text: 'Which of the following is a vector quantity?',
      options: [
        { id: 'a', text: 'Mass' },
        { id: 'b', text: 'Temperature' },
        { id: 'c', text: 'Velocity' },
        { id: 'd', text: 'Time' },
      ],
      correctAnswer: 'c',
    },
    {
      id: 'q3',
      text: 'What is the formula for kinetic energy?',
      options: [
        { id: 'a', text: 'KE = mgh' },
        { id: 'b', text: 'KE = 1/2 mv²' },
        { id: 'c', text: 'KE = Fd' },
        { id: 'd', text: 'KE = P/t' },
      ],
      correctAnswer: 'b',
    },
    {
      id: 'q4',
      text: 'Which law of motion states that "For every action, there is an equal and opposite reaction"?',
      options: [
        { id: 'a', text: 'First law' },
        { id: 'b', text: 'Second law' },
        { id: 'c', text: 'Third law' },
        { id: 'd', text: 'Fourth law' },
      ],
      correctAnswer: 'c',
    },
    {
      id: 'q5',
      text: 'What is the acceleration due to gravity on Earth (approximate value)?',
      options: [
        { id: 'a', text: '5 m/s²' },
        { id: 'b', text: '9.8 m/s²' },
        { id: 'c', text: '15 m/s²' },
        { id: 'd', text: '3.7 m/s²' },
      ],
      correctAnswer: 'b',
    },
  ],
};

const TestTaking = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState(mockTest);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(test.timeLimit * 60); // in seconds
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle timer
  useEffect(() => {
    if (!testCompleted && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testCompleted, showResults]);

  // Get current question
  const currentQuestion = test.questions[currentQuestionIndex];

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Handle flagging questions
  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Go to specific question
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Handle test submission
  const handleSubmitTest = () => {
    setTestCompleted(true);
    
    // Calculate score
    let correctAnswers = 0;
    test.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / test.questions.length) * 100);
    setScore(calculatedScore);
    setShowResults(true);
  };

  // Confirm before submitting
  const confirmSubmit = () => {
    const unansweredCount = test.questions.length - Object.keys(answers).length;
    
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question${
          unansweredCount > 1 ? 's' : ''
        }. Are you sure you want to submit?`
      );
      
      if (confirmSubmit) {
        handleSubmitTest();
      }
    } else {
      handleSubmitTest();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {!showResults ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Test Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center">
              <div className={`flex items-center ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                <Clock className="h-5 w-5 mr-1" />
                <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={confirmSubmit}
                className="ml-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={testCompleted}
              >
                Submit Test
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Panel */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Question {currentQuestionIndex + 1}
                  </h2>
                  <button
                    onClick={() => toggleFlagQuestion(currentQuestion.id)}
                    className={`flex items-center text-sm font-medium ${
                      flaggedQuestions.includes(currentQuestion.id)
                        ? 'text-amber-600'
                        : 'text-gray-500 hover:text-amber-600'
                    }`}
                  >
                    <Flag
                      className={`h-4 w-4 mr-1 ${
                        flaggedQuestions.includes(currentQuestion.id) ? 'fill-amber-600' : ''
                      }`}
                    />
                    {flaggedQuestions.includes(currentQuestion.id) ? 'Flagged' : 'Flag for review'}
                  </button>
                </div>

                <p className="text-gray-800 mb-6">{currentQuestion.text}</p>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                            answers[currentQuestion.id] === option.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {answers[currentQuestion.id] === option.id && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-gray-800">{option.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                    currentQuestionIndex === 0
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === test.questions.length - 1}
                  className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                    currentQuestionIndex === test.questions.length - 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Question Navigator */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Question Navigator</h2>
                <div className="grid grid-cols-5 gap-2">
                  {test.questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={`w-full h-10 rounded-md flex items-center justify-center text-sm font-medium ${
                        currentQuestionIndex === index
                          ? 'bg-blue-600 text-white'
                          : answers[question.id]
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : flaggedQuestions.includes(question.id)
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded-sm"></div>
                    <span className="ml-2 text-sm text-gray-600">Not answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-green-200 rounded-sm"></div>
                    <span className="ml-2 text-sm text-gray-600">Answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded-sm"></div>
                    <span className="ml-2 text-sm text-gray-600">Flagged for review</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                    <span className="ml-2 text-sm text-gray-600">Current question</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Answered:</span>
                    <span className="font-medium text-gray-900">
                      {Object.keys(answers).length} / {test.questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Flagged:</span>
                    <span className="font-medium text-gray-900">
                      {flaggedQuestions.length} / {test.questions.length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={confirmSubmit}
                  className="w-full mt-6 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={testCompleted}
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Test Completed!</h1>
              <p className="text-gray-600 mt-2">You've completed {test.title}</p>
            </div>

            <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Results</h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Score:</span>
                <span className="text-xl font-bold text-gray-900">{score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                  className={`h-2.5 rounded-full ${
                    score >= 70 ? 'bg-green-600' : score >= 50 ? 'bg-yellow-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Correct Answers:</span>
                  <span className="font-medium text-gray-900">
                    {test.questions.filter(
                      (q) => answers[q.id] === q.correctAnswer
                    ).length} / {test.questions.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Taken:</span>
                  <span className="font-medium text-gray-900">
                    {formatTime(test.timeLimit * 60 - timeRemaining)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900">Review Questions</h2>
              {test.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Question {index + 1}: {question.text}
                  </h3>
                  <div className="space-y-3 mb-6">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-4 ${
                          option.id === question.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : answers[question.id] === option.id && option.id !== question.correctAnswer
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              option.id === question.correctAnswer
                                ? 'border-green-500 bg-green-500'
                                : answers[question.id] === option.id && option.id !== question.correctAnswer
                                ? 'border-red-500 bg-red-500'
                                : answers[question.id] === option.id
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {(answers[question.id] === option.id ||
                              option.id === question.correctAnswer) && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span
                            className={`${
                              option.id === question.correctAnswer
                                ? 'text-green-800'
                                : answers[question.id] === option.id && option.id !== question.correctAnswer
                                ? 'text-red-800'
                                : 'text-gray-800'
                            }`}
                          >
                            {option.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {answers[question.id] !== question.correctAnswer && (
                    <div className="flex items-start bg-blue-50 border border-blue-100 rounded-md p-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Explanation</p>
                        <p className="text-sm text-blue-700 mt-1">
                          The correct answer is option{' '}
                          {question.options.find((o) => o.id === question.correctAnswer)?.text}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestTaking;