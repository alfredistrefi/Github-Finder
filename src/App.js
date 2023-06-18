import React, { useState } from 'react'; // Importing React and useState hook from 'react' module
import './App.css'; // Importing CSS styles from 'App.css' file
import 'bootstrap/dist/css/bootstrap.css'; // Importing Bootstrap CSS styles
import '@fortawesome/fontawesome-free/css/all.css'; // Importing Font Awesome CSS styles

const App = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State variable for storing the search query
  const [loading, setLoading] = useState(false); // State variable for indicating loading state
  const [users, setUsers] = useState([]); // State variable for storing the list of users

  const handleChange = (event) => { // Event handler for input value change
    setSearchQuery(event.target.value); // Updating searchQuery state with new value
  };

  const handleSubmit = async (event) => { // Event handler for form submission
    event.preventDefault(); // Preventing default form submission behavior
    setLoading(true); // Setting loading state to true

    try {
      const response = await fetch(`https://api.github.com/search/users?q=${searchQuery}`); // Making API request to GitHub search API
      const data = await response.json(); // Parsing the response data

      if (data.items) { // If users were found
        const fetchedUsers = data.items; // Extracting the list of users from the response
        const updatedUsers = await Promise.all( // Fetching additional details for each user
          fetchedUsers.map(async (user) => {
            const userDetailsResponse = await fetch(user.url); // Making API request to user details endpoint
            const userDetails = await userDetailsResponse.json(); // Parsing the user details response
            return { // Creating a new user object with additional details
              ...user,
              followers: userDetails.followers,
              following: userDetails.following,
            };
          })
        );
        setUsers(updatedUsers); // Updating users state with the updated array of users
      } else {
        setUsers([]); // Setting users state to an empty array if no users were found
      }
    } catch (error) {
      // Handle any errors
      console.error('Error:', error);
    } finally {
      setLoading(false); // Setting loading state to false
    }
  };

  const handleKeyPress = (event) => { // Event handler for key press
    if (event.key === 'Enter') { // If Enter key is pressed
      handleSubmit(event); // Call the handleSubmit function
    }
  };

  return (
    <div>
      <div className="search-box-container">
        <div className="col-lg-12 text-center"></div>
        <div className="col-md-4 offset-md-4 mt-5 pt-3">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search ....."
              aria-label="Recipient's username"
              value={searchQuery}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
            <div className="input-group-append">
              {/* Additional elements can be added here */}
            </div>
          </div>
        </div>

        {loading && <p>Loading...</p>} {/* Render "Loading..." if loading state is true */}

        {users.length > 0 && ( // Render user list if there are users in the array
          <div className="users">
            <ul className="column-container">
              {users.map((user) => (
                <li className="id" key={user.id}>
                  <figure>
                    <img className="avatar" src={user.avatar_url} alt={`${user.login}'s avatar`} />
                    <figcaption>{user.login}</figcaption>
                    <p className='fllw'>Followers: {user.followers}</p>
                    <p className='fllw'>Following: {user.following}</p>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        )}

        {users.length === 0 && !loading && <p>No users found.</p>} {/* Render "No users found." if there are no users */}
      </div>
    </div>
  );
};

export default App; // Exporting the App component
