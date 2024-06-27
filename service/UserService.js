const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/User');
const logger = require('../utils/logger');

const SECRET_KEY = "your-secret-key"; // Replace with your own secret key

// User service class
class UserService {

    // Function to create a new user
    static async createNewUser(userData) {
        try {
            logger.info('Creating new user');
            logger.debug('Creating new user:', userData);
            // Generate a hashed password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            //Check if user exists
            const userExists = await User.findOne({ $or: [{ username: userData.username }, { email: userData.email }] });
            if (userExists) {
                throw new Error('User already exists');
            }

            // Create a new user in the database
            const newUser = {
                username: userData.username,
                email: userData.email,
                bookmarks: [],
                // Add any other user details here
            };

            // Generate a JWT token with user details (excluding password)
            const token = jwt.sign(
                {
                    username: newUser.username,
                    email: newUser.email,
                    // Add any other user details here
                },
                SECRET_KEY, // Replace with your own secret key
                { expiresIn: '24h' } // Set token expiration time
            );
            User.create({ ...newUser, password: hashedPassword });
            logger.info('New user created');
            logger.debug('New user created:', newUser);
            // Return the JWT token
            return {token, username: newUser.username, email: newUser.email, bookmarks: newUser.bookmarks};
        } catch (error) {
            // Handle error
            logger.error('Error creating new user:', error);
            console.error('Error creating new user:', error);
            throw error;
        }
    }

    // Function to login a user
    static async loginUser(userData) {
        try {
            logger.info('Logging in user');
            logger.debug('Logging in user:', userData);
            // Retrieve the user from the database based on the provided username or email
            const user = await User.findOne({
                $or: [{ username: userData.username }, { email: userData.email }],
            });

            // Check if the user exists
            if (!user) {
                throw new Error('Invalid username or email');
            }

            // Compare the provided password with the hashed password stored in the database
            const isPasswordValid = await bcrypt.compare(userData.password, user.password);

            // Check if the password is valid
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            // Generate a JWT token with user details (excluding password)
            const token = jwt.sign(
                {
                    username: user.username,
                    email: user.email,
                    bookmarks: user.bookmarks,
                    // Add any other user details here
                },
                SECRET_KEY, // Replace with your own secret key
                { expiresIn: '24h' } // Set token expiration time
            );

            // Return the JWT token
            logger.info('User logged in');
            logger.debug('User logged in:', user);
            return {token, username: user.username, email: user.email, bookmarks: user.bookmarks};
        } catch (error) {
            // Handle error
            logger.error('Error logging in user:', error);  
            console.error('Error logging in user:', error);
            throw error;
        }
    }

    // Function to add a bookmark for a user
    static async addBookmark(username, userData) {
        try {
            logger.info('Adding bookmark');
            logger.debug('Adding bookmark:', userData);
            // Retrieve the user from the database based on the provided email
            const user = await User.findOne({ username: username });

            // Check if the user exists
            if (!user) {
                throw new Error('User not found');
            }

            // Check if the bookmark already exists
            if (user.bookmarks.includes(userData.blogId)) {
                return {username: user.username, bookmarks: user.bookmarks}
            }

            // Add the bookmark to the user's bookmarks
            user.bookmarks.push(userData.blogId);

            // Save the updated user in the database
            await user.save();

            // Return success message
            logger.info('Bookmark added');
            logger.debug('Bookmark added:', user);
            return {username: user.username, bookmarks: user.bookmarks}
        } catch (error) {
            // Handle error
            logger.error('Error adding bookmark:', error);
            console.error('Error adding bookmark:', error);
            throw error;
        }
    }

    // Function to remove a bookmark for a user
    static async removeBookmark(username, userData) {
        try {
            logger.info('Removing bookmark');
            logger.debug('Removing bookmark:', userData);
            // Retrieve the user from the database based on the provided email
            const user = await User.findOne({ username: username});

            // Check if the user exists
            if (!user) {
                throw new Error('User not found');
            }

            // Check if the bookmark exists
            if (!user.bookmarks.includes(userData.blogId)) {
                throw new Error('Bookmark not found');
            }

            // Remove the bookmark from the user's bookmarks
            user.bookmarks = user.bookmarks.filter((bookmark) => bookmark !== userData.blogId);

            // Save the updated user in the database
            await user.save();

            // Return success message
            logger.info('Bookmark removed');
            logger.debug('Bookmark removed:', user);
            return {username: user.username, email: user.email, bookmarks: user.bookmarks};
        } catch (error) {
            // Handle error
            logger.error('Error removing bookmark:', error);
            console.error('Error removing bookmark:', error);
            throw error;
        }
    }

    // Function to get user details
    static async getUserDetails(username) {
        try {
            logger.info('Getting user details');
            logger.debug('Getting user details:', username);
            // Retrieve the user from the database based on the provided username
            const user = await User.findOne({ username: username });

            // Check if the user exists
            if (!user) {
                throw new Error('User not found');
            }

            // Return the user details (excluding password)
            logger.info('User details retrieved');
            logger.debug('User details retrieved:', user);
            return {
                username: user.username,
                email: user.email,
                bookmarks: user.bookmarks,
                // Add any other user details here
            };
        } catch (error) {
            // Handle error
            logger.error('Error getting user details:', error);
            console.error('Error getting user details:', error);
            throw error;
        }
    }

    // Function to update user password
    static async updateUserPassword(username, userData) {
        try {
            logger.info('Updating user password');
            logger.debug('Updating user password:', userData);
            if (!userData.password) {
                throw new Error('password is required');
            }
            // Retrieve the user from the database based on the provided email
            const user = await User.findOne({ username: username });

            // Check if the user exists
            if (!user) {
                throw new Error('User not found');
            }

            // Generate a hashed password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Update the user's password
            user.password = hashedPassword;

            // Save the updated user in the database
            await user.save();

            // Return success message
            logger.info('User password updated');
            logger.debug('User password updated:', user);
            return {username: user.username, email: user.email, bookmarks: user.bookmarks};
        } catch (error) {
            // Handle error
            logger.error('Error updating user password:', error);
            console.error('Error updating user password:', error);
            throw error;
        }
    }

    // Function to delete a user
    static async deleteUser(userData) {
        try {
            logger.info('Deleting user');
            logger.debug('Deleting user:', userData);
            // Retrieve the user from the database based on the provided email
            const user = await User.findOne({ email: userData.email });

            // Check if the user exists
            if (!user) {
                throw new Error('User not found');
            }

            // Delete the user from the database
            await user.remove();

            // Return success message
            logger.info('User deleted');
            logger.debug('User deleted:', user);
            return {success: true, message: 'User deleted successfully'};
        } catch (error) {
            // Handle error
            logger.error('Error deleting user:', error);
            console.error('Error deleting user:', error);
            throw error;
        }
    }
    
    // Function to get all users
    static async getAllUsers() {
        try {
            logger.info('Getting all users');
            // Retrieve all users from the database
            const users = await User.find();

            // Return the list of users (excluding passwords)
            logger.info('All users retrieved');
            return users.map((user) => ({
                username: user.username,
                email: user.email,
                bookmarks: user.bookmarks,
                // Add any other user details here
            }));
        } catch (error) {
            // Handle error
            logger.error('Error getting all users:', error);
            console.error('Error getting all users:', error);
            throw error;
        }
    }
}

module.exports = UserService;