import { getDeadlineInfo } from '../utils/deadline';

const isSafeUrl = (url) => /^https?:\/\//i.test(url);

export default function ApplicationCard({ application, onEdit, onDelete, overlay }) {
    const { company, role, deadline, jobUrl, notes } = application;
    const deadlineInfo = getDeadlineInfo(deadline, status);

    return (
        <article className={`card ${overlay ? 'overlay' : ''}`}>
            <h4>{company}</h4>
            <p className="role">{role}</p>
            {deadlineInfo && (
                <p className={`deadline ${deadlineInfo.level}`}>{deadlineInfo.label}</p>
            )}
            {notes && <p className="notes">{notes}</p>}

            {!overlay && (
                <div className="card-actions">
                    {jobUrl && isSafeUrl(jobUrl) && (
                        <a href={jobUrl} target="_blank" rel="noreferrer">Link</a>
                    )}
                    <button className="link" onClick={() => onEdit(application)}>Edit</button>
                    <button className="link danger" onClick={() => onDelete(application)}>Delete</button>
                </div>
            )}
        </article>
    );
}