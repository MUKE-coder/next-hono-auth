const BOOK_PAGE_COUNT = 18;

export const BookLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="book flex items-center justify-center">
        <div className="inner">
          <div className="left"></div>
          <div className="middle"></div>
          <div className="right"></div>
        </div>
        <ul>
          {Array.from({ length: BOOK_PAGE_COUNT }).map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
      </div>
    </div>
  );
};
