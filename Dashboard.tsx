import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { FileText, Clock, CheckCircle, BarChart2, BookOpen, Plus, Search } from 'lucide-react';

// Mock data for demonstration
const mockTests = [
  {
    id: '1',
    title: 'Physics Chapter 1-3 Test',
    type: 'chapter',
    questionsCount: 25,
    timeLimit: 45,
    createdAt: new Date('2025-03-15'),
    completedAt: new Date('2025-03-16'),
    score: 85,
  },
  {
    id: '2',
    title: 'Chemistry Full Length Test',
    type: 'full',
    questionsCount: 100,
    timeLimit: 180,
    createdAt: new Date('2025-03-10'),
    completedAt: null,
    score: null,
  },
  {
    id: '3',
    title: 'Biology Section 2 Test',
    type: 'section',
    questionsCount: 15,
    timeLimit: 30,
    createdAt: new Date('2025-03-05'),
    completedAt: new Date('2025-03-07'),
    score: 92,
  },
  {
    id: '4',
    title: 'Mathematics Chapter 5 Test',
    type: 'chapter',
    questionsCount: 20,
    timeLimit: 40,
    createdAt: new Date('2025-02-28'),
    completedAt: new Date('2025-03-01'),
    score: 78,
  },
];

const mockPdfs = [
  {
    id: '1',
    title: 'Physics Textbook',
    pages: 450,
    uploadedAt: new Date('2025-02-15'),
    size: '15.2 MB',
  },
  {
    id: '2',
    title: 'Chemistry Notes',
    pages: 120,
    uploadedAt: new Date('2025-02-20'),
    size: '4.5 MB',
  },
  {
    id: '3',
    title: 'Biology Reference Guide',
    pages: 300,
    uploadedAt: new Date('2025-03-01'),
    size: '10.8 MB',
  },
  {
    id: '4',
    title: 'Mathematics Formula Sheet',
    pages: 25,
    uploadedAt: new Date('2025-03-10'),
    size: '1.2 MB',
  },
];

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [tests, setTests] = useState(mockTests);
  const [pdfs, setPdfs] = useState(mockPdfs);
  const [activeTab, setActiveTab] = useState('tests');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tests based on search query
  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter PDFs based on search query
  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const completedTests = tests.filter((test) => test.completedAt !== null).length;
  const pendingTests = tests.length - completedTests;
  const averageScore =
    tests.filter((test) => test.score !== null).reduce((acc, test) => acc + (test.score || 0), 0) /
    (completedTests || 1);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.displayName || 'User'}!</h1>
              <p className="text-gray-600 mt-1">Here's an overview of your learning progress.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/create-test"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Test
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Completed Tests</p>
                  <p className="text-2xl font-semibold text-gray-900">{completedTests}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Pending Tests</p>
                  <p className="text-2xl font-semibold text-gray-900">{pendingTests}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Average Score</p>
                  <p className="text-2xl font-semibold text-gray-900">{averageScore.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex space-x-4 mb-4 sm:mb-0">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'tests'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('tests')}
              >
                My Tests
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'pdfs'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('pdfs')}
              >
                My PDFs
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`Search ${activeTab === 'tests' ? 'tests' : 'PDFs'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tests Tab */}
          {activeTab === 'tests' && (
            <div>
              {filteredTests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Test Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Questions
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Time (min)
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Score
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTests.map((test) => (
                        <tr key={test.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{test.title}</div>
                            <div className="text-sm text-gray-500">
                              Created {test.createdAt.toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                test.type === 'full'
                                  ? 'bg-purple-100 text-purple-800'
                                  : test.type === 'chapter'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {test.type === 'full'
                                ? 'Full Length'
                                : test.type === 'chapter'
                                ? 'Chapter'
                                : 'Section'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {test.questionsCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {test.timeLimit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {test.completedAt ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {test.score !== null ? `${test.score}%` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/take-test/${test.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {test.completedAt ? 'Review' : 'Take Test'}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tests found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? `No tests matching "${searchQuery}"`
                      : "You haven't created any tests yet."}
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/create-test"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Test
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PDFs Tab */}
          {activeTab === 'pdfs' && (
            <div>
              {filteredPdfs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-5">
                        <div className="flex items-center mb-4">
                          <div className="bg-red-100 p-3 rounded-full">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">{pdf.title}</h3>
                            <p className="text-sm text-gray-500">
                              {pdf.pages} pages • {pdf.size}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Uploaded on {pdf.uploadedAt.toLocaleDateString()}
                        </p>
                        <div className="flex space-x-2">
                          <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            View
                          </button>
                          <Link
                            to={`/create-test?pdf=${pdf.id}`}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Create Test
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No PDFs found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? `No PDFs matching "${searchQuery}"`
                      : "You haven't uploaded any PDFs yet."}
                  </p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;