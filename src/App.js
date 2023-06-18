import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';

const App = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Event handler for input field change
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Event handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // API call to search for users
      const response = await fetch(`https://api.github.com/search/users?q=${searchQuery}`, {
        headers: {
          Authorization: 'Bearer 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',
        },
      });
      const data = await response.json();

      if (response.ok) {
        const fetchedUsers = data.items;

        // Fetch additional details for each user
        const updatedUsers = await Promise.all(
          fetchedUsers.map(async (user) => {
            // API call to fetch user details
            const userDetailsResponse = await fetch(user.url, {
              headers: {
                Authorization: 'Bearer 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',
              },
            });
            const userDetails = await userDetailsResponse.json();

            // API call to fetch user's repositories
            const repoResponse = await fetch(userDetails.repos_url, {
              headers: {
                Authorization: 'Bearer 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',
              },
            });
            const repos = await repoResponse.json();

            // Return updated user object with additional data
            return {
              ...user,
              followers: userDetails.followers,
              following: userDetails.following,
              repoCount: repos.length,
            };
          })
        );

        // Update the state with the fetched users
        setUsers(updatedUsers);
      } else {
        // Reset the user list if the response is not successful
        setUsers([]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event handler for handling Enter key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
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
            <div className="input-group-append"></div>
          </div>
        </div>

        {loading && <p>Loading...</p>}

        {users.length > 0 && (
          <div className="users">
            <ul className="column-container">
              {users.map((user) => (
                <li className="id" key={user.id}>
                  <figure>
                    <img className="avatar" src={user.avatar_url} alt={`${user.login}'s avatar`} />
                    <figcaption>{user.login}</figcaption>
                    <p className='fllw'>Repositories: {user.repoCount}</p>
                    <p className='fllw'>Followers: {user.followers}</p>
                    <p className='fllw'>Following: {user.following}</p>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        )}

        {users.length === 0 && !loading && <p>No users found.</p>}
      </div>
    </div>
  );
};

export default App;

