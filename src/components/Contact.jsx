const Contact = ({person, onDelete}) => {
  return (
    <div className="flex">
      <li className="text-lg" >{person.name} : {person.number}</li>
        <button type='button' className="w-auto px-2 py-1 rounded-md bg-slate-500 ml-2 hover:bg-slate-400 transition duration-300" onClick={() => onDelete(person.id)} >Delete</button>
    </div>
  )
}

export default Contact