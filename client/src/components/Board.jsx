import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { COLUMNS } from '../constants';
import Column from './Column';
import ApplicationCard from './ApplicationCard';

// Given an id that is either a column id or a card id, return its column id
const findContainer = (columns, id) => {
    if (id in columns) return id;
    return Object.keys(columns).find((key) =>
        columns[key].some((a) => a._id === id)
    );
};

export default function Board({ columns, setColumns, dragDisabled, onCommit, onEdit, onDelete }) {
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        // distance: 5 means a plain click on Edit/Delete doesn't start a drag
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        // press and hold ~250ms to drag, so normal swipes still scroll the page
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const activeApp = activeId
        ? Object.values(columns).flat().find((a) => a._id === activeId)
        : null;

    const handleDragStart = ({ active }) => setActiveId(active.id);

    // While dragging over another column, move the card there right away
    const handleDragOver = ({ active, over }) => {
        if (!over) return;

        setColumns((prev) => {
            const from = findContainer(prev, active.id);
            const to = findContainer(prev, over.id);
            if (!from || !to || from === to) return prev;

            const item = prev[from].find((a) => a._id === active.id);
            const overItems = prev[to];
            const overIndex = overItems.findIndex((a) => a._id === over.id);

            const translated = active.rect.current.translated;
            const isBelow =
                translated && translated.top > over.rect.top + over.rect.height;
            const insertAt =
                overIndex >= 0 ? overIndex + (isBelow ? 1 : 0) : overItems.length;

            return {
                ...prev,
                [from]: prev[from].filter((a) => a._id !== active.id),
                [to]: [
                    ...overItems.slice(0, insertAt),
                    { ...item, status: to },
                    ...overItems.slice(insertAt),
                ],
            };
        });
    };

    // On drop: finish any reordering inside a column, then save everything
    const handleDragEnd = ({ active, over }) => {
        setActiveId(null);
        if (!over) return onCommit(columns);

        let next = columns;
        const container = findContainer(columns, active.id);
        const overContainer = findContainer(columns, over.id);

        if (container && container === overContainer) {
            const oldIndex = columns[container].findIndex((a) => a._id === active.id);
            const newIndex = columns[container].findIndex((a) => a._id === over.id);
            if (newIndex >= 0 && oldIndex !== newIndex) {
                next = {
                    ...columns,
                    [container]: arrayMove(columns[container], oldIndex, newIndex),
                };
                setColumns(next);
            }
        }
        onCommit(next);
    };

    const handleDragCancel = () => {
        setActiveId(null);
        onCommit(columns);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="board">
                {COLUMNS.map((col) => (
                    <Column
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        applications={columns[col.id]}
                        dragDisabled={dragDisabled}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeApp ? <ApplicationCard application={activeApp} overlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}