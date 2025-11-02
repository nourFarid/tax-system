const Breadcrumb = ({ items = [], button = [] }) => {
    const runFunction = (fnString) => {
        // You can handle dynamic functions safely here (avoid eval if possible)
        try {
            // eslint-disable-next-line no-eval
            eval(fnString);
        } catch (e) {
            console.error("Error running function:", e);
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-between bg-white rounded shadow-sm p-2 mb-3">
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
                                <a href={item.link} className="hover:underline">
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
                    {button.map((btn, idx) => (
                        <a
                            key={idx}
                            href={btn.link || "#"}
                            className={`${btn.class || "bg-blue-600 hover:bg-blue-700 text-white"
                                } px-3 py-1 rounded text-sm flex items-center transition`}
                        >
                            {btn.icon && <i className={`${btn.icon} mr-1`}></i>}
                            {btn.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Breadcrumb;
