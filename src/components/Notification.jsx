const Notification = ({message}) => {
  if(message === null) {
    return null
  }
  return (
    <div className="bg-slate-300 mb-3 p-3 rounded-md border border-solid text-green-500">
      {message}
    </div>
  )
}

export default Notification