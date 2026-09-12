import React, { useState } from 'react';
import { Users, Plus, CheckCircle2, Circle, Trash2, Edit2, Share2, Sparkles } from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';
import { FamilyTask } from '../../types';

export const FamilyChhathHub: React.FC = () => {
  const { familyName, setFamilyName, familyTasks, addFamilyTask, toggleFamilyTask, deleteFamilyTask } = useChhathData();
  
  const [isEditingFamilyName, setIsEditingFamilyName] = useState(false);
  const [tempFamilyName, setTempFamilyName] = useState(familyName);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<FamilyTask['category']>('Puja');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addFamilyTask({
      taskTitle: newTaskTitle.trim(),
      assignedTo: newTaskAssignee.trim() || 'परिवार सदस्य',
      category: newTaskCategory
    });
    setNewTaskTitle('');
    setNewTaskAssignee('');
  };

  const handleSaveName = () => {
    if (tempFamilyName.trim()) {
      setFamilyName(tempFamilyName.trim());
    }
    setIsEditingFamilyName(false);
  };

  const completedCount = familyTasks.filter(t => t.completed).length;

  return (
    <section id="family-chhath" className="section-padding relative overflow-hidden bg-white dark:bg-stone-900 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="badge-saffron inline-flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>पारिवारिक छठ संगम (Family Chhath Circle)</span>
            </div>
            
            {isEditingFamilyName ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={tempFamilyName}
                  onChange={e => setTempFamilyName(e.target.value)}
                  className="px-3 py-1.5 text-xl font-rozha font-bold rounded-xl bg-stone-100 dark:bg-stone-800 border border-amber-500/40 text-stone-900 dark:text-stone-100"
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  सहेजें
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
                  {familyName}
                </h2>
                <button
                  onClick={() => {
                    setTempFamilyName(familyName);
                    setIsEditingFamilyName(true);
                  }}
                  className="text-stone-400 hover:text-amber-500 transition-colors p-1"
                  title="परिवार का नाम बदलें"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
              छठ में पूरे परिवार का सहयोग ही इस महापर्व की आत्मा है। परिवार के सदस्यों को जिम्मेदारियां बांटें।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-800 dark:text-amber-300">
              {completedCount} / {familyTasks.length} दायित्व पूर्ण
            </div>
          </div>
        </div>

        {/* Add New Task Form */}
        <form onSubmit={handleAddTask} className="p-4 sm:p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-amber-500/30 mb-8 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="नया दायित्व (उदा. आम की लकड़ी व मिट्टी का चूल्हा)..."
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-amber-500/30 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <input
              type="text"
              placeholder="किसे सौंपा गया? (उदा. पिताजी, भैया)..."
              value={newTaskAssignee}
              onChange={e => setNewTaskAssignee(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-amber-500/30 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={newTaskCategory}
              onChange={e => setNewTaskCategory(e.target.value as FamilyTask['category'])}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-amber-500/30 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Puja">पूजा</option>
              <option value="Prasad">प्रसाद</option>
              <option value="Clothes">वस्त्र</option>
              <option value="Ghat">घाट</option>
              <option value="Travel">यात्रा</option>
              <option value="Shopping">खरीदारी</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>जोड़ें</span>
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-3">
          {familyTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-stone-100/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-75'
                  : 'bg-white dark:bg-stone-800/90 border-amber-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleFamilyTask(task.id)}
                  className="text-amber-500 hover:text-amber-600 transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500/20" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <span
                    className={`text-xs sm:text-sm font-mukta font-semibold block ${
                      task.completed ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-100'
                    }`}
                  >
                    {task.taskTitle}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                    <span className="font-bold text-orange-600 dark:text-amber-400">👤 {task.assignedTo}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteFamilyTask(task.id)}
                className="text-stone-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                title="हटाएं"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
