const { useState, useEffect, useRef, createElement: h } = React;

const WorkoutApp = () => {
  const [currentPhase, setCurrentPhase] = useState('ready');
  const [currentSectionIndex, setSectionIndex] = useState(0);
  const [currentExerciseIndex, setExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);

  const workoutData = [
    {
      section: "WARM-UP",
      duration: "5 Minutes",
      exercises: [
        { name: "Jog in Place", duration: 60, sets: 1, animation: "🏃" },
        { name: "High Knees", duration: 30, sets: 1, animation: "🦵" },
        { name: "Butt Kicks", duration: 30, sets: 1, animation: "🦿" },
        { name: "Arm Circles Forward", duration: 30, sets: 1, animation: "⭕" },
        { name: "Arm Circles Backward", duration: 30, sets: 1, animation: "⭕" },
        { name: "Defensive Slide Steps", duration: 60, sets: 1, animation: "↔️" }
      ]
    },
    {
      section: "UPPER BODY",
      duration: "3-4 Minutes",
      exercises: [
        { name: "Push-Ups", duration: 45, sets: 3, reps: "8-12", animation: "💪" },
        { name: "Wall Push-Offs", duration: 30, sets: 3, reps: "10", animation: "🧱" }
      ]
    },
    {
      section: "LOWER BODY",
      duration: "2-3 Minutes",
      exercises: [
        { name: "Bodyweight Squats", duration: 50, sets: 3, reps: "12-15", animation: "🏋️" },
        { name: "Lunges", duration: 45, sets: 1, reps: "10 each leg", animation: "🦵" }
      ]
    },
    {
      section: "CORE STRENGTH",
      duration: "3 Minutes",
      exercises: [
        { name: "Plank", duration: 30, sets: 2, animation: "🤸" },
        { name: "Sit-Ups or Crunches", duration: 40, sets: 1, reps: "15", animation: "🔥" },
        { name: "Russian Twists", duration: 45, sets: 1, reps: "20 total", animation: "🌀" }
      ]
    }
  ];

  const restDuration = 15;

  const playBeep = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (currentPhase === 'ready' || isPaused) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      
      if (timeLeft <= 3 && timeLeft > 0) {
        playBeep();
      }
      
      return () => clearTimeout(timer);
    } else {
      handlePhaseComplete();
    }
  }, [timeLeft, currentPhase, isPaused]);

  const handlePhaseComplete = () => {
    const currentSection = workoutData[currentSectionIndex];
    const currentExercise = currentSection.exercises[currentExerciseIndex];

    if (currentPhase === 'exercise') {
      if (currentSet < currentExercise.sets) {
        setCurrentSet(currentSet + 1);
        setCurrentPhase('rest');
        setTimeLeft(restDuration);
      } else if (currentExerciseIndex < currentSection.exercises.length - 1) {
        setExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setCurrentPhase('rest');
        setTimeLeft(restDuration);
      } else if (currentSectionIndex < workoutData.length - 1) {
        setSectionIndex(currentSectionIndex + 1);
        setExerciseIndex(0);
        setCurrentSet(1);
        setCurrentPhase('rest');
        setTimeLeft(restDuration);
      } else {
        setCurrentPhase('complete');
      }
    } else if (currentPhase === 'rest') {
      setCurrentPhase('exercise');
      setTimeLeft(currentExercise.duration);
    }
  };

  const startWorkout = () => {
    setCurrentPhase('exercise');
    setTimeLeft(workoutData[0].exercises[0].duration);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const skipExercise = () => {
    handlePhaseComplete();
  };

  const resetWorkout = () => {
    setCurrentPhase('ready');
    setSectionIndex(0);
    setExerciseIndex(0);
    setCurrentSet(1);
    setTimeLeft(0);
    setIsPaused(false);
  };

  // Icons as components
  const Play = ({ size = 24 }) => h('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, h('polygon', { points: "5 3 19 12 5 21 5 3" }));

  const Pause = ({ size = 24 }) => h('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, h('rect', { x: "6", y: "4", width: "4", height: "16" }), h('rect', { x: "14", y: "4", width: "4", height: "16" }));

  const SkipForward = ({ size = 24 }) => h('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, h('polygon', { points: "5 4 15 12 5 20 5 4" }), h('line', { x1: "19", y1: "5", x2: "19", y2: "19" }));

  const RotateCcw = ({ size = 24 }) => h('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, h('polyline', { points: "1 4 1 10 7 10" }), h('path', { d: "M3.51 15a9 9 0 1 0 2.13-9.36L1 10" }));

  const Volume2 = ({ size = 24 }) => h('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, h('polygon', { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }), h('path', { d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" }));

  const VolumeX = ({ size = 24 }) => h('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, h('polygon', { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }), h('line', { x1: "23", y1: "9", x2: "17", y2: "15" }), h('line', { x1: "17", y1: "9", x2: "23", y2: "15" }));

  const currentSection = workoutData[currentSectionIndex];
  const currentExercise = currentSection?.exercises[currentExerciseIndex];
  const progress = currentPhase === 'ready' ? 0 : 
    ((currentSectionIndex * 100 + (currentExerciseIndex / currentSection.exercises.length) * 100) / workoutData.length);

  if (currentPhase === 'ready') {
    return h('div', { className: "min-h-screen bg-gradient-to-br from-orange-500 to-red-600 p-4" },
      h('div', { className: "max-w-2xl mx-auto" },
        h('div', { className: "bg-white rounded-2xl shadow-2xl p-8 mb-6" },
          h('h1', { className: "text-4xl font-bold text-center text-gray-800 mb-2" }, "🏀 Basketball Strength Workout"),
          h('p', { className: "text-center text-gray-600 mb-8" }, "Daily Work To Start Building Strength"),
          h('div', { className: "space-y-6" },
            workoutData.map((section, idx) =>
              h('div', { key: idx, className: "border-l-4 border-orange-500 pl-4" },
                h('h3', { className: "font-bold text-lg text-gray-800" }, section.section),
                h('p', { className: "text-sm text-gray-600 mb-2" }, section.duration),
                h('ul', { className: "space-y-1" },
                  section.exercises.map((ex, i) =>
                    h('li', { key: i, className: "text-sm text-gray-700" },
                      `${ex.animation} ${ex.name}${ex.sets > 1 ? ` - ${ex.sets} sets` : ''}${ex.reps ? ` of ${ex.reps}` : ''}`
                    )
                  )
                )
              )
            )
          ),
          h('button', {
            onClick: startWorkout,
            className: "w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-xl transition-colors flex items-center justify-center gap-2"
          },
            h(Play, { size: 24 }),
            " Start Workout"
          )
        )
      ),
      h('audio', { ref: audioRef, src: "data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQIAAADAQA==" })
    );
  }

  if (currentPhase === 'complete') {
    return h('div', { className: "min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 p-4 flex items-center justify-center" },
      h('div', { className: "max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center" },
        h('div', { className: "text-6xl mb-4" }, "🏆"),
        h('h1', { className: "text-3xl font-bold text-gray-800 mb-4" }, "Workout Complete!"),
        h('p', { className: "text-gray-600 mb-8" }, "Great job! You've completed your basketball strength training."),
        h('button', {
          onClick: resetWorkout,
          className: "w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-xl transition-colors flex items-center justify-center gap-2"
        },
          h(RotateCcw, { size: 24 }),
          " Start Over"
        )
      )
    );
  }

  return h('div', { className: "min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4" },
    h('div', { className: "max-w-2xl mx-auto" },
      h('div', { className: "bg-white rounded-t-2xl shadow-2xl p-6" },
        h('div', { className: "flex justify-between items-center mb-4" },
          h('h2', { className: "text-lg font-bold text-gray-700" }, currentSection.section),
          h('button', {
            onClick: () => setSoundEnabled(!soundEnabled),
            className: "p-2 rounded-lg hover:bg-gray-100"
          }, soundEnabled ? h(Volume2, { size: 20 }) : h(VolumeX, { size: 20 }))
        ),
        h('div', { className: "w-full bg-gray-200 rounded-full h-2 mb-6" },
          h('div', {
            className: "bg-orange-500 h-2 rounded-full transition-all duration-300",
            style: { width: `${progress}%` }
          })
        ),
        h('div', { className: "text-center mb-8" },
          currentPhase === 'rest' ? [
            h('div', { key: 'emoji', className: "text-6xl mb-4 animate-pulse" }, "😮‍💨"),
            h('h3', { key: 'title', className: "text-2xl font-bold text-gray-800 mb-2" }, "Breathe & Rest"),
            h('p', { key: 'desc', className: "text-gray-600" }, "Get ready for the next exercise")
          ] : [
            h('div', { key: 'emoji', className: "text-8xl mb-4 animate-bounce" }, currentExercise.animation),
            h('h3', { key: 'title', className: "text-3xl font-bold text-gray-800 mb-2" }, currentExercise.name),
            currentExercise.sets > 1 && h('p', { key: 'set', className: "text-lg text-gray-600" }, `Set ${currentSet} of ${currentExercise.sets}`),
            currentExercise.reps && h('p', { key: 'reps', className: "text-md text-gray-500" }, currentExercise.reps)
          ]
        ),
        h('div', { className: "relative w-64 h-64 mx-auto mb-8" },
          h('svg', { className: "transform -rotate-90 w-64 h-64" },
            h('circle', { cx: "128", cy: "128", r: "120", stroke: "#e5e7eb", strokeWidth: "12", fill: "none" }),
            h('circle', {
              cx: "128", cy: "128", r: "120",
              stroke: currentPhase === 'rest' ? '#10b981' : '#f97316',
              strokeWidth: "12", fill: "none",
              strokeDasharray: 754,
              strokeDashoffset: 754 - (754 * timeLeft) / (currentPhase === 'rest' ? restDuration : currentExercise.duration),
              className: "transition-all duration-1000 ease-linear"
            })
          ),
          h('div', { className: "absolute inset-0 flex items-center justify-center" },
            h('div', { className: "text-center" },
              h('div', { className: "text-6xl font-bold text-gray-800" }, timeLeft),
              h('div', { className: "text-lg text-gray-600" }, "seconds")
            )
          )
        ),
        h('div', { className: "flex gap-4" },
          h('button', {
            onClick: togglePause,
            className: "flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          },
            isPaused ? h(Play, { size: 24 }) : h(Pause, { size: 24 }),
            isPaused ? 'Resume' : 'Pause'
          ),
          h('button', {
            onClick: skipExercise,
            className: "flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          },
            h(SkipForward, { size: 24 }),
            " Skip"
          )
        ),
        h('button', {
          onClick: resetWorkout,
          className: "w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
        },
          h(RotateCcw, { size: 20 }),
          " Reset Workout"
        )
      ),
      h('div', { className: "bg-white rounded-b-2xl shadow-2xl p-4 mt-1" },
        h('h4', { className: "font-bold text-sm text-gray-600 mb-2" }, "Up Next:"),
        h('div', { className: "space-y-1" },
          currentSection.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 3).map((ex, i) =>
            h('div', { key: i, className: "text-sm text-gray-600 flex items-center gap-2" },
              h('span', null, ex.animation),
              h('span', null, ex.name)
            )
          )
        )
      )
    ),
    h('audio', { ref: audioRef, src: "data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQIAAADAQA==" })
  );
};

// Render the app
ReactDOM.render(React.createElement(WorkoutApp), document.getElementById('root'));
