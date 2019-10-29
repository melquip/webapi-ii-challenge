import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialUserFormState = {
	name: "",
	bio: "",
}
function App() {
	const [users, setUsers] = useState([]);
	const [userForm, setUserForm] = useState(initialUserFormState);
	const [isEditingUser, setEditingUser] = useState(0);

	useEffect(() => {
		axios.get('http://localhost:4000/api/users').then(response => {
			setUsers(response.data);
		}).catch(err => console.log(err));
	}, []);
	
	const onUserInputChange = e => {
		setUserForm({ ...userForm, [e.target.name]: e.target.value });
	}

	const onUserSubmit = e => {
		e.preventDefault();
		if (isEditingUser === 0) {
			axios.post('http://localhost:4000/api/users', userForm).then(response => {
				setUsers([...users, { ...userForm, id: response.data.id }]);
			}).catch(err => console.log(err));
		} else {
			axios.put('http://localhost:4000/api/users/' + isEditingUser, userForm).then(response => {
				setUsers(users.map(user => {
					if (Number(user.id) === isEditingUser) return { ...user, ...userForm }
					return user;
				}));
			}).catch(err => console.log(err));
		}
		setUserForm(initialUserFormState);
		setEditingUser(0);
	}

	const removeUser = id => e => {
		axios.delete('http://localhost:4000/api/users/' + id).then(response => {
			setUsers(users.filter(user => Number(user.id) !== Number(id)));
		}).catch(err => console.log(err));
	}

	const editUser = id => e => {
		setEditingUser(id);
		setUserForm(users.find(user => Number(user.id) === Number(id)))
	}

	return (
		<div className="App">
			{
				users ? users.map(user => (
					<div key={user.id} className="user">
						<p>ID: {user.id}</p>
						<p>Name: {user.name}</p>
						<p>Bio: {user.bio}</p>
						<button className="removeUser" onClick={removeUser(user.id)}>Remove</button>
						<button className="editUser" onClick={editUser(user.id)}>Edit</button>
					</div>
				)) : null
			}
			<br />
			<form onSubmit={onUserSubmit}>
				<input
					type="text"
					name="name"
					placeholder="User name here"
					required
					value={userForm.name}
					onChange={onUserInputChange}
				/>
				<input
					type="text"
					name="bio"
					placeholder="User bio here"
					required
					value={userForm.bio}
					onChange={onUserInputChange}
				/>
				<button className="submitUser">Submit</button>
			</form>
		</div>
	);
}

export default App;
