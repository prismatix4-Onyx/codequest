import type { ConceptDefinition } from '@codequest/shared-types';

export const PYTHON_CURRICULUM: ConceptDefinition[] = [
  // ----------------------------------------------------
  // Stage 1: Foundations
  // ----------------------------------------------------
  {
    id: 'py-intro',
    stage: 1,
    moduleOrder: 1,
    title: 'Introduction to Programming & Output',
    summary: 'The foundations of computational instructions, console output, and the execution pipeline.',
    objectives: [
      'Understand how programs execute sequentially',
      'Use print() to write text and numbers to standard output',
      'Understand syntax rules and string delimiters',
    ],
    examples: [
      {
        title: 'Basic Console Output',
        code: 'print("SYSTEM ONLINE: Station Aethelgard")\nprint(2026)',
        explanation: 'The print function evaluates arguments and writes them to standard output.',
      },
    ],
    practiceChallengeIds: ['challenge-py-intro-01', 'challenge-py-intro-02'],
  },
  {
    id: 'py-vars',
    stage: 1,
    moduleOrder: 2,
    title: 'Variables and Data Types',
    summary: 'Storing state in memory using integers, floats, strings, and booleans with dynamic typing.',
    objectives: [
      'Declare and assign variables in Python',
      'Differentiate between int, float, str, and bool',
      'Perform type conversions using int(), float(), str()',
    ],
    examples: [
      {
        title: 'Variables and Reassignment',
        code: 'reactor_status = "CRITICAL"\ncore_temp = 98.6\nis_active = True\nprint(f"Status: {reactor_status}, Temp: {core_temp}C")',
        explanation: 'Variables hold values that can be referenced and updated throughout the program.',
      },
    ],
    practiceChallengeIds: ['challenge-py-vars-01', 'challenge-py-vars-02'],
  },
  {
    id: 'py-operators',
    stage: 1,
    moduleOrder: 3,
    title: 'Arithmetic, Comparison & Logical Operators',
    summary: 'Evaluating mathematical expressions, relational comparisons, and boolean truth values.',
    objectives: [
      'Use arithmetic operators (+, -, *, /, //, %, **)',
      'Compare values with ==, !=, >, <, >=, <=',
      'Chain logical expressions using and, or, not',
    ],
    examples: [
      {
        title: 'Energy Calculation',
        code: 'power_cells = 4\ncapacity_per_cell = 250\ntotal_power = power_cells * capacity_per_cell\nis_sufficient = total_power >= 800\nprint("Sufficient:", is_sufficient)',
        explanation: 'Operators compute new values and produce boolean flags for control flow.',
      },
    ],
    practiceChallengeIds: ['challenge-py-ops-01'],
  },
  {
    id: 'py-conditions',
    stage: 1,
    moduleOrder: 4,
    title: 'Conditional Branching (if, elif, else)',
    summary: 'Governing control flow with selective execution paths based on runtime state.',
    objectives: [
      'Structure if, elif, and else statements with correct indentation',
      'Handle multiple conditional branches cleanly',
      'Formulate nested conditions without logic bugs',
    ],
    examples: [
      {
        title: 'Life Support Diagnostics',
        code: 'oxygen_level = 14\nif oxygen_level < 15:\n    print("ALERT: Oxygen critical")\nelif oxygen_level < 19:\n    print("WARNING: Oxygen low")\nelse:\n    print("NOMINAL: Oxygen stable")',
        explanation: 'Only the first matching branch is evaluated; the remaining branches are skipped.',
      },
    ],
    practiceChallengeIds: ['challenge-py-cond-01', 'challenge-py-cond-02'],
  },

  // ----------------------------------------------------
  // Stage 2: Control & Modularization
  // ----------------------------------------------------
  {
    id: 'py-loops',
    stage: 2,
    moduleOrder: 5,
    title: 'Iteration: While and For Loops',
    summary: 'Automating repetitive logic, sequence traversal, range generation, and loop controls.',
    objectives: [
      'Execute while loops with correct termination conditions',
      'Iterate over sequences and ranges using for loops',
      'Control flow using break and continue',
    ],
    examples: [
      {
        title: 'Sensor Calibration Loop',
        code: 'for sensor_id in range(1, 4):\n    print(f"Calibrating sensor #{sensor_id}...")',
        explanation: 'range(1, 4) produces indices 1, 2, 3 for sequential processing.',
      },
    ],
    practiceChallengeIds: ['challenge-py-loops-01'],
  },
  {
    id: 'py-collections',
    stage: 2,
    moduleOrder: 6,
    title: 'Strings and Lists',
    summary: 'Slicing, indexing, indexing bounds, mutating lists, and formatted string interpolation.',
    objectives: [
      'Access elements by positive and negative indices',
      'Slice sequences with [start:end:step]',
      'Append, pop, and search in Python lists',
    ],
    examples: [
      {
        title: 'Subsystem Registry',
        code: 'subsystems = ["Comms", "Nav", "Shields"]\nsubsystems.append("Reactor")\nprint(subsystems[0], subsystems[-1])',
        explanation: 'Lists are zero-indexed mutable ordered collections.',
      },
    ],
    practiceChallengeIds: ['challenge-py-coll-01'],
  },
  {
    id: 'py-functions',
    stage: 2,
    moduleOrder: 7,
    title: 'Modular Functions & Scope',
    summary: 'Decomposing problems into reusable procedures with parameters, return values, and local scope.',
    objectives: [
      'Define functions using def keyword',
      'Pass positional and keyword arguments with defaults',
      'Return computed results using return',
    ],
    examples: [
      {
        title: 'Telemetry Validator Function',
        code: 'def calculate_checksum(data: list) -> int:\n    return sum(data) % 256\n\nval = calculate_checksum([10, 42, 85])\nprint("Checksum:", val)',
        explanation: 'Functions isolate computation and can be tested independently.',
      },
    ],
    practiceChallengeIds: ['challenge-py-func-01'],
  },

  // ----------------------------------------------------
  // Stage 3: Data Structures & OOP
  // ----------------------------------------------------
  {
    id: 'py-dicts',
    stage: 3,
    moduleOrder: 8,
    title: 'Dictionaries and Sets',
    summary: 'Fast key-value mapping, hash lookups, set operations, and unique memberships.',
    objectives: [
      'Construct and modify dictionaries with key-value pairs',
      'Use dict methods (.get(), .keys(), .items())',
      'Leverage sets for deduplication and intersection/union',
    ],
    examples: [
      {
        title: 'Aethelgard Station Telemetry',
        code: 'station = {"oxygen": 94, "power": 88, "hull": 100}\nprint("Power Level:", station.get("power", 0))',
        explanation: 'Dictionaries provide O(1) average lookup time by key.',
      },
    ],
    practiceChallengeIds: ['challenge-py-dicts-01'],
  },
  {
    id: 'py-oop',
    stage: 3,
    moduleOrder: 9,
    title: 'Object-Oriented Programming (Classes & Objects)',
    summary: 'Encapsulating state and behavior within classes, constructors, methods, and inheritance.',
    objectives: [
      'Define classes with __init__ constructor and self reference',
      'Instantiate objects and call instance methods',
      'Apply inheritance and method overriding',
    ],
    examples: [
      {
        title: 'Companion Drone Model',
        code: 'class Drone:\n    def __init__(self, designation: str, battery: int):\n        self.designation = designation\n        self.battery = battery\n    def scan(self):\n        return f"Drone {self.designation} scanning sector..."\n\nd = Drone("ARIA-01", 100)\nprint(d.scan())',
        explanation: 'Classes define blueprints combining internal state and operations.',
      },
    ],
    practiceChallengeIds: ['challenge-py-oop-01'],
  },
  {
    id: 'py-exceptions',
    stage: 3,
    moduleOrder: 10,
    title: 'Exception Handling & File Operations',
    summary: 'Building fault-tolerant systems using try/except/finally blocks and file context managers.',
    objectives: [
      'Catch specific exceptions with try and except',
      'Safely read and write files using with open(...) as f',
      'Raise intentional exceptions when invariants break',
    ],
    examples: [
      {
        title: 'Fault-Tolerant Sensor Reading',
        code: 'try:\n    reading = int("corrupted")\nexcept ValueError:\n    reading = -1\nprint("Safeguarded reading:", reading)',
        explanation: 'Exception blocks prevent unhandled crashes on anomalous input.',
      },
    ],
    practiceChallengeIds: ['challenge-py-exc-01'],
  },

  // ----------------------------------------------------
  // Stage 4: Advanced Problem Solving
  // ----------------------------------------------------
  {
    id: 'py-recursion',
    stage: 4,
    moduleOrder: 11,
    title: 'Recursion and Divide-and-Conquer',
    summary: 'Decomposing recursive structures, base cases, call stack mechanics, and search algorithms.',
    objectives: [
      'Identify base cases and recursive steps',
      'Avoid stack overflow through bounded recursion',
      'Implement binary search and recursive tree navigation',
    ],
    examples: [
      {
        title: 'Recursive Relay Ping',
        code: 'def ping_relay(hops: int) -> int:\n    if hops <= 0:\n        return 0\n    return 10 + ping_relay(hops - 1)\n\nprint("Ping latency:", ping_relay(3))',
        explanation: 'Recursive functions call themselves until reaching the designated base case.',
      },
    ],
    practiceChallengeIds: ['challenge-py-rec-01'],
  },
  {
    id: 'py-ds-algo',
    stage: 4,
    moduleOrder: 12,
    title: 'Data Structures and Algorithm Design',
    summary: 'Stacks, queues, graph traversal, and time/space complexity analysis.',
    objectives: [
      'Evaluate Big-O time and space complexity',
      'Implement stacks and queues for state management',
      'Apply BFS/DFS on network topologies',
    ],
    examples: [
      {
        title: 'Priority Command Queue',
        code: 'from collections import deque\nqueue = deque(["reboot", "stabilize", "notify"])\ncmd = queue.popleft()\nprint("Executing:", cmd)',
        explanation: 'deque enables efficient O(1) appends and pops from both ends.',
      },
    ],
    practiceChallengeIds: ['challenge-py-ds-01'],
  },
];
