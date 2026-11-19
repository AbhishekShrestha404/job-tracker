import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableCard from './SortableCard';

export default function Column({ id, title, applications, dragDisabled, onEdit, onDelete }) {
    // makes the column itself a drop target, so empty columns accept cards
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <section className={`column ${isOver ? 'over' : ''}`}>
            <h3>
                {title} <span className="count">{applications.length}</span>
            </h3>
            <SortableContext
                items={applications.map((a) => a._id)}
                strategy={verticalListSortingStrategy}
            >
                <div ref={setNodeRef} className="column-body">
                    {applications.map((a) => (
                        <SortableCard
                            key={a._id}
                            application={a}
                            dragDisabled={dragDisabled}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    {applications.length === 0 && <p className="empty">Nothing here yet</p>}
                </div>
            </SortableContext>
        </section>
    );
}