import { useState } from "react"
import services from "../services/persons.js"

const AddContact = ({persons,setPersons,addContact, setMssg}) => {
  const[contact,setContact] = useState({name: '', number: ''})

  const addOrUpdateContact = (e) => {
    e.preventDefault()
    if(!contact.name || !contact.number) return;

    const existingContact = persons.find((item) => item.name === contact.name)
    console.log("existing contact",existingContact); //object type
    
    if(existingContact === undefined) {
      // const generateRandomId = () => {
      //   const minId = 1
      //   const maxId = 1000000
    
      //   const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId
      //   return randomId
      // }

      const newObj = {
        // id:generateRandomId(),
        name:contact.name,
        number:contact.number,
      }
  
      //ADDING A NEW CONTACT
      services
      .create(newObj)
      .then(contact => {
        console.log('Contact added to the server :', newObj.name);
        addContact(contact)
  
        setMssg(`Added ${contact.name}`);
        setTimeout(() => {
          setMssg(null);
        }, 5000);
  
        setContact({name: '', number:''})
      })
      .catch(error => {
        console.error('Error adding contact:', error);
        setMssg('Error adding contact');
        setTimeout(() => {
          setMssg(null);
        }, 5000);
      });
        
    } else {
      const confirmation = 
      window.confirm(`${existingContact.name} is already added to the directory, do you wish to replace the old number with the new one ?`)
      console.log(confirmation)

      if(confirmation) {
        const updatedContact = {...existingContact, number: contact.number}
        console.log(updatedContact)


        //UPDATING AN EXISTING CONTACT
        services
        .update(updatedContact.id,updatedContact)
        .then(updatedObj => {
          //updating existing contact on the id we found by using '==='
          setPersons(prevPersons => prevPersons.map(dataItem => 
            dataItem.id === existingContact.id ? updatedObj : dataItem
          )) 

          setMssg(`${updatedObj.name} has been updated`);
          setTimeout(() => {
            setMssg(null);
          }, 5000);

          console.log(updatedContact.number);
          setContact({name: '', number:''})
        })
        .catch(error => {
          console.error('Error updating contact:', error);
          setMssg('Error updating contact');
        });
      } 
      return; //If clicked on cancel, it will simply do nothing
    }
  }
  
  //INPUT HANDLING
  const handleInputChange = (e) => {
    const{name,value} = e.target
    console.log(e.target.value);
    setContact({...contact, [name]: value})
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={addOrUpdateContact}>
      <div>
       <label>Name</label>
          <input type="text" className="bg-slate-300 outline-none ml-2 rounded-md px-2 py-1 text-slate-600" name="name" value={contact.name} onChange={handleInputChange}/>
        </div>

        <div>
          <label>Number</label>
          <input type="number" className="bg-slate-300 outline-none ml-2 rounded-md px-2 py-1 text-slate-600" name="number" value={contact.number} onChange={handleInputChange}/>
        </div>

        <div>
        <button type="submit" className="w-auto px-2 py-1 bg-blue-500 rounded-md text-white hover:bg-blue-300 transition duration-300 hover:text-slate-800">Add</button>
        </div>
    </form>
  )
}

export default AddContact