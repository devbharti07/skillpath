// Curated Skill Assessments Data with Questions, Explanations, and Scoring Logic
export const assessmentsData = [
  {
    id: 'assessment-js',
    slug: 'javascript-core',
    title: 'JavaScript Core & Async Mastery',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    description: 'Evaluate your understanding of ES6+, closures, event loop, promises, prototypes, and asynchronous JavaScript execution.',
    questions: [
      {
        id: 'js-q1',
        text: 'What will be logged to the console when executing the following snippet?\n\nconsole.log(typeof NaN);',
        options: [
          'undefined',
          'number',
          'NaN',
          'object'
        ],
        correctIndex: 1,
        explanation: 'In JavaScript, NaN stands for "Not-a-Number", but its data type according to the IEEE 754 floating-point specification is officially "number".'
      },
      {
        id: 'js-q2',
        text: 'Which statement accurately describes JavaScript closures?',
        options: [
          'A closure is a built-in method used to terminate event listeners',
          'A closure is the combination of a function bundled together with references to its surrounding lexical environment',
          'A closure is an asynchronous callback queued strictly inside the microtask queue',
          'A closure is an object frozen by Object.freeze()'
        ],
        correctIndex: 1,
        explanation: 'A closure gives an inner function access to an outer enclosing function\'s scope variables even after the outer function has finished executing.'
      },
      {
        id: 'js-q3',
        text: 'In the JavaScript Event Loop, which queue takes execution priority after the current call stack clears?',
        options: [
          'Macrotask queue (setTimeout, setInterval)',
          'Microtask queue (Promise.then, queueMicrotask)',
          'I/O polling queue',
          'RequestAnimationFrame callback queue'
        ],
        correctIndex: 1,
        explanation: 'The microtask queue (which handles resolved Promises and mutation observers) is always completely drained before the next macrotask is dequeued.'
      },
      {
        id: 'js-q4',
        text: 'What is the key difference between == and === in JavaScript?',
        options: [
          '== checks both type and value, whereas === checks only value',
          '=== compares values with strict type equality without performing type coercion, while == performs type coercion',
          '=== can only compare objects, whereas == compares primitives',
          'There is no difference; === is legacy syntax'
        ],
        correctIndex: 1,
        explanation: 'The strict equality operator (===) does not perform type conversion. If operands have different types, it immediately returns false.'
      },
      {
        id: 'js-q5',
        text: 'What does Promise.all() do if one of the passed promises rejects?',
        options: [
          'It waits for all other promises to resolve and ignores the rejected one',
          'It immediately rejects with the reason of the first promise that rejected',
          'It returns an array containing null for the failed promise',
          'It retries the failed promise up to three times'
        ],
        correctIndex: 1,
        explanation: 'Promise.all follows an "all-or-nothing" fail-fast mechanism: if any promise in the iterable rejects, the whole returned promise immediately rejects.'
      }
    ]
  },
  {
    id: 'assessment-html-css',
    slug: 'html-css',
    title: 'HTML5 & Modern CSS3 Architecture',
    category: 'HTML and CSS',
    difficulty: 'Beginner Friendly',
    durationMinutes: 8,
    description: 'Verify your knowledge of semantic HTML tags, CSS Flexbox, Grid layouts, box-sizing, and responsive accessibility.',
    questions: [
      {
        id: 'html-q1',
        text: 'Why should semantic HTML elements (<main>, <article>, <nav>, <header>) be preferred over generic <div> tags?',
        options: [
          'They execute JavaScript faster in the browser engine',
          'They improve accessibility for screen readers and search engine SEO comprehension',
          'They automatically apply dark mode styles without CSS',
          'They prevent browser cross-site scripting vulnerabilities'
        ],
        correctIndex: 1,
        explanation: 'Semantic elements convey meaningful structural intent to assistive technologies, screen readers, and search engine crawlers.'
      },
      {
        id: 'html-q2',
        text: 'What does setting box-sizing: border-box do in CSS?',
        options: [
          'Adds an automatic outline border to all elements',
          'Includes padding and border within the element\'s specified total width and height',
          'Removes all margins from child elements',
          'Centers the element horizontally within its parent'
        ],
        correctIndex: 1,
        explanation: 'With box-sizing: border-box, the width and height properties include content, padding, and border, making responsive layouts much easier to calculate.'
      },
      {
        id: 'html-q3',
        text: 'In CSS Flexbox, which property aligns items along the cross axis?',
        options: [
          'justify-content',
          'align-items',
          'flex-direction',
          'flex-wrap'
        ],
        correctIndex: 1,
        explanation: 'justify-content aligns items along the primary axis (main axis), while align-items aligns them perpendicular to it along the cross axis.'
      },
      {
        id: 'html-q4',
        text: 'What is the purpose of the HTML viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1.0">?',
        options: [
          'It loads mobile-specific CSS stylesheets automatically',
          'It tells mobile browsers to render the page to the device\'s screen width rather than zooming out to desktop proportions',
          'It forces the website into fullscreen mode on phones',
          'It enables touch gestures in JavaScript'
        ],
        correctIndex: 1,
        explanation: 'Without this viewport tag, mobile browsers assume a desktop page width (typically 980px) and render the site zoomed out and unreadable.'
      }
    ]
  },
  {
    id: 'assessment-react',
    slug: 'react-fundamentals',
    title: 'React.js Component Architecture & Hooks',
    category: 'React',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    description: 'Demonstrate proficiency with functional components, useState, useEffect, custom hooks, and reconciliation.',
    questions: [
      {
        id: 'react-q1',
        text: 'Why must you avoid modifying React state directly (e.g., state.count = 5)?',
        options: [
          'JavaScript throws a syntax error if state is modified directly',
          'Direct mutations do not trigger a component re-render and can corrupt React reconciliation',
          'Direct mutation clears all child components from the DOM',
          'It causes memory leaks in the browser'
        ],
        correctIndex: 1,
        explanation: 'React relies on immutability to determine when state has changed (by shallow reference equality) and schedule virtual DOM re-renders.'
      },
      {
        id: 'react-q2',
        text: 'When does a useEffect hook with an empty dependency array [] run?',
        options: [
          'On every single render of the component',
          'Only once after the initial component mount',
          'Whenever any state variable in the component changes',
          'Only when the user clicks inside the component'
        ],
        correctIndex: 1,
        explanation: 'An empty dependency array indicates to React that the effect has no reactive dependencies, so it runs only once after the component mounts.'
      },
      {
        id: 'react-q3',
        text: 'What is the primary role of the "key" prop when rendering dynamic lists in React?',
        options: [
          'It sets the CSS class name for each list element',
          'It uniquely identifies items to help React efficiently reconcile, add, reorder, or remove elements in the Virtual DOM',
          'It encrypts the item data inside the browser',
          'It acts as an index for array iteration'
        ],
        correctIndex: 1,
        explanation: 'Keys allow React to match virtual elements with DOM nodes across renders, minimizing expensive DOM manipulations when lists change.'
      },
      {
        id: 'react-q4',
        text: 'Which React hook is designed for sharing global or subtree state without prop drilling?',
        options: [
          'useReducer',
          'useContext',
          'useCallback',
          'useMemo'
        ],
        correctIndex: 1,
        explanation: 'useContext consumes values provided by a React Context Provider anywhere in the component hierarchy without passing props down manually.'
      }
    ]
  },
  {
    id: 'assessment-python',
    slug: 'python-programming',
    title: 'Python Programming & Data Structures',
    category: 'Python',
    difficulty: 'Beginner Friendly',
    durationMinutes: 10,
    description: 'Test your understanding of Python syntax, list comprehensions, dictionaries, generators, and OOP fundamentals.',
    questions: [
      {
        id: 'py-q1',
        text: 'What is the output of the following list comprehension?\n\n[x**2 for x in range(4) if x % 2 == 0]',
        options: [
          '[0, 4]',
          '[0, 1, 4, 9]',
          '[1, 9]',
          '[4]'
        ],
        correctIndex: 0,
        explanation: 'range(4) produces 0, 1, 2, 3. The even numbers are 0 and 2. Squaring them yields 0**2 = 0 and 2**2 = 4, giving [0, 4].'
      },
      {
        id: 'py-q2',
        text: 'What is the primary difference between a Python list and a Python tuple?',
        options: [
          'Lists can only store numbers, while tuples can store strings',
          'Lists are mutable (can be modified), whereas tuples are immutable (fixed after creation)',
          'Tuples execute slower than lists',
          'Lists use parentheses () while tuples use brackets []'
        ],
        correctIndex: 1,
        explanation: 'Tuples are immutable sequences in Python. Once created, their elements cannot be reassigned, added, or removed.'
      },
      {
        id: 'py-q3',
        text: 'What does the "yield" keyword do inside a Python function?',
        options: [
          'Immediately terminates the program execution',
          'Turns the function into a generator that yields values lazily one at a time on demand',
          'Imports an external module asynchronously',
          'Forces a function to run on multiple CPU cores'
        ],
        correctIndex: 1,
        explanation: 'Functions with yield become generators. They pause execution and produce a value to the caller, maintaining internal state across iterations.'
      },
      {
        id: 'py-q4',
        text: 'What is the average time complexity of looking up a key in a standard Python dictionary?',
        options: [
          'O(N)',
          'O(1) - Constant time',
          'O(log N)',
          'O(N^2)'
        ],
        correctIndex: 1,
        explanation: 'Python dictionaries are implemented as hash tables, providing average O(1) time complexity for key insertion and retrieval.'
      }
    ]
  },
  {
    id: 'assessment-sql',
    slug: 'sql-relational',
    title: 'SQL & Relational Database Design',
    category: 'SQL',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    description: 'Assess relational database querying, INNER/LEFT JOINs, GROUP BY aggregations, indexes, and normalization.',
    questions: [
      {
        id: 'sql-q1',
        text: 'What is the difference between an INNER JOIN and a LEFT JOIN in SQL?',
        options: [
          'INNER JOIN returns all rows from the right table only',
          'INNER JOIN returns only rows that have matching values in both tables; LEFT JOIN returns all rows from the left table plus matched rows from the right table',
          'LEFT JOIN deletes rows that do not match',
          'There is no difference; they are interchangeable keywords'
        ],
        correctIndex: 1,
        explanation: 'A LEFT JOIN keeps every row from the left table; if no match exists in the right table, NULL values are filled in for right table columns.'
      },
      {
        id: 'sql-q2',
        text: 'Which SQL clause is used to filter aggregated group results (e.g. after GROUP BY)?',
        options: [
          'WHERE',
          'HAVING',
          'ORDER BY',
          'LIMIT'
        ],
        correctIndex: 1,
        explanation: 'WHERE filters rows before aggregation occurs; HAVING filters the aggregated summary rows after GROUP BY has processed.'
      },
      {
        id: 'sql-q3',
        text: 'What is the primary function of a database Index?',
        options: [
          'It compresses the database file to save disk storage',
          'It speeds up data retrieval operations (SELECT) at the cost of slight overhead on write operations (INSERT/UPDATE)',
          'It prevents duplicate data from being written',
          'It automatically encrypts confidential columns'
        ],
        correctIndex: 1,
        explanation: 'Database indexes (like B-trees) provide quick lookup paths for columns frequently searched or joined, drastically reducing full-table scans.'
      },
      {
        id: 'sql-q4',
        text: 'What does the ACID acronym stand for in relational database transactions?',
        options: [
          'Application, Configuration, Integration, Deployment',
          'Atomicity, Consistency, Isolation, Durability',
          'Asynchronous, Concurrent, Indexed, Distributed',
          'Authentication, Cryptography, Integrity, Decryption'
        ],
        correctIndex: 1,
        explanation: 'ACID guarantees that database transactions are executed reliably and maintain data integrity even during hardware or network failures.'
      }
    ]
  },
  {
    id: 'assessment-logic',
    slug: 'logical-reasoning',
    title: 'Logical Reasoning & Problem Solving',
    category: 'Logical Reasoning',
    difficulty: 'All Levels',
    durationMinutes: 8,
    description: 'Sharpen computational thinking, pattern recognition, algorithmic deduction, and analytical decision-making.',
    questions: [
      {
        id: 'log-q1',
        text: 'If all Software Engineers write code, and some writers of code enjoy chess, which statement MUST be true?',
        options: [
          'All software engineers enjoy chess',
          'Anyone who enjoys chess is a software engineer',
          'At least some software engineers might enjoy chess, but not necessarily all',
          'No software engineers enjoy chess'
        ],
        correctIndex: 2,
        explanation: 'Because only some coders enjoy chess, we cannot deduce that all engineers play chess, but the intersection allows for software engineers who do.'
      },
      {
        id: 'log-q2',
        text: 'What is the next number in the sequence: 2, 6, 12, 20, 30, ___?',
        options: [
          '40',
          '42',
          '44',
          '48'
        ],
        correctIndex: 1,
        explanation: 'The differences between consecutive numbers increase by 2: +4, +6, +8, +10. Therefore, the next difference is +12: 30 + 12 = 42.'
      },
      {
        id: 'log-q3',
        text: 'In binary search over a sorted array of 1,000 items, what is the maximum number of comparisons needed to find an element or verify its absence?',
        options: [
          '1,000',
          '500',
          '10',
          '100'
        ],
        correctIndex: 2,
        explanation: 'Binary search runs in O(log2 N) time. For N=1,000, 2^10 = 1,024, meaning at most 10 comparisons are ever required.'
      },
      {
        id: 'log-q4',
        text: 'A server stack requires Service A to start before Service B, and Service B before Service C. If Service C has started successfully, what can you definitively conclude?',
        options: [
          'Service A and Service B have both started successfully',
          'Service A has crashed',
          'Service D is currently running',
          'No conclusions can be drawn'
        ],
        correctIndex: 0,
        explanation: 'Given the strict sequential dependency (A -> B -> C), the successful initialization of C confirms that its prerequisites A and B must have completed.'
      }
    ]
  }
];

// Helper to calculate score and proficiency
export const calculateAssessmentScore = (assessment, userAnswers) => {
  let correctCount = 0;
  const questions = assessment.questions;
  const review = [];

  questions.forEach((q, index) => {
    const selectedIndex = userAnswers[q.id];
    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) correctCount += 1;

    review.push({
      questionId: q.id,
      questionText: q.text,
      options: q.options,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    });
  });

  const percentage = Math.round((correctCount / questions.length) * 100);
  let proficiency = 'Needs Practice';
  let isVerified = false;

  if (percentage >= 80) {
    proficiency = 'Advanced';
    isVerified = true;
  } else if (percentage >= 60) {
    proficiency = 'Intermediate';
    isVerified = true;
  } else if (percentage >= 40) {
    proficiency = 'Beginner';
  }

  return {
    assessmentId: assessment.id,
    assessmentSlug: assessment.slug,
    title: assessment.title,
    category: assessment.category,
    totalQuestions: questions.length,
    correctCount,
    percentage,
    proficiency,
    isVerified,
    review,
    completedAt: new Date().toISOString()
  };
};

export const getAssessmentBySlug = (slug) => {
  return assessmentsData.find((a) => a.slug === slug) || null;
};
