import mongoose from "mongoose"
let db: mongoose.Connection

const connect = ({ connectionUrl }) => {
	console.log("connection to mongodb")
	try {
		mongoose.connect(connectionUrl, {
		})
		db = mongoose.connection;
		db.on('error', (error: Error) => {
			console.error('MongoDB connection error:', error);
		});
		db.once('open', () => {
			console.log('Connected to MongoDB');
		});
		db.on('disconnected', () => {
			console.log('Disconnected from MongoDB');
		});
		process.on('SIGINT', () => {
			mongoose.connection.close();
		});
	} catch (error) {
		console.error('error', error?.message ?? error);
		console.error('Error connecting to MongoDB:', error.message);

		// Handle specific error conditions
		if (error.name === 'MongoNetworkError') {
			console.error('Network error occurred. Check your MongoDB server.');
		} else if (error.name === 'MongooseServerSelectionError') {
			console.error('Server selection error. Ensure'
				+ ' MongoDB is running and accessible.');
		} else {
			// Handle other types of errors
			console.error('An unexpected error occurred:', error);
		}
	}

}

const disconnet = () => {
	mongoose.connection.close();
}

export { connect, db, disconnet }

