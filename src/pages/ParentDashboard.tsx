import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiInfo, FiArrowUpRight, FiUsers } from 'react-icons/fi';

const ParentDashboard: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState('Child 1');
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [activities, setActivities] = useState([
    { id: 1, text: 'Completed "Math Quiz - Fractions"', type: 'quiz', date: '2024-03-15' },
    { id: 2, text: 'Started "English - Vocabulary Builder"', type: 'lesson', date: '2024-03-14' },
    { id: 3, text: 'Practiced "Memory Game - Level 3"', type: 'game', date: '2024-03-14' },
    { id: 4, text: 'Completed "Emotions - Identify Feelings"', type: 'lesson', date: '2024-03-13' },
  ]);
  
  // Sample data
  const [progressData, setProgressData] = useState([
    { week: 'Week 1', value: 20 },
    { week: 'Week 2', value: 40 },
    { week: 'Week 3', value: 60 },
    { week: 'Week 4', value: 80 },
  ]);

  const taskCompletion = [
    { type: 'Completed', value: 75, color: '#10b981' },
    { type: 'Pending', value: 25, color: '#f59e0b' },
  ];

  const quizScores = [
    { subject: 'Math', score: 85 },
    { subject: 'Science', score: 75 },
    { subject: 'English', score: 90 },
    { subject: 'Life Skills', score: 70 },
    { subject: 'Emotions', score: 80 },
  ];

  // Simulate data loading
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Interactive chart handlers
  const handleChartClick = (chartType: string) => {
    setSelectedChart(chartType);
  };

  const handleChildChange = (child: string) => {
    setSelectedChild(child);
    // Simulate data change based on child
    setProgressData(prev => 
      prev.map(item => ({
        ...item,
        value: Math.floor(Math.random() * 80) + 20
      }))
    );
  };

  // Animated path for line chart
  const linePath = progressData
    .map((point, index) => {
      const x = 50 + index * 80;
      const y = 150 - point.value;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Parent Dashboard
          </h1>
          
          <div className="flex gap-4 items-center">
            <div className="flex items-center bg-white rounded-lg p-2 shadow-sm">
              <FiUsers className="text-gray-500 mr-2" />
              <select 
                value={selectedChild}
                onChange={(e) => handleChildChange(e.target.value)}
                className="bg-transparent outline-none"
              >
                {['Child 1', 'Child 2', 'Child 3'].map(child => (
                  <option key={child} value={child}>{child}</option>
                ))}
              </select>
            </div>
            
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-md ${viewMode === 'weekly' ? 'bg-indigo-100 text-indigo-600' : ''}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded-md ${viewMode === 'monthly' ? 'bg-indigo-100 text-indigo-600' : ''}`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 text-lg"
            >
              Loading {selectedChild}'s progress...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Line Chart Replacement */}
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => handleChartClick('progress')}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">📈 Progress Trend</h2>
                <FiInfo className="text-gray-400 cursor-help" />
              </div>
              <svg viewBox="0 0 400 160" className="w-full">
                <path
                  d={linePath}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {progressData.map((point, index) => (
                  <g key={point.week} transform={`translate(${50 + index * 80},${150 - point.value})`}>
                    <circle r="6" fill="#6366f1" />
                    <text x="0" y="-10" textAnchor="middle" fontSize="12">
                      {point.value}%
                    </text>
                  </g>
                ))}
              </svg>
              <div className="mt-4 text-sm text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                {viewMode === 'weekly' ? 'Weekly progress' : 'Monthly progress'}
              </div>
            </motion.div>

            {/* Pie Chart Replacement */}
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => handleChartClick('tasks')}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">✅ Task Completion</h2>
                <div className="flex items-center">
                  <span className="text-sm mr-2">75%</span>
                  <div className="w-12 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full transition-all"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="relative w-full h-48 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-32 h-32">
                  {taskCompletion.map((task, index) => {
                    const circumference = 2 * Math.PI * 40;
                    const strokeDasharray = `${(task.value / 100) * circumference} ${circumference}`;
                    return (
                      <circle
                        key={task.type}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={task.color}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="round"
                        transform={`rotate(${-90 + (index === 0 ? 0 : taskCompletion[0].value * 3.6)} 50 50)`}
                      />
                    );
                  })}
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold">75%</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
              </div>
            </motion.div>

            {/* Bar Chart Replacement */}
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => handleChartClick('quizzes')}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">📚 Subject Mastery</h2>
                <FiArrowUpRight className="text-blue-500" />
              </div>
              <div className="flex justify-between items-end h-48">
                {quizScores.map((subject) => (
                  <div 
                    key={subject.subject}
                    className="relative flex-1 mx-1 bg-blue-500 hover:bg-blue-600 transition-all"
                    style={{ height: `${subject.score}%` }}
                  >
                    <div className="absolute bottom-full w-full text-center text-sm mb-1">
                      {subject.score}%
                    </div>
                    <div className="absolute top-full w-full text-center text-xs mt-1">
                      {subject.subject}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Activity Feed with Interactions */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">📆 Recent Activity</h2>
              <button className="text-indigo-600 hover:text-indigo-700 flex items-center">
                See All
                <FiArrowUpRight className="ml-2" />
              </button>
            </div>
            
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer flex items-center group"
                >
                  <span className="mr-4 text-2xl">
                    {activity.type === 'quiz' ? '📝' : 
                     activity.type === 'game' ? '🎮' : '📚'}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {activity.text}
                    </p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600">
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Streak Counter */}
        {!loading && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-2xl shadow-lg text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🔥 Current Streak</h2>
                <p className="text-4xl font-bold">7 Days</p>
                <p className="mt-2">Keep it up! 3 more days to unlock a new badge!</p>
              </div>
              <div className="text-6xl">🏆</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chart Detail Modal */}
      <AnimatePresence>
        {selectedChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setSelectedChart(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">
                {selectedChart === 'progress' && 'Progress Details'}
                {selectedChart === 'tasks' && 'Task Analysis'}
                {selectedChart === 'quizzes' && 'Quiz Performance'}
              </h3>
              <p className="text-gray-600 mb-6">
                Detailed breakdown and recommendations based on {selectedChild}'s performance...
              </p>
              <button
                onClick={() => setSelectedChart(null)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParentDashboard;