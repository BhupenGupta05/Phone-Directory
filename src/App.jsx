import { useState, useEffect } from "react"
import AddContact from "./components/AddContact"
import Contacts from "./components/Contacts"
import Filter from "./components/Filter"
import services from "./services/persons.js"
import Notification from "./components/Notification"

const App = () => {
  const initialContacts = [
    { name: 'Bhupen Gupta',number: '7011179605', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]

  const [persons,setPersons] = useState([])
  const[filter,setFilter] = useState('')
  const[mssg,setMssg] = useState(null)


  const addNewContact = (newContact) => {
    setPersons((prevPersons) => [...prevPersons, newContact])
  }

  
  // const hook = () => {
  //   console.log('effect');
  //   axios
  //   .get('http://localhost:3001/data')
  //   .then(response => {
  //     console.log('fulfilled');
  //     setPersons(response.data)
  //   })
  // }
  
  // useEffect(hook,[])

  useEffect(() => {
    services
    .getAll()
    .then(allContacts => {
      setPersons(allContacts)})
  },[])


  const deleteResource = (id) => {
    const contactToBeDeleted = persons.find((person) => person.id === id) //to display the name in alertbox
    console.log(contactToBeDeleted);

    if(contactToBeDeleted) {
      const confirmation = window.confirm(`Delete ${contactToBeDeleted.name} ?`)

      if(confirmation) {
        services
        .remove(id)
        .then(response => {
          console.log('Resource deleted successfully');
          setMssg('Contact deleted successfully')
          setTimeout(() => {
            setMssg(null);
          }, 5000);
          const updatedPersons = persons.filter(person => person.id !== id);
          setPersons(updatedPersons);
        })
        .catch(error => {
          console.error('Error deleting resource:', error);
          setMssg(`Contact '${contactToBeDeleted.name}' was already removed from the server`)
          setTimeout(() => {
            setMssg(null);
          }, 5000);
          // Handle the error as needed (e.g., show an error message to the user)
        });
      };
    }
  }

  return (
    <div className="flex flex-col ml-8">
      <h2 className="ml-8 text-3xl font-bold my-2">Phonebook</h2>
      <Notification message={mssg}/>
      <Filter filter={filter} setFilter={setFilter}/>
      <AddContact addContact={addNewContact} persons={persons} setPersons={setPersons} setMssg={setMssg}/>
      <Contacts persons={persons} filter={filter} deleteContact={deleteResource}/>
    </div>
  )
}

export default App