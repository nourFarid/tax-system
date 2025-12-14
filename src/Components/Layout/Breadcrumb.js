const Breadcrumb = ({ items = [], button = [] }) => {
    return (
        <div className="flex flex-wrap items-center justify-between bg-white rounded shadow-sm p-2 mb-3 shadow-lg mb-4">
            <nav aria-label="breadcrumb" className="flex-1">
                <ol className="flex flex-wrap items-center gap-1 mb-0">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`flex items-center ${item.active ? "text-gray-500 font-semibold" : "text-blue-600 font-semibold"
                                }`}
                        >
                            {index === 0 && <i className="bi bi-house mr-1"></i>}

                            {!item.active ? (
                                <a href={item.link} className="hover:underline no-underline">
                                    {item.label}
                                </a>
                            ) : (
                                <span>{item.label}</span>
                            )}

                            {index < items.length - 1 && <span className="mx-2 text-gray-400">/</span>}
                        </li>
                    ))}
                </ol>
            </nav>

            {button && button.length > 0 && (
                <div className="flex gap-2">
                    {button.map((btn, idx) => {
                    if (btn.link) {
                        return (
                        <a key={idx} href={btn.link} className={`${btn.class} px-3 py-1 rounded text-sm flex items-center transition`}>
                            {btn.icon && <i className={`${btn.icon} mr-1`}></i>} &nbsp;
                            {btn.label}
                        </a>
                        );
                    }
                    if (btn.dyalog) {
                        return (
                        <button key={idx} type="button" data-bs-toggle="modal" data-bs-target={btn.dyalog} onClick={btn.onClick} className={`${btn.class} px-3 py-1 rounded text-sm flex items-center transition`} disabled={btn.disabled ?? false}>
                            {btn.icon && <i className={`${btn.icon} mr-1`}></i>} &nbsp;
                            {btn.label}
                        </button>
                        );
                    }
                    if (btn.fun) {
                        return (
                        <button key={idx} type="button" onClick={btn.fun} className={`${btn.class} px-3 py-1 rounded text-sm flex items-center transition`} disabled={btn.disabled ?? false}>
                            {btn.icon && <i className={`${btn.icon} mr-1`}></i>} &nbsp;
                            {btn.label}
                        </button>
                        );
                    }
                    return null;
                    })}
                </div>
            )}
        </div>
    );
};

export default Breadcrumb;
