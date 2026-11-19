const formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, { timeZone: 'UTC' });

const isSafeUrl = (url) => /^https?:\/\//i.test(url);

export default function ApplicationCard({ application, onEdit, onDelete, overlay }) {
    const { company, role, deadline, jobUrl, notes } = application;

    return (
        <article className={`card ${overlay ? 'overlay' : ''}`}>
            <h4>{company}</h4>
            <p className="role">{role}</p>
            {deadline && <p className="deadline">Due {formatDate(deadline)}</p>}
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