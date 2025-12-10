# Kanban Board Component Library

## Overview

A production-quality, fully accessible, and performant Kanban Board component library built with React, TypeScript, and Tailwind CSS. This library provides a complete Kanban experience with drag-and-drop support, task management, filtering, and responsive design, engineered to mimic real-world senior frontend standards.

**[View Live Demo (Vercel)](https://kanban-component-c4bjtmc6d-dev10-sys-projects.vercel.app/)**  
**[View Storybook Documentation](https://main--kanban-component-kalpana.chromatic.com)**

---

## Features

### Core Functionality
- **Columns**: Sticky headers, WIP limits (visual indicators), collapsible columns, task counts.
- **Task Cards**: Priority badges, tags, assignees, due dates, description clamping.
- **Drag and Drop**: Fully custom HTML5 DnD implementation (no external libraries). Smooth animations, placeholder indicators, auto-scrolling (native).
- **Task Management**: Create, edit, delete tasks via a lazy-loaded Modal.
- **Filtering & Bulk Actions**: Filter by priority, tags, assignee, search. Bulk delete support.

### UX & Performance
- **Responsive**: Horizontal scroll on desktop, optimized layout for tablet/mobile.
- **Performance**: Optimized rendering for large datasets (500+ tasks).
- **A11y**: Full keyboard navigation, ARIA roles, WCAG 2.1 AA contrast compliance.

---

## Technology Stack

- **React 18**
- **TypeScript** (Strict Mode)
- **Vite**
- **Tailwind CSS** (Custom Design Tokens)
- **Storybook** (Documentation & Testing)
- **HTML5 Drag and Drop API**
- **date-fns**
- **clsx**

---

## Installation

```bash
git clone https://github.com/Dev10-sys/kanban-component.git
cd kanban-component
npm install
```

## Usage

### Development Server
Run the local Vite development server:
```bash
npm run dev
```

### Storybook
Launch the Storybook environment:
```bash
npm run storybook
```

### Build
Build the library/app for production:
```bash
npm run build
```

---

## Architecture

### Directory Structure
```
kanban-component/
├── src/
│   ├── components/
│   │   ├── KanbanBoard/       # Core domain components
│   │   └── primitives/        # Reusable UI atoms (Button, Modal, Avatar)
│   ├── hooks/                 # Custom logic hooks (useKanbanBoard, useDragAndDrop)
│   ├── utils/                 # Pure utility functions
│   └── styles/                # Global styles and tailwind directives
└── .storybook/                # Storybook configuration
```

### Key Components
- **useKanbanBoard**: A custom hook managing the entire board state (optimistic updates, column/task normalization).
- **useDragAndDrop**: A dedicated hook encapsulating the HTML5 DnD logic, managing drag state, placeholders, and drop events without polluting UI components.
- **KanbanBoard**: The container component dealing with layout and filtering context.

---

## Contact

Engineer: Dev10-sys  
Project: Kanban Component Library
