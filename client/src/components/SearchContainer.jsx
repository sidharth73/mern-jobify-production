import Wrapper from "../assets/wrappers/SearchContainer";
import { useAppContext } from "../context/appContext";
import FormRow from "./FormRow";
import FormRowSelect from "./FormRowSelect";

const SearchContainer = () => {
    const {
        isLoading,
        search,
        searchStatus,
        searchType,
        sort,
        sortOptions,
        statusOptions,
        jobTypeOptions,
        handleChange,
        clearFilters
    } = useAppContext()

    const handleSearch = (e) => {
        if (isLoading) return
        handleChange({ name: e.target.name, value: e.target.value })
    }
    
    return (
        <Wrapper>
           <form className="form">
           <h4>Search Form</h4>
           {
            <div className="form-center">
              <FormRow
               type='text'
               name='search'
               value={search}
               handleChange={handleSearch}
              >

              </FormRow>
              <FormRowSelect
              labelText='job status'
              name='searchStatus'
              value={searchStatus}
              handleChange={handleSearch}
              list={['all', ...statusOptions]}
              ></FormRowSelect>

              <FormRowSelect
              labelText='job type'
              name='searchType'
              value={searchType}
              handleChange={handleSearch}
              list={['all', ...jobTypeOptions]}
              ></FormRowSelect>

              <FormRowSelect
              labelText='sort'
              name='sort'
              value={sort}
              handleChange={handleSearch}
              list={sortOptions}
              >
              </FormRowSelect>
              <button className='btn btn-block btn-danger'
               disabled={isLoading} onClick={clearFilters}>Clear Filters</button>
            </div>
           }
           </form>
        </Wrapper>
    )
}

export default SearchContainer