import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { FileText, Upload, Clock, List, BookOpen, AlertCircle, HelpCircle, Plus, Trash2 } from 'lucide-react';

const TestCreation = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pdfId = searchParams.get('pdf');

  // State for PDF upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // State for test configuration
  const [testTitle, setTestTitle] = useState('');
  const [testType, setTestType] = useState('chapter'); // 'section', 'chapter', or 'full'
  const [timeLimit, setTimeLimit] = useState(30);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(20);
  const [difficultyLevel, setDifficultyLevel] = useState('medium'); // 'easy', 'medium', or 'hard'

  // Mock data for PDF structure
  const [pdfStructure, setPdfStructure] = useState({
    title: pdfId ? 'Physics Textbook' : '',
    chapters: [
      {
        id: 'ch1',
        title: 'Chapter 1: Introduction to Physics',
        sections: [
          { id: 'sec1-1', title: 'Section 1.1: Basic Concepts' },
          { id: 'sec1-2', title: 'Section 1.2: Units and Measurements' },
        ],
      },
      {
        id: 'ch2',
        title: 'Chapter 2: Mechanics',
        sections: [
          { id: 'sec2-1', title: 'Section 2.1: Motion in One Dimension' },
          { id: 'sec2-2', title: 'Section 2.2: Newton\'s Laws of Motion' },
          { id: 'sec2-3', title: 'Section 2.3: Work and Energy' },
        ],
      },
      {
        id: 'ch3',
        title: 'Chapter 3: Thermodynamics',
        sections: [
          { id: 'sec3-1', title: 'Section 3.1: Temperature and Heat' },
          { id: 'sec3-2', title: 'Section 3.2: Laws of Thermodynamics' },
        ],
      },
    ],
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setUploadError('Please select a PDF file');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
    }
  };

  // Simulate file upload
  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          // Set mock PDF structure
          setPdfStructure({
            title: selectedFile.name.replace('.pdf', ''),
            chapters: pdfStructure.chapters,
          });
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  // Toggle chapter selection
  const toggleChapter = (chapterId: string) => {
    setSelectedChapters((prev) => {
      if (prev.includes(chapterId)) {
        return prev.filter((id) => id !== chapterId);
      } else {
        return [...prev, chapterId];
      }
    });
  };

  // Toggle section selection
  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((id) => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  };

  // Handle test creation
  const handleCreateTest = () => {
    if (!testTitle) {
      alert('Please enter a test title');
      return;
    }

    if (testType === 'chapter' && selectedChapters.length === 0) {
      alert('Please select at least one chapter');
      return;
    }

    if (testType === 'section' && selectedSections.length === 0) {
      alert('Please select at least one section');
      return;
    }

    // In a real app, we would save the test configuration to the database here
    // For now, we'll just navigate to the dashboard
    navigate('/dashboard');
  };

  // Set default test title based on PDF title and test type
  useEffect(() => {
    if (pdfStructure.title) {
      if (testType === 'full') {
        setTestTitle(`${pdfStructure.title} - Full Length Test`);
      } else if (testType === 'chapter' && selectedChapters.length > 0) {
        const chapterNumbers = selectedChapters
          .map((chId) => {
            const chapter = pdfStructure.chapters.find((ch) => ch.id === chId);
            return chapter ? chapter.title.match(/Chapter (\d+)/)?.[1] : null;
          })
          .filter(Boolean)
          .join(', ');
        setTestTitle(`${pdfStructure.title} - Chapters ${chapterNumbers} Test`);
      } else if (testType === 'section' && selectedSections.length > 0) {
        setTestTitle(`${pdfStructure.title} - Sections Test`);
      } else {
        setTestTitle(`${pdfStructure.title} - ${testType.charAt(0).toUpperCase() + testType.slice(1)} Test`);
      }
    }
  }, [pdfStructure.title, testType, selectedChapters, selectedSections]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Test</h1>

          {/* Step 1: Upload or Select PDF */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                1
              </span>
              Upload or Select PDF
            </h2>

            {!pdfId && !uploadComplete ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <FileText className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-sm font-medium text-gray-900">
                    {selectedFile ? selectedFile.name : 'Click to upload a PDF file'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">PDF files only, max 50MB</span>
                </label>

                {selectedFile && !isUploading && !uploadComplete && (
                  <button
                    onClick={handleUpload}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF
                  </button>
                )}

                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Uploading... {uploadProgress}%</p>
                  </div>
                )}

                {uploadError && (
                  <div className="mt-4 text-sm text-red-600 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {uploadError}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    {pdfStructure.title || 'PDF Selected'}
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">
                    {pdfStructure.chapters.length} chapters, {pdfStructure.chapters.reduce(
                      (acc, chapter) => acc + chapter.sections.length,
                      0
                    )}{' '}
                    sections
                  </p>
                </div>
                {!pdfId && (
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadComplete(false);
                      setPdfStructure({ ...pdfStructure, title: '' });
                    }}
                    className="ml-auto text-sm text-blue-600 hover:text-blue-800"
                  >
                    Change PDF
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Configure Test */}
          {(uploadComplete || pdfId) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                  2
                </span>
                Configure Test
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="test-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Test Title
                  </label>
                  <input
                    type="text"
                    id="test-title"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="Enter test title"
                  />
                </div>

                <div>
                  <label htmlFor="test-type" className="block text-sm font-medium text-gray-700 mb-1">
                    Test Type
                  </label>
                  <select
                    id="test-type"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                  >
                    <option value="section">Section-wise Test</option>
                    <option value="chapter">Chapter-wise Test</option>
                    <option value="full">Full-length Test</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="time-limit" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Limit (minutes)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="time-limit"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                      min="1"
                    />
                    <Clock className="h-5 w-5 text-gray-400 ml-2" />
                  </div>
                </div>

                <div>
                  <label htmlFor="question-count" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Questions
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="question-count"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      min="1"
                    />
                    <List className="h-5 w-5 text-gray-400 ml-2" />
                  </div>
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Select Content */}
          {(uploadComplete || pdfId) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                  3
                </span>
                Select Content
              </h2>

              {testType === 'full' ? (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800">
                      Full-length test will include questions from the entire PDF.
                    </p>
                  </div>
                </div>
              ) : testType === 'chapter' ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Select Chapters</h3>
                    <button
                      onClick={() => {
                        if (selectedChapters.length === pdfStructure.chapters.length) {
                          setSelectedChapters([]);
                        } else {
                          setSelectedChapters(pdfStructure.chapters.map((ch) => ch.id));
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {selectedChapters.length === pdfStructure.chapters.length
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    {pdfStructure.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="border-b border-gray-200 last:border-b-0 p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={chapter.id}
                            checked={selectedChapters.includes(chapter.id)}
                            onChange={() => toggleChapter(chapter.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={chapter.id} className="ml-2 text-sm text-gray-700">
                            {chapter.title}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Select Sections</h3>
                    <button
                      onClick={() => {
                        const allSections = pdfStructure.chapters.flatMap((ch) =>
                          ch.sections.map((sec) => sec.id)
                        );
                        if (selectedSections.length === allSections.length) {
                          setSelectedSections([]);
                        } else {
                          setSelectedSections(allSections);
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {selectedSections.length ===
                      pdfStructure.chapters.reduce((acc, ch) => acc + ch.sections.length, 0)
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    {pdfStructure.chapters.map((chapter) => (
                      <div key={chapter.id} className="border-b border-gray-200 last:border-b-0">
                        <div className="p-3 bg-gray-50 font-medium text-sm text-gray-700">
                          {chapter.title}
                        </div>
                        <div>
                          {chapter.sections.map((section) => (
                            <div
                              key={section.id}
                              className="border-t border-gray-200 p-3 pl-6 hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={section.id}
                                  checked={selectedSections.includes(section.id)}
                                  onChange={() => toggleSection(section.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={section.id} className="ml-2 text-sm text-gray-700">
                                  {section.title}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create Test Button */}
          {(uploadComplete || pdfId) && (
            <div className="flex justify-end">
              <button
                onClick={handleCreateTest}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCreation;