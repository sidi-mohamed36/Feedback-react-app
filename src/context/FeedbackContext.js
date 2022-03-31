import { createContext, useState,useEffect} from 'react'
import { v4 as uuidv4} from 'uuid'
const FeedbackContext = createContext()

export const FeedbackProvider =({children}) =>{
    const [isLoading, setIsLoading] = useState(true)
    const [feedback,setFeedback]= useState([
        {
            id: 1,
            text: 'This is feedback item 1',
            rating: 10,
        },
        {
            id: 2,
            text: 'This is feedback item 2',
            rating: 9,
        },
        {
            id: 3,
            text: 'This is feedback item 3',
            rating: 7,
        },
    ])
    const [feedbackEdit, setFeedbackEdit] = useState({
        item: {},
        edit: false,
      })
    
    // Delete feedback
  const deleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await fetch(`/feedback/${id}`, { method: 'DELETE' })

      setFeedback(feedback.filter((item) => item.id !== id))
    }
  }

    const updateFeedback = async (id, updItem) => {
        const response = await fetch(`/feedback/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updItem),
        })
    
        const data = await response.json()
    
        // NOTE: no need to spread data and item
        setFeedback(feedback.map((item) => (item.id === id ? data : item)))
    
        
        
        setFeedbackEdit({
          item: {},
          edit: false,
        })
      }
    

     // Set item to be updated
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true
    })
  }
  useEffect(()=>{
    fetchFeedback()
  },[])
  // Fetch feedback
  const fetchFeedback =async () =>{
      const response = await fetch(`/feedback/?_sort=id&_order=desc`)
      const data = await response.json()
      setFeedback(data)
      setIsLoading(false)
  }
  // Add feedback
  const addFeedback = async (newFeedback) => {
    const response = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedback),
    })

    const data = await response.json()

    setFeedback([data, ...feedback])
  }
  return (
      <FeedbackContext.Provider value={{ feedback,isLoading, deleteFeedback, addFeedback, editFeedback,updateFeedback,feedbackEdit,}}
      >
          {children}
      </FeedbackContext.Provider>
  )
}

export default FeedbackContext