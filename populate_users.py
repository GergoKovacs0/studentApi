import requests

# URL of your local server
url = "http://localhost:3000/api/users"

for i in range(1, 11):
  response = requests.delete(f"{url}/{i}")
  if response.status_code == 200:
    print(f"User {i} deleted successfully.")
  else:
    print(f"Failed to delete user {i}. Status code: {response.status_code}, Message: {response.json()}")

# List of users to be added
users = [
    {"firstName": "John", "lastName": "Doe", "email": "john.doe1@example.com", "className": "A"},
    {"firstName": "Jane", "lastName": "Doe", "email": "jane.doe2@example.com", "className": "B"},
    {"firstName": "Jim", "lastName": "Beam", "email": "jim.beam3@example.com", "className": "C"},
    {"firstName": "Jack", "lastName": "Daniels", "email": "jack.daniels4@example.com", "className": "D"},
    {"firstName": "Johnny", "lastName": "Walker", "email": "johnny.walker5@example.com", "className": "E"},
    {"firstName": "Jameson", "lastName": "Irish", "email": "jameson.irish6@example.com", "className": "F"},
    {"firstName": "Jose", "lastName": "Cuervo", "email": "jose.cuervo7@example.com", "className": "G"},
    {"firstName": "Captain", "lastName": "Morgan", "email": "captain.morgan8@example.com", "className": "H"},
    {"firstName": "Evan", "lastName": "Williams", "email": "evan.williams9@example.com", "className": "I"},
    {"firstName": "Wild", "lastName": "Turkey", "email": "wild.turkey10@example.com", "className": "J"},
]

# Function to create a user
def create_user(user):
    response = requests.post(url, json=user)
    if response.status_code == 201:
        print(f"User {user['firstName']} {user['lastName']} created successfully.")
    else:
        print(f"Failed to create user {user['firstName']} {user['lastName']}. Status code: {response.status_code}, Message: {response.json()}")

# Create users
for user in users:
    create_user(user)