import Contact from "./Contact"
import { v4 as uuidv4 } from "uuid";

const Contacts = ({persons, filter, deleteContact}) => {

  let filteredContacts = persons;

  if (filter && filter.trim() !== "") {
    filteredContacts = persons.filter((item) => {
      return item.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  return (
    <div className="flex flex-col my-4">
      <h2 className="text-2xl font-semibold my-2">Contacts</h2>
        <ul className="flex flex-col gap-4">
          {filteredContacts.map((person) => {
            const uniqueKey = uuidv4();
           return <Contact key={uniqueKey} person={person} onDelete={deleteContact}/>
          })}
        </ul>
    </div>
  )
}

export default Contacts