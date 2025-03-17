import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // State to store the complaint details
  const [complaintDetails, setComplaintDetails] = useState({
    name: '',
    email: '',
    phone: '',
    complain: ''
  });

  // Track if we are still waiting for all complaint parameters
  const [complaintReady, setComplaintReady] = useState(false);

  // Function to handle text query
  const textQuery = async (textMsg) => {
    // User's message
    const userConversation = {
      who: 'user',
      content: { text: textMsg },
    };

    // Update chat with user's message
    setChatMessages((prevMessages) => [...prevMessages, userConversation]);

    const message = { text: textMsg };

    try {
      // Send request to Dialogflow
      const response = await axios.post(
        'http://localhost:8000/chatbot/dialogflow/textQuery',
        message
      );

      // Loop through bot responses and update the chat
      for (let botResponse of response.data.fulfillmentMessages) {
        const botConversation = {
          who: 'bot',
          content: botResponse,
        };
        setChatMessages((prevMessages) => [...prevMessages, botConversation]);
      }

    // Extract name correctly from structValue
    // Extract parameters from Dialogflow response
    const { name, email, phone, complaint } = response.data.parameters.fields;

    const extractedName = name?.structValue?.fields?.name?.stringValue || complaintDetails.name;
    const extractedEmail = email?.stringValue || complaintDetails.email;
    const extractedPhone = phone?.stringValue || complaintDetails.phone;
    const extractedComplaint = complaint?.stringValue || complaintDetails.complain;

    // Update complaintDetails state with the new parameters from Dialogflow
    setComplaintDetails((prevDetails) => ({
      ...prevDetails,
      name: extractedName,
      email: extractedEmail,
      phone: extractedPhone,
      complain: extractedComplaint,
      }));

    } catch (error) {
      console.error('Error with Dialogflow:', error);

      // Inform user about the error in dialogflow processing
      const botErrorMessage = {
        who: 'bot',
        content: {
          text: 'There was an error processing your request. Please try again later.',
        },
      };
      setChatMessages((prevMessages) => [...prevMessages, botErrorMessage]);
    }
  };

  // Function to lodge the complaint
  const lodgeComplaint = async () => {
    const { name, email, phone, complain } = complaintDetails;
  
    if (name && email && phone && complain) {
      try {
        // Send the complaint details to the backend
        const response = await axios.post(
          'http://localhost:8000/complain/createComplain',
          complaintDetails
        );
  
        console.log('Complaint lodged:', response.data);
  
        // Notify the user that the complaint has been successfully lodged
        const botSuccessMessage = {
          who: 'bot',
          content: {
            text: {
              text: [
                `Your complaint has been successfully lodged.\n\nHere are the details:\n\n**Name**: ${response.data.name}\n**Email**: ${response.data.email}\n**Phone**: ${response.data.phone}\n**Complaint**: ${response.data.complain}`
              ]
            },
            message: 'text'
          }
        };
        setChatMessages((prevMessages) => [...prevMessages, botSuccessMessage]);
  
      } catch (error) {
        console.error('Error saving complaint:', error);
  
        // Inform the user about the error when saving the complaint
        const botErrorMessage = {
          who: 'bot',
          content: {
            text: 'There was an error lodging your complaint. Please try again later.',
          },
        };
        setChatMessages((prevMessages) => [...prevMessages, botErrorMessage]);
      }
    }
  };
  

  //check the complaint details
  useEffect(() => {
    console.log('Complaint Details:', complaintDetails);
  }, [complaintDetails]);

  // Check if all parameters are collected and ready to lodge the complaint
  useEffect(() => {
    const { name, email, phone, complain} = complaintDetails;
    if (name && email && phone && complain) {
      setComplaintReady(true); // Set flag to true when all data is available
    }
  }, [complaintDetails]);

  // Handle the final submission to lodge the complaint
  useEffect(() => {
    if (complaintReady) {
      lodgeComplaint(); // Lodge the complaint once all details are collected
      setComplaintReady(false); // Reset flag after lodging the complaint
    }
  }, [complaintReady]);

  // Function to handle event query
  const eventQuery = async (event) => {
    // Prepare message object for the API call
    const eventMessage = {
      event: event,
    };

    try {
      // Send the request to your backend's Dialogflow route
      const response = await axios.post(
        'http://localhost:8000/chatbot/dialogflow/eventQuery',
        eventMessage
      );

      // Loop through bot responses and update the chat
      for (let botResponse of response.data.fulfillmentMessages) {
        const botConversation = {
          who: 'bot',
          content: botResponse,
        };

        // Update chat with bot's response
        setChatMessages((prevMessages) => [...prevMessages, botConversation]);
      }

    } catch (error) {
      console.error('Error with eventQuery:', error);
    }
  };

  // Handle when the user submits a message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userMessage) {
      textQuery(userMessage);
      setUserMessage(''); // Clear input field
    }
  };

  // Toggle the chat box open and close
  const handleChatIconClick = () => {
    setIsOpen(!isOpen);
    eventQuery('welcomeToChatBot');
  };

  return (
    <div className="relative">
      <button
        className="fixed bottom-4 right-4 p-3 h-auto w-auto bg-lime-500 text-white rounded-s-full shadow-lg"
        onClick={handleChatIconClick}>
        Chat
      </button>

      {isOpen && (
        <div className="fixed z-50 bottom-16 mb-3 right-4 w-96 h-auto p-3 bg-white border border-gray-300 shadow-lg rounded-lg">
          <div className="h-96 overflow-y-scroll no-scroll mb-2 p-1 bg-white">
            {/* Render chat messages */}
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.who === 'bot' ? 'text-left' : 'text-right'}`}
              >
                {/* Check if the message has buttons in the payload */}
                {msg.content.payload ? (
                  <div className="inline-block">
                    {msg.content.payload.fields.buttons.listValue.values.map((button, i) => (
                      <button
                        key={i}
                        className="m-1 p-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => textQuery(button.structValue.fields.text.stringValue)}
                      >
                        {button.structValue.fields.text.stringValue}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      msg.who === 'bot' ? 'bg-gray-200' : 'bg-blue-500 text-white'
                    }`}
                  >
                    {msg.who === 'bot' ? msg.content.text.text : msg.content.text}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type a message..."
              className="border border-gray-300 p-2 rounded-l flex-grow"
              required
            />
            <button
              type="submit"
              className="p-2 bg-lime-500 text-white rounded-r"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
