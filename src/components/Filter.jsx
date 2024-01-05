const Filter = ({filter, setFilter}) => {
  const handleFilter = (e) => {
    setFilter(e.target.value)
    console.log(e.target.value);
  }
  return (
    <div className="flex my-2">
      <label>Filter</label>
      <input type="text" value={filter} onChange={handleFilter} className="bg-slate-300 px-2 py-1 ml-2 rounded-md outline-none text-slate-600"/>
    </div>
  )
}

export default Filter