import { ChangeEvent } from "react";

type SearchProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const Search: React.FC<SearchProps> = ({ searchTerm, setSearchTerm }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />

        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Search;
